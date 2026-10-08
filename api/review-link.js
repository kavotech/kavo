const { handleReviewLink } = require('../server/reviews');

module.exports = async function handler(req, res) {
    const result = await handleReviewLink(req.method, req.body || {});
    Object.entries(result.headers || {}).forEach(([key, value]) => res.setHeader(key, value));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(result.status).json(result.body);
};
