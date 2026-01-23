const pool = require("../config/db");

// GET /api/staff/courts/:courtId/matches
const getMatchesByCourt = async (req, res) => {
  const { courtId } = req.params;

  // Validar que courtId sea un número
  if (isNaN(Number(courtId))) {
    return res.status(400).json({ message: "ID de cancha inválido" });
  }

  try {
    // 1️⃣ Marcar partidos finalizados automáticamente solo para esta cancha
    await pool.query(
      `
      UPDATE matches
      SET status = 'FINISHED'
      WHERE end_time < NOW()
        AND status != 'FINISHED'
        AND court_id = $1
      `,
      [courtId]
    );

    // 2️⃣ Traer todos los partidos de la cancha
    const result = await pool.query(
      `
      SELECT *
      FROM matches
      WHERE court_id = $1
      ORDER BY start_time ASC
      `,
      [courtId]
    );

    if (!result.rows.length) {
      return res.json({ matches: [] });
    }

    // 3️⃣ Armar respuesta
    const matches = result.rows.map(match => ({
      ...match,
      players_count: match.players.length,
      is_full: match.players.length >= 4,
      can_join: false, // staff no puede unirse
      is_owner: false, // staff no es dueño del partido aquí
    }));

    res.json({ matches });
  } catch (error) {
    console.error("Error getMatchesByCourt:", error);
    res.status(500).json({ message: "Error al obtener partidos de la cancha" });
  }
};

module.exports = { getMatchesByCourt };
