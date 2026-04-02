export default async function handler(req, res) {
  try {
    const { prompt, platforms, tone } = req.body;

    const fullPrompt = `
Generate social media posts.

Platforms: ${platforms.join(", ")}
Tone: ${tone}
Topic: ${prompt}

Return clear formatted content for each platform.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "user", content: fullPrompt }
        ]
      })
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
}
