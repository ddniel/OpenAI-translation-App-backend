const router = require("express").Router();
const OpenAI = require("openai");
require("dotenv").config();
const { addTranslation } = require("../controllers/translationsController");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  dangerouslyAllowBrowser: true, // This is the default and can be omitted
});

router.post("/translations", async (req, res) => {
  const { language, message } = req.body;
  addTranslation("testModel", language, message, "testTranslation");

  console.log(language, message);
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Translate this into ${language}: ${message}`,
        },
      ],
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.choices[0].message.content.trim();

    res.status(200).json({ translatedText });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
