// netlify/functions/ai.js
export default async (req) => {
  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), { status: 400 });
    }

    // Use your OpenAI API key stored in Netlify
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a Bible study companion. Always respond in JSON with three fields: summary, themes, and question." },
          { role: "user", content: `Analyze this Bible passage: ${text}` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    let summary = "No response";
    let themes = [];
    let question = "No question generated";

    try {
      const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
      summary = parsed.summary || summary;
      themes = parsed.themes || themes;
      question = parsed.question || question;
    } catch (err) {
      summary = data.choices?.[0]?.message?.content || summary;
    }

    return new Response(JSON.stringify({ summary, themes, question }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

