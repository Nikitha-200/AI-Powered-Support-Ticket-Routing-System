const axios = require("axios");

const listModels = async () => {
  const res = await axios.get(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
  );

  // Pick first model that supports generateContent
  const model = res.data.models.find(m =>
    m.supportedGenerationMethods?.includes("generateContent")
  );

  if (!model) {
    throw new Error("No Gemini model supports generateContent");
  }

  return model.name;
};

module.exports = { listModels };
