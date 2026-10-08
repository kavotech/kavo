const { handleReviews } = require('../server/reviews');

module.exports = async function handler(req, res) {
    const result = await handleReviews(req.method, req.query || {}, req.body || {});
    Object.entries(result.headers || {}).forEach(([key, value]) => res.setHeader(key, value));
    return res.status(result.status).json(result.body);
};
