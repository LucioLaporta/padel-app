const pool = require("../config/db");

// Traer todos los partidos (público)
const getMatches = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM matches ORDER BY date ASC");
    res.json({ matches: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

// Crear un partido (requiere login)
const createMatch = async (req, res) => {
  const { date, level, price } = req.body;
  const userId = req.user.id;

  // Validaciones simples
  if (!date || !level || !price) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const levelsPermitidos = ["6ta", "5ta", "4ta", "3ra", "2da", "1ra"];
  if (!levelsPermitidos.includes(level)) {
    return res.status(400).json({ message: "Nivel no válido" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Precio debe ser mayor a 0" });
  }

  try {
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
    console.error(error);
    res.status(500).json({ message: "Error al crear partido" });
  }
};

// Unirse a un partido (requiere login)
const joinMatch = async (req, res) => {
  const matchId = req.params.id;
  const userId = req.user.id;

  try {
    // Traer el partido
    const { rows } = await pool.query("SELECT * FROM matches WHERE id=$1", [matchId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    // Validar si el usuario ya está en el partido
    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en este partido" });
    }

    // Validar límite de jugadores (suponemos 4)
    if (match.players.length >= 4) {
      return res.status(400).json({ message: "El partido ya está completo" });
    }

    // Agregar jugador al array
    const updated = await pool.query(
      "UPDATE matches SET players = array_append(players, $1) WHERE id = $2 RETURNING *",
      [userId, matchId]
    );

    res.json({
      message: "Te uniste al partido correctamente",
      match: updated.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al unirse al partido" });
  }
};

module.exports = {
  getMatches,
  createMatch,
  joinMatch,
};