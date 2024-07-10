const pool = require("../../db");

async function addTranslation(
  action,
  model,
  language,
  message,
  translatedText
) {
  try {
    const query = `
      INSERT INTO translations (action, model, language, message, result)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [action, model, language, message, translatedText];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting translation:", error);
    return;
  }
}

module.exports = {
  addTranslation,
};
