const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const data = JSON.parse(event.body);
    // Prepare form data for the official site
    const formData = new URLSearchParams();
    formData.append('exam', data.exam);
    formData.append('year', data.year);
    formData.append('board', data.board);
    formData.append('result_type', data.result_type);
    formData.append('roll', data.roll);
    formData.append('reg', data.reg);
    formData.append('captcha', data.captcha);
    // The official site may require cookies/session from captcha fetch
    // For demo, we just forward the request
    const res = await fetch('https://eboardresults.com/v2/home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; FasterResultBot/1.0)'
      },
      body: formData.toString()
    });
    const html = await res.text();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch result' })
    };
  }
}; 