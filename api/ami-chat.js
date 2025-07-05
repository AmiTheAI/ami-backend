export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://amitheai.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Respond to preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Parse body if needed (for Vercel Node API, not Next.js)
  if (!req.body || typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body || "{}");
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "No messages provided." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured." });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    /*body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 256,
      temperature: 0.8,
    }),
  });*/
body: JSON.stringify({
  model: "gpt-4o", // Switch to GPT-4o
  messages,
  max_tokens: 256,
  temperature: 0.8,
}),
  const data = await response.json();
  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }
  res.status(200).json(data);
}
