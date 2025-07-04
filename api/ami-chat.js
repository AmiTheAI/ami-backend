export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "No messages provided." });
  }

  const apiKey = process.env.OPENAI_API_KEY; // Set this in your Vercel dashboard

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 256,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
