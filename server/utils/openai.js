const axios = require("axios");
const { listModels } = require("./geminiModel");

let cachedModel = null;

const classifyTicket = async (title, description) => {
  try {
    if (!cachedModel) {
      cachedModel = await listModels(); // 🔥 auto-detect model
      console.log("Using Gemini model:", cachedModel);
    }

    const prompt = `
Return ONLY valid JSON:
{
  "category": "Technical Support | Billing | General Inquiry | Feature Request",
  "priority": "High | Medium | Low"
}

Rules:
- Login/password/access → Technical Support, High
- Payment/refund → Billing, High
- Suggestions → Feature Request, Low
- Questions → General Inquiry, Medium

Ticket:
Title: "${title}"
Description: "${description}"
`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${cachedModel}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = res.data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);

  } catch (err) {
    console.error("❌ Gemini AI Error:", err.response?.data || err.message);
    return { category: "General Inquiry", priority: "Medium" };
  }
};

module.exports = { classifyTicket };