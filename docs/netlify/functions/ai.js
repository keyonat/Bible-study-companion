// netlify/functions/ai.js
export default async (req, context) => {
  try {
    const { text } = await req.json();

    // TODO: replace this "mock" with a real API call later.
    // For now we return a pretend AI response so you can wire it up safely.
    const summary = text.slice(0, 200);
    const themes = ["Reflection & Application"];
    const question = "What is one small action you can take today to live out this passage?";

    return new Response(JSON.stringify({ summary, themes, question }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }
};
