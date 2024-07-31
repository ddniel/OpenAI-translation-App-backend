const router = require("express").Router();
const OpenAI = require("openai");
require("dotenv").config();
const { addTranslation } = require("../controllers/translationsController");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//SETUP GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const gem = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//SETUP OPENAI

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  dangerouslyAllowBrowser: true, // This is the default and can be omitted
});

router.post("/translations", async (req, res) => {
  const { action, language, message, model, version } = req.body;

  let query = "";
  let result = "";

  if (action == "translate") {
    query = `Translate this into ${language}: ${message}. Just give me the translation.`;
  } else if (action == "synonyms") {
    query = `Give me synonyms for ${message} in ${language}. Just give me the synonyms.`;
  } else if (action == "grammar") {
    query = `Check my grammar in ${language}: ${message}.`;
  }

  if (model === "Gemini") {
    const res = await gem.generateContent(query);
    console.log(res.response.text());
    result = res.response.text();
  } else if (model === "ChatGPT") {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      model: version,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    result = response.choices[0].message.content.trim();
  }

  try {
    await addTranslation(action, model, version, language, message, result);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
