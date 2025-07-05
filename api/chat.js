export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

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


  const apiKey = 
process.env.GROQ_API_KEY;
return res.status(500).json({ error: "OpenAI API key not configured." });
  }
 
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: req.body.messages,
        max_tokens: 256,
        temperature: 0.8,
      }),
    });

    const data = await groqRes.json();
    res.status(200).json(data);  // ✅ respond to frontend
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "Server error calling Groq." });
  }
}
