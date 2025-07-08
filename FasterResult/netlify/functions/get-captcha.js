const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const res = await fetch('https://eboardresults.com/v2/captcha');
    const buffer = await res.buffer();
    const base64 = buffer.toString('base64');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: `data:image/png;base64,${base64}` })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch captcha' })
    };
  }
}; 