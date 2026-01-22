const pool = require("../config/db");

// POST /api/ratings/court
const rateCourt = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { court_id, stars, comment } = req.body;

    if (!userId) return res.status(401).json({ message: "No autorizado" });
    if (!court_id || !stars) return res.status(400).json({ message: "Faltan campos" });
    if (stars < 1 || stars > 5) return res.status(400).json({ message: "Stars inválido" });

    const result = await pool.query(
      `INSERT INTO court_ratings (court_id, user_id, stars, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (court_id, user_id)
       DO UPDATE SET stars = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [court_id, userId, stars, comment || null]
    );

    res.json({ message: "Voto registrado correctamente", rating: result.rows[0] });
  } catch (error) {
    console.error("Error rateCourt:", error);
    res.status(500).json({ message: "Error al registrar voto" });
  }
};

// POST /api/ratings/player
const ratePlayer = async (req, res) => {
  try {
    const voterId = req.user?.id;
    const { player_id, stars, comment } = req.body;

    if (!voterId) return res.status(401).json({ message: "No autorizado" });
    if (!player_id || !stars) return res.status(400).json({ message: "Faltan campos" });
    if (stars < 1 || stars > 5) return res.status(400).json({ message: "Stars inválido" });

    const result = await pool.query(
      `INSERT INTO player_ratings (player_id, voter_id, stars, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (player_id, voter_id)
       DO UPDATE SET stars = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [player_id, voterId, stars, comment || null]
    );

    res.json({ message: "Voto registrado correctamente", rating: result.rows[0] });
  } catch (error) {
    console.error("Error ratePlayer:", error);
    res.status(500).json({ message: "Error al registrar voto" });
  }
};

// GET /api/ratings/court/:id
const getCourtRating = async (req, res) => {
  try {
    const courtId = req.params.id;
    const { rows } = await pool.query(
      `SELECT COUNT(*) as votes, AVG(stars)::numeric(10,2) as average
       FROM court_ratings
       WHERE court_id = $1`,
      [courtId]
    );
    res.json({ court_id: courtId, votes: Number(rows[0].votes), average: Number(rows[0].average || 0) });
  } catch (error) {
    console.error("Error getCourtRating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

// GET /api/ratings/player/:id
const getPlayerRating = async (req, res) => {
  try {
    const playerId = req.params.id;
    const { rows } = await pool.query(
      `SELECT COUNT(*) as votes, AVG(stars)::numeric(10,2) as average
       FROM player_ratings
       WHERE player_id = $1`,
      [playerId]
    );
    res.json({ player_id: playerId, votes: Number(rows[0].votes), average: Number(rows[0].average || 0) });
  } catch (error) {
    console.error("Error getPlayerRating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

module.exports = { rateCourt, ratePlayer, getCourtRating, getPlayerRating };