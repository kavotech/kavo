// Admin-only: creates a one-time client review link.
// Usage: /api/review-link?key=<REVIEW_ADMIN_KEY>&client=Company%20Name
const { makeToken, safeEqual } = require('../server/reviews-core');

module.exports = function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    const admin = process.env.REVIEW_ADMIN_KEY;
    const q = req.query || {};
    if (!admin || admin.length < 12 || !safeEqual(String(q.key || ''), admin)) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    try {
        const client = String(q.client || '').slice(0, 80);
        const origin = process.env.PUBLIC_SITE_URL || 'https://kavotech.uk';
        const token = makeToken(client);
        return res.status(200).json({ client, url: `${origin.replace(/\/$/, '')}/review.html?t=${token}` });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
