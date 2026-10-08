'use strict';
// Shared logic for the client review system. No database: reviews live in data/reviews.json in the repo,
// written through the GitHub API (or a local file when REVIEW_STORE_FILE is set, used for tests).
const crypto = require('crypto');
const fs = require('fs');

const FILE_PATH = 'data/reviews.json';
const KINDS = ['Website', 'E-commerce store', 'Web app / platform', 'Mobile app', 'Branding / design', 'Other'];

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');

function secret() {
    const s = process.env.REVIEW_SECRET;
    if (!s || s.length < 16) throw new Error('REVIEW_SECRET is not set (min 16 chars).');
    return s;
}
function sign(payload) {
    return b64url(crypto.createHmac('sha256', secret()).update(payload).digest()).slice(0, 27);
}
function safeEqual(a, b) {
    const x = Buffer.from(String(a)), y = Buffer.from(String(b));
    return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function makeToken(label) {
    const id = crypto.randomBytes(8).toString('hex');
    const payload = b64url(JSON.stringify({ i: id, l: String(label || '').slice(0, 80) }));
    return payload + '.' + sign(payload);
}
function verifyToken(token) {
    if (typeof token !== 'string' || token.length > 400) return null;
    const [payload, sig] = token.split('.');
    if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
    try {
        const d = JSON.parse(fromB64url(payload).toString('utf8'));
        if (!/^[0-9a-f]{16}$/.test(d.i)) return null;
        return { id: d.i, label: typeof d.l === 'string' ? d.l : '' };
    } catch (e) { return null; }
}

/* ---------- storage ---------- */
function gh() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN is not set.');
    const repo = process.env.GITHUB_REPO || 'kavotech/kavo';
    const branch = process.env.GITHUB_BRANCH || 'master';
    return { token, repo, branch, base: `https://api.github.com/repos/${repo}/contents/${FILE_PATH}` };
}
async function readStore() {
    if (process.env.REVIEW_STORE_FILE) {
        const f = process.env.REVIEW_STORE_FILE;
        const list = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8') || '[]') : [];
        return { list, sha: null };
    }
    const g = gh();
    const r = await fetch(`${g.base}?ref=${encodeURIComponent(g.branch)}`, {
        headers: { Authorization: `Bearer ${g.token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'kavo-reviews' }
    });
    if (r.status === 404) return { list: [], sha: null };
    if (!r.ok) throw new Error(`GitHub read failed (${r.status}).`);
    const j = await r.json();
    const list = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8') || '[]');
    return { list, sha: j.sha };
}
async function writeStore(list, sha, message) {
    if (process.env.REVIEW_STORE_FILE) {
        fs.writeFileSync(process.env.REVIEW_STORE_FILE, JSON.stringify(list, null, 2));
        return;
    }
    const g = gh();
    const body = { message, branch: g.branch, content: Buffer.from(JSON.stringify(list, null, 2) + '\n').toString('base64') };
    if (sha) body.sha = sha;
    const r = await fetch(g.base, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${g.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'kavo-reviews' },
        body: JSON.stringify(body)
    });
    if (r.status === 409 || r.status === 422) { const e = new Error('conflict'); e.conflict = true; throw e; }
    if (!r.ok) throw new Error(`GitHub write failed (${r.status}).`);
}

/* ---------- validation ---------- */
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').trim().slice(0, max);
function validate(input) {
    const d = {
        company: clean(input.company, 80),
        project: clean(input.project, 100),
        kind: clean(input.kind, 40),
        name: clean(input.name, 60),
        role: clean(input.role, 60),
        text: clean(input.text, 1200),
        rating: Number(input.rating)
    };
    if (d.company.length < 2) return { error: 'Please enter your company name.' };
    if (!KINDS.includes(d.kind)) return { error: 'Please choose what we built for you.' };
    if (d.name.length < 2) return { error: 'Please enter your name.' };
    if (!Number.isInteger(d.rating) || d.rating < 1 || d.rating > 5) return { error: 'Please choose a star rating from 1 to 5.' };
    if (d.text.length < 20) return { error: 'Please write at least a sentence or two (20+ characters).' };
    return { data: d };
}

async function addReview(token, input) {
    const t = verifyToken(token);
    if (!t) return { status: 400, error: 'This review link is not valid.' };
    const v = validate(input || {});
    if (v.error) return { status: 400, error: v.error };
    for (let attempt = 0; attempt < 3; attempt++) {
        const { list, sha } = await readStore();
        if (list.some((r) => r.id === t.id)) return { status: 409, error: 'This review link has already been used. Thank you!' };
        list.unshift({ id: t.id, ...v.data, date: new Date().toISOString().slice(0, 10) });
        try {
            await writeStore(list, sha, `Add client review from ${v.data.company}`);
            return { status: 200, ok: true };
        } catch (e) {
            if (!e.conflict) throw e;
        }
    }
    return { status: 503, error: 'Busy right now. Please try again in a moment.' };
}
async function linkState(token) {
    const t = verifyToken(token);
    if (!t) return { status: 400, valid: false };
    const { list } = await readStore();
    return { status: 200, valid: true, used: list.some((r) => r.id === t.id), label: t.label };
}

module.exports = { KINDS, makeToken, verifyToken, addReview, linkState, safeEqual };
