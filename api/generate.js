export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { prompt, platforms, tone } = await req.json();

  const fullPrompt = `
Generate social media content.

Platforms: ${platforms.join(",")}
Tone: ${tone}
Topic: ${prompt}

Write engaging posts.
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 800,
      messages: [{ role: "user", content: fullPrompt }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(i => i.text || "").join("") || "";

  return new Response(text);
}
