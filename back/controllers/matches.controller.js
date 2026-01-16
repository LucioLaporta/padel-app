const pool = require("../config/db");

// GET /api/matches → traer todos los partidos
const getMatches = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM matches ORDER BY created_at DESC"
    );
    res.json({ matches: result.rows });
  } catch (error) {
    console.error("Error al obtener partidos:", error.message);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

// POST /api/matches → crear un partido
const createMatch = async (req, res) => {
  const { date, players, level, price } = req.body;

  // Validación básica
  if (!date || !players || !level || !price) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO matches (date, players, level, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [date, players, level, price]
    );

    res.status(201).json({
      message: "Partido creado correctamente",
      match: result.rows[0],
    });
  } catch (error) {
    console.error("Error creando partido:", error.message);
    res.status(500).json({ message: "Error al crear partido" });
  }
};

module.exports = {
  getMatches,
  createMatch
};