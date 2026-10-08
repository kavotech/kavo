'use strict';
// Shared logic for the client review system. No database: reviews live in data/reviews.json in the repo,
// written through the GitHub API (or a local file when REVIEW_STORE_FILE is set, used for tests).
const crypto = require('crypto');
const fs = require('fs');

const FILE_PATH = 'data/reviews.json';
const KINDS = ['Website', 'E-commerce store', 'Web app / platform', 'Mobile app', 'Branding / design', 'Other'];

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const sha = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
let invites = [];
try { invites = require("../data/review-invites.json"); } catch (e) { invites = []; }
// A review link is a plain URL with a random code. The repo only stores the code's SHA-256 hash.
function verifyToken(code) {
    if (typeof code !== "string" || !/^[a-z0-9]{8,40}$/.test(code)) return null;
    const h = sha(code);
    const inv = invites.find((i) => i.h === h);
    return inv ? { id: h.slice(0, 16), label: inv.label || "" } : null;
}
function newCode() { return crypto.randomBytes(8).toString("hex").slice(0, 12); }
function inviteFor(code, label) { return { h: sha(code), label: label || "" }; }

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

module.exports = { KINDS, newCode, inviteFor, verifyToken, addReview, linkState };
