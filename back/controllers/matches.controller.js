const pool = require("../config/db");

/**
 * ===============================
 * GET /api/matches
 * Listado de partidos (UX)
 * ===============================
 */
const getMatches = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { level, available } = req.query;

    let query = `
      SELECT *
      FROM matches
      WHERE date >= NOW()
    `;
    const values = [];
    let idx = 1;

    // Filtro por nivel
    if (level) {
      query += ` AND level = $${idx}`;
      values.push(level);
      idx++;
    }

    query += ` ORDER BY date ASC`;

    const result = await pool.query(query, values);

    let matches = result.rows.map((match) => {
      const playersCount = match.players.length;
      const maxPlayers = 4;
      const isJoined = userId ? match.players.includes(userId) : false;

      return {
        ...match,
        players_count: playersCount,
        spots_left: maxPlayers - playersCount,
        is_full: playersCount >= maxPlayers,
        is_joined: isJoined,
        can_join:
          !!userId && !isJoined && playersCount < maxPlayers,
      };
    });

    // Solo disponibles
    if (available === "true") {
      matches = matches.filter((m) => !m.is_full);
    }

    res.json({ matches });
  } catch (error) {
    console.error("Error getMatches:", error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

/**
 * ===============================
 * GET /api/matches/:id
 * Detalle de un partido (UX)
 * ===============================
 */
const getMatchById = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const matchId = req.params.id;

    const matchResult = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = matchResult.rows[0];

    // Traer jugadores
    const playersResult = await pool.query(
      `SELECT id, name
       FROM users
       WHERE id = ANY($1::int[])`,
      [match.players]
    );

    const playersCount = match.players.length;
    const maxPlayers = 4;
    const isJoined = userId ? match.players.includes(userId) : false;

    res.json({
      id: match.id,
      date: match.date,
      level: match.level,
      price: match.price,
      players: playersResult.rows,
      players_count: playersCount,
      spots_left: maxPlayers - playersCount,
      is_full: playersCount >= maxPlayers,
      is_joined: isJoined,
      can_join: !!userId && !isJoined && playersCount < maxPlayers,
      can_leave: !!userId && isJoined,
    });
  } catch (error) {
    console.error("Error getMatchById:", error);
    res.status(500).json({ message: "Error al obtener partido" });
  }
};

/**
 * ===============================
 * POST /api/matches
 * Crear partido
 * ===============================
 */
const createMatch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { date, level, price } = req.body;
    const userId = req.user.id;

    if (!date || !level || !price) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const levelsPermitidos = ["6ta", "5ta", "4ta", "3ra", "2da", "1ra"];
    if (!levelsPermitidos.includes(level)) {
      return res.status(400).json({ message: "Nivel no válido" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Precio inválido" });
    }

    const matchDate = new Date(date);
    if (isNaN(matchDate.getTime()) || matchDate < new Date()) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    const existing = await pool.query(
      "SELECT id FROM matches WHERE date = $1 AND level = $2",
      [date, level]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Ya existe un partido en ese horario y nivel",
      });
    }

    const result = await pool.query(
      `INSERT INTO matches (date, players, level, price)
       VALUES ($1, ARRAY[$4]::int[], $2, $3)
       RETURNING *`,
      [date, level, price, userId]
    );

    res.status(201).json({
      message: "Partido creado correctamente",
      match: result.rows[0],
    });
  } catch (error) {
    console.error("Error createMatch:", error);
    res.status(500).json({ message: "Error al crear partido" });
  }
};

/**
 * ===============================
 * POST /api/matches/:id/join
 * ===============================
 */
const joinMatch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const matchId = req.params.id;
    const userId = req.user.id;

    const { rows } = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en este partido" });
    }

    if (match.players.length >= 4) {
      return res
        .status(400)
        .json({ message: "El partido ya está completo" });
    }

    const updated = await pool.query(
      `UPDATE matches
       SET players = array_append(players, $1)
       WHERE id = $2
       RETURNING *`,
      [userId, matchId]
    );

    res.json({
      message: "Te uniste al partido correctamente",
      match: updated.rows[0],
    });
  } catch (error) {
    console.error("Error joinMatch:", error);
    res.status(500).json({ message: "Error al unirse al partido" });
  }
};

/**
 * ===============================
 * POST /api/matches/:id/leave
 * ===============================
 */
const leaveMatch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const matchId = req.params.id;
    const userId = req.user.id;

    const updated = await pool.query(
      `UPDATE matches
       SET players = array_remove(players, $1)
       WHERE id = $2
       RETURNING *`,
      [userId, matchId]
    );

    res.json({
      message: "Saliste del partido correctamente",
      match: updated.rows[0],
    });
  } catch (error) {
    console.error("Error leaveMatch:", error);
    res.status(500).json({ message: "Error al salir del partido" });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  joinMatch,
  leaveMatch,
};
