try {
    require('dotenv').config();
} catch (error) {
    // Ignore missing dotenv in environments that inject variables directly.
}

const crypto = require('crypto');

/*
 * Client review system.
 *
 * - Invite links are signed tokens (HMAC-SHA256 with REVIEW_LINK_SECRET), so
 *   only people you send a link to can leave a review. Each link works once.
 * - Reviews are stored in a Supabase table (see supabase/reviews.sql) and are
 *   only ever accessed server-side with the service role key.
 * - New reviews are published immediately. To hide one, set `published` to
 *   false in the Supabase table editor.
 */

const PROJECT_TYPES = [
    'Website',
    'E-commerce store',
    'Mobile app',
    'Web application / platform',
    'Business dashboard',
    'Booking system',
    'School management system',
    'UI/UX design',
    'SEO / Google Ads',
    'Social media',
    'Branding',
    'Other'
];

const PUBLIC_FIELDS = 'id,name,company,role,project_type,project_name,rating,body,created_at';
const DEFAULT_LINK_DAYS = 30;

class ReviewError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function getConfig() {
    const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const linkSecret = process.env.REVIEW_LINK_SECRET || '';
    const adminKey = process.env.REVIEW_ADMIN_KEY || '';
    const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://kavotech.uk').replace(/\/$/, '');
    return { supabaseUrl, serviceKey, linkSecret, adminKey, siteUrl };
}

function requireConfig(keys) {
    const config = getConfig();
    const missing = keys.filter((key) => !config[key]);
    if (missing.length) {
        console.error(`Review system is missing configuration: ${missing.join(', ')}`);
        throw new ReviewError(503, 'Reviews are not available right now. Please try again later.');
    }
    return config;
}

/* ------------------------------------------------------------- Invite links */

const b64url = (input) => Buffer.from(input).toString('base64url');
const sign = (payload, secret) => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

function clean(value, max) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function createInvite({ name, company, projectType, projectName, days } = {}) {
    const { linkSecret, siteUrl } = requireConfig(['linkSecret']);
    const lifetime = Math.min(Math.max(Number(days) || DEFAULT_LINK_DAYS, 1), 365);
    const payload = {
        id: crypto.randomBytes(9).toString('base64url'),
        exp: Date.now() + lifetime * 24 * 60 * 60 * 1000,
        n: clean(name, 80) || undefined,
        c: clean(company, 120) || undefined,
        t: PROJECT_TYPES.includes(projectType) ? projectType : undefined,
        p: clean(projectName, 120) || undefined
    };
    const body = b64url(JSON.stringify(payload));
    const token = `${body}.${sign(body, linkSecret)}`;
    return {
        token,
        url: `${siteUrl}/review?invite=${encodeURIComponent(token)}`,
        expiresAt: new Date(payload.exp).toISOString()
    };
}

function readInvite(token) {
    const { linkSecret } = requireConfig(['linkSecret']);
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature) throw new ReviewError(400, 'This review link is not valid.');

    const expected = sign(body, linkSecret);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        throw new ReviewError(400, 'This review link is not valid.');
    }

    let payload;
    try {
        payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    } catch (error) {
        throw new ReviewError(400, 'This review link is not valid.');
    }
    if (!payload.id || !payload.exp) throw new ReviewError(400, 'This review link is not valid.');
    if (Date.now() > payload.exp) throw new ReviewError(410, 'This review link has expired. Please ask us for a new one.');
    return payload;
}

/* ---------------------------------------------------------------- Supabase */

async function supabase(path, init = {}) {
    const { supabaseUrl, serviceKey } = requireConfig(['supabaseUrl', 'serviceKey']);
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
        ...init,
        headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
            ...(init.headers || {})
        }
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => '');
        const error = new ReviewError(response.status === 409 ? 409 : 502, 'We could not save your review right now.');
        error.detail = detail;
        throw error;
    }
    return response;
}

async function inviteUsed(inviteId) {
    const response = await supabase(`reviews?select=id&invite_id=eq.${encodeURIComponent(inviteId)}&limit=1`);
    const rows = await response.json();
    return rows.length > 0;
}

/* ------------------------------------------------------------------ Actions */

async function listReviews() {
    const response = await supabase(`reviews?select=${PUBLIC_FIELDS}&published=eq.true&order=created_at.desc&limit=100`);
    const reviews = await response.json();
    const count = reviews.length;
    const average = count ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : 0;
    return { reviews, count, average };
}

async function checkInvite(token) {
    const invite = readInvite(token);
    if (await inviteUsed(invite.id)) {
        throw new ReviewError(409, 'This review link has already been used. Thank you for your review!');
    }
    return {
        valid: true,
        prefill: { name: invite.n || '', company: invite.c || '', projectType: invite.t || '', projectName: invite.p || '' }
    };
}

function validateReview(payload) {
    const data = {
        name: clean(payload.name, 80),
        company: clean(payload.company, 120),
        role: clean(payload.role, 80),
        project_type: clean(payload.projectType, 60),
        project_name: clean(payload.projectName, 160),
        rating: Number(payload.rating),
        body: String(payload.body || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 1500)
    };

    if (!data.name) throw new ReviewError(400, 'Please add your name.');
    if (!data.company) throw new ReviewError(400, 'Please add your company name.');
    if (!PROJECT_TYPES.includes(data.project_type)) throw new ReviewError(400, 'Please choose what we worked on together.');
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) throw new ReviewError(400, 'Please choose a rating from 1 to 5 stars.');
    if (data.body.length < 20) throw new ReviewError(400, 'Please write a few more words (at least 20 characters).');
    if (!payload.consent) throw new ReviewError(400, 'Please confirm we can publish your review.');
    return data;
}

async function submitReview(payload) {
    if (String(payload.honeypot || '').trim()) {
        return { success: true };
    }
    const invite = readInvite(payload.token);
    const data = validateReview(payload);
    if (await inviteUsed(invite.id)) {
        throw new ReviewError(409, 'This review link has already been used. Thank you for your review!');
    }
    try {
        await supabase('reviews', {
            method: 'POST',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({ ...data, invite_id: invite.id, published: true })
        });
    } catch (error) {
        if (error.status === 409) {
            throw new ReviewError(409, 'This review link has already been used. Thank you for your review!');
        }
        throw error;
    }
    return { success: true };
}

function isAdmin(key) {
    const { adminKey } = requireConfig(['adminKey']);
    const a = Buffer.from(String(key || ''));
    const b = Buffer.from(adminKey);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ------------------------------------------------- Platform-neutral router */

/**
 * Handles one request. Returns { status, body, headers }.
 * `query` is an object of search params, `body` a parsed JSON object.
 */
async function handleReviews(method, query, body) {
    try {
        if (method === 'GET' && query.invite) {
            return { status: 200, body: await checkInvite(query.invite) };
        }
        if (method === 'GET') {
            return {
                status: 200,
                body: await listReviews(),
                headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' }
            };
        }
        if (method === 'POST') {
            return { status: 200, body: await submitReview(body || {}) };
        }
        return { status: 405, body: { success: false, error: 'Method not allowed.' }, headers: { Allow: 'GET, POST' } };
    } catch (error) {
        return errorResponse(error);
    }
}

async function handleReviewLink(method, body) {
    try {
        if (method !== 'POST') {
            return { status: 405, body: { success: false, error: 'Method not allowed.' }, headers: { Allow: 'POST' } };
        }
        if (!isAdmin(body && body.adminKey)) {
            return { status: 401, body: { success: false, error: 'Incorrect admin key.' } };
        }
        return { status: 200, body: { success: true, ...createInvite(body) } };
    } catch (error) {
        return errorResponse(error);
    }
}

function errorResponse(error) {
    if (error instanceof ReviewError) {
        if (error.detail) console.error('Supabase error:', error.detail);
        return { status: error.status, body: { success: false, error: error.message } };
    }
    console.error('Review system error:', error);
    return { status: 500, body: { success: false, error: 'Something went wrong. Please try again shortly.' } };
}

module.exports = {
    PROJECT_TYPES,
    createInvite,
    readInvite,
    validateReview,
    handleReviews,
    handleReviewLink
};
