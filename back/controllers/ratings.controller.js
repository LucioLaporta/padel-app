const pool = require("../config/db");

// POST /api/ratings/player
const ratePlayer = async (req, res) => {
  try {
    const raterId = req.user.id;
    const { match_id, rated_user_id, stars, comment } = req.body;

    // 1️⃣ Validar campos
    if (!match_id || !rated_user_id || !stars) {
      return res.status(400).json({ message: "Faltan campos" });
    }

    // 2️⃣ Traer partido
    const matchResult = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [match_id]
    );

    if (!matchResult.rows.length) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = matchResult.rows[0];

    // 3️⃣ Debe estar finalizado
    if (match.status !== "FINISHED") {
      return res.status(400).json({ message: "El partido no está finalizado" });
    }

    // 4️⃣ Ambos deben haber jugado
    if (!match.players.includes(raterId) || !match.players.includes(rated_user_id)) {
      return res.status(403).json({ message: "No participaste de este partido" });
    }

    // 5️⃣ No calificarse a uno mismo
    if (raterId === rated_user_id) {
      return res.status(400).json({ message: "No podés calificarte a vos mismo" });
    }

    // 6️⃣ Chequear si ya calificó
    const existing = await pool.query(
      "SELECT * FROM match_player_ratings WHERE match_id=$1 AND rater_id=$2 AND rated_user_id=$3",
      [match_id, raterId, rated_user_id]
    );

    if (existing.rows.length) {
      return res.status(400).json({ message: "Ya calificaste a este jugador" });
    }

    // 7️⃣ Insertar rating
    await pool.query(
      `INSERT INTO match_player_ratings
        (match_id, rater_id, rated_user_id, stars, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [match_id, raterId, rated_user_id, stars, comment || null]
    );

    res.status(201).json({ message: "Jugador calificado correctamente" });
  } catch (error) {
    console.error("Error ratePlayer:", error);
    res.status(500).json({ message: "Error al calificar jugador" });
  }
};

// GET /api/ratings/player/:id
const getPlayerRating = async (req, res) => {
  try {
    const playerId = Number(req.params.id);

    const result = await pool.query(
      `SELECT rated_user_id AS player_id,
              ROUND(AVG(stars), 2) AS average_rating,
              COUNT(*) AS total_ratings
       FROM match_player_ratings
       WHERE rated_user_id=$1
       GROUP BY rated_user_id`,
      [playerId]
    );

    if (!result.rows.length) {
      return res.json({
        player_id: playerId,
        average_rating: null,
        total_ratings: 0,
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getPlayerRating:", error);
    res.status(500).json({ message: "Error al obtener rating del jugador" });
  }
};

// GET /api/ratings/comments (solo admins)
const getAllComments = async (req, res) => {
  try {
    const isAdmin = req.user?.is_admin;
    if (!isAdmin) return res.status(403).json({ message: "No autorizado" });

    const result = await pool.query(
      `SELECT * FROM match_player_ratings ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getAllComments:", error);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
};

module.exports = {
  ratePlayer,
  getPlayerRating,
  getAllComments,
};
