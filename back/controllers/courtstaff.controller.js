const pool = require("../config/db");

// Crear un bloque
const createBlock = async (req, res) => {
  const { courtId } = req.params;
  const { start_time, end_time, reason } = req.body;
  const userId = req.user.id;

  if (!start_time || !end_time) {
    return res.status(400).json({ message: "Faltan fechas" });
  }

  try {
    // Validar solapamiento con otros bloques
    const overlap = await pool.query(
      `SELECT id FROM court_blocks
       WHERE court_id = $1 AND start_time < $3 AND end_time > $2`,
      [courtId, start_time, end_time]
    );

    if (overlap.rows.length) {
      return res.status(400).json({ message: "Este horario ya está bloqueado" });
    }

    const result = await pool.query(
      `INSERT INTO court_blocks (court_id, start_time, end_time, reason, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [courtId, start_time, end_time, reason || null, userId]
    );

    res.status(201).json({ block: result.rows[0] });
  } catch (error) {
    console.error("Error createBlock:", error);
    res.status(500).json({ message: "Error al crear bloqueo" });
  }
};

// Listar bloques de la cancha
const listBlocks = async (req, res) => {
  const { courtId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM court_blocks WHERE court_id = $1 ORDER BY start_time ASC`,
      [courtId]
    );

    res.json({ blocks: rows });
  } catch (error) {
    console.error("Error listBlocks:", error);
    res.status(500).json({ message: "Error al listar bloqueos" });
  }
};

module.exports = { createBlock, listBlocks };
