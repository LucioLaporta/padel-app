const pool = require("../config/db");

// GET /api/matches
const getMatches = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM matches ORDER BY created_at DESC"
    );
    res.json({ matches: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

module.exports = { getMatches };