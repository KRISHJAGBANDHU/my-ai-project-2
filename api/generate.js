export default async function handler(req, res) {
  try {
    const { prompt, platforms, tone } = req.body;

    const fullPrompt = `
Generate social media posts for:
${platforms.join(", ")}

Tone: ${tone}
Topic: ${prompt}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-7b",
        messages: [
          { role: "user", content: fullPrompt }
        ]
      })
    });

    const data = await response.json();

    console.log("API RESPONSE:", data); // debug

    let text = "";

    if (data.choices && data.choices.length > 0) {
      text = data.choices[0].message.content;
    } else if (data.error) {
      text = "API Error: " + data.error.message;
    } else {
      text = "No response from AI";
    }

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: "Server error: " + err.message });
  }
}
