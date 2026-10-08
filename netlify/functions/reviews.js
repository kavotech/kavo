const { handleReviews } = require('../../server/reviews');

exports.handler = async function handler(event) {
    let body = {};
    if (event.httpMethod === 'POST') {
        try {
            body = event.body ? JSON.parse(event.body) : {};
        } catch (error) {
            return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON payload.' }) };
        }
    }
    const result = await handleReviews(event.httpMethod, event.queryStringParameters || {}, body);
    return {
        statusCode: result.status,
        headers: { 'Content-Type': 'application/json', ...(result.headers || {}) },
        body: JSON.stringify(result.body)
    };
};
