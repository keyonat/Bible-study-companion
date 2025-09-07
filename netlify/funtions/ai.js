// netlify/functions/ai.js
export default async (req) => {
  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), { status: 400 });
    }

    // Mock response for wiring test
    const summary = text.slice(0, 180);
    const themes = ["Reflection & Application"];
    const question = "What is one small action you can take today to live out this passage?";

    return new Response(JSON.stringify({ summary, themes, question }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
