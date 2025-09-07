// netlify/functions/ai.js  (classic Node handler style)
exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const text = (body.text || "").trim();

    if (!text) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing text" }),
      };
    }

    // Mock response for wiring test (no OpenAI call yet)
    const summary = text.slice(0, 180);
    const themes = ["Reflection & Application"];
    const question =
      "What is one small action you can take today to live out this passage?";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, themes, question }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
