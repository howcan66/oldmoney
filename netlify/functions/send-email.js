const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM;

    if (!apiKey || !fromEmail) {
        return {
            statusCode: 500,
            headers,
            body: 'Email service not configured'
        };
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (error) {
        return { statusCode: 400, headers, body: 'Invalid JSON payload' };
    }

    const to = (payload.to || '').trim();
    const subject = (payload.subject || 'Interest Calculator Results').trim();
    const text = (payload.text || '').trim();
    const csv = (payload.csv || '').trim();

    if (!to || !text) {
        return { statusCode: 400, headers, body: 'Missing required fields' };
    }

    const fullText = csv ? `${text}\n\nCSV Data:\n${csv}` : text;

    const sendgridPayload = {
        personalizations: [
            {
                to: [{ email: to }]
            }
        ],
        from: { email: fromEmail },
        subject,
        content: [
            {
                type: 'text/plain',
                value: fullText
            }
        ]
    };

    try {
        const response = await fetch(SENDGRID_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendgridPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: response.status,
                headers,
                body: errorText || 'SendGrid request failed'
            };
        }

        return { statusCode: 200, headers, body: 'Email sent' };
    } catch (error) {
        return { statusCode: 500, headers, body: 'Email send error' };
    }
};
