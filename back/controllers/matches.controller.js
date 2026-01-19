const pool = require("../config/db");

/**
 * Traer todos los partidos (público)
 */
const getMatches = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM matches
       WHERE date >= NOW()
       ORDER BY date ASC`
    );

    res.json({ matches: result.rows });
  } catch (error) {
    console.error("Error getMatches:", error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

/**
 * Crear un partido (requiere login)
 */
const createMatch = async (req, res) => {
  try {
    // Auth defensivo
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { date, level, price } = req.body;
    const userId = req.user.id;

    // Validaciones básicas
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
      return res.status(400).json({ message: "Precio debe ser mayor a 0" });
    }

    // Validar fecha
    const matchDate = new Date(date);
    if (isNaN(matchDate.getTime())) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    if (matchDate < new Date()) {
      return res
        .status(400)
        .json({ message: "La fecha no puede ser pasada" });
    }

    // Evitar duplicados
    const existing = await pool.query(
      "SELECT id FROM matches WHERE date = $1 AND level = $2",
      [date, level]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Ya existe un partido en ese horario y nivel",
      });
    }

    // Crear partido
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
 * Unirse a un partido (requiere login)
 */
const joinMatch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const matchId = req.params.id;
    const userId = req.user.id;

    // Traer partido
    const { rows } = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    // Ya está en el partido
    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en este partido" });
    }

    // Partido completo (4 jugadores)
    if (match.players.length >= 4) {
      return res
        .status(400)
        .json({ message: "El partido ya está completo" });
    }

    // Unirse
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
 * Salir de un partido (requiere login)
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
  createMatch,
  joinMatch,
  leaveMatch,
};