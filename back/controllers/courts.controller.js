const pool = require("../config/db");

const getCourts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM courts ORDER BY created_at DESC"
    );

    res.json({ courts: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener canchas" });
  }
};

module.exports = { getCourts };