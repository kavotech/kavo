const { addReview, linkState } = require('../server/reviews-core');

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        if (req.method === 'GET') {
            const s = await linkState(String((req.query && req.query.t) || ''));
            return res.status(s.status).json({ valid: s.valid, used: !!s.used, label: s.label || '' });
        }
        if (req.method === 'POST') {
            const body = req.body || {};
            if (body.website2) return res.status(200).json({ ok: true }); // honeypot
            const r = await addReview(String(body.token || ''), body);
            return res.status(r.status).json(r.ok ? { ok: true } : { ok: false, error: r.error });
        }
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ ok: false, error: 'Method not allowed.' });
    } catch (e) {
        console.error('review error:', e.message);
        return res.status(500).json({ ok: false, error: 'We could not save your review right now. Please try again shortly.' });
    }
};
