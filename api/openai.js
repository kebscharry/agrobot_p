import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENAI_KEY = process.env.OPENAI_KEY;

  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'OPENAI_KEY not set' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.text();
      console.error('OpenAI error:', errorData);
      return res.status(500).json({ error: 'Error calling OpenAI' });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to reach OpenAI' });
  }
}
