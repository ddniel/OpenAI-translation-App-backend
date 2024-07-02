const pool = require("../../db");

async function addTranslation(model, language, message, translatedText) {
  try {
    const query = `
      INSERT INTO translations (model, language, message, translatedtext)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [model, language, message, translatedText];

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
