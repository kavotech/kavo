const { handleReviewLink } = require('../../server/reviews');

exports.handler = async function handler(event) {
    let body = {};
    try {
        body = event.body ? JSON.parse(event.body) : {};
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON payload.' }) };
    }
    const result = await handleReviewLink(event.httpMethod, body);
    return {
        statusCode: result.status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...(result.headers || {}) },
        body: JSON.stringify(result.body)
    };
};
