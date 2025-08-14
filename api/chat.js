export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Missing messages array in request body' });
      return;
    }

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages,
        temperature: 0.3,
      }),
    });

    const data = await upstream.json();
    const text = data?.choices?.[0]?.message?.content?.trim?.();
    res.status(200).json({ text, raw: data });
  } catch (err) {
    res.status(500).json({ error: 'Upstream request failed' });
  }
}


