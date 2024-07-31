const pool = require("../../db");

async function addTranslation(
  action,
  model,
  version,
  language,
  message,
  response
) {
  try {
    const query = `
      INSERT INTO translations (action, version, model, language, message, result)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [action, version, model, language, message, response];

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
