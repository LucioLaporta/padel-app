const pool = require("../config/db");

// GET /api/matches
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

    if (level) {
      query += ` AND level = $${idx}`;
      values.push(level);
      idx++;
    }

    query += " ORDER BY date ASC";

    const result = await pool.query(query, values);

    let matches = result.rows.map((match) => {
      const playersCount = match.players.length;
      const maxPlayers = 4;
      const isOwner = userId && match.created_by === userId;

      return {
        ...match,
        players_count: playersCount,
        spots_left: maxPlayers - playersCount,
        is_full: playersCount >= maxPlayers,
        is_joined: userId ? match.players.includes(userId) : false,
        is_owner: !!isOwner,
        can_join:
          !!userId &&
          !match.players.includes(userId) &&
          playersCount < maxPlayers,
        can_delete: !!isOwner && playersCount === 1,
      };
    });

    if (available === "true") {
      matches = matches.filter((m) => !m.is_full);
    }

    res.json({ matches });
  } catch (error) {
    console.error("Error getMatches:", error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

// POST /api/matches
const createMatch = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { date, level, price } = req.body;
    const userId = req.user.id;

    if (!date || !level || !price) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const levelsPermitidos = [
      "8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"
    ];

    if (!levelsPermitidos.includes(level)) {
      return res.status(400).json({ message: "Categoría no válida" });
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

    if (existing.rows.length) {
      return res.status(400).json({
        message: "Ya existe un partido en ese horario y categoría",
      });
    }

    const result = await pool.query(
      `INSERT INTO matches (date, players, level, price, created_by)
       VALUES ($1, ARRAY[$2]::int[], $3, $4, $2)
       RETURNING *`,
      [date, userId, level, price]
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

// POST /api/matches/:id/join
const joinMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.id;

    const { rows } = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en el partido" });
    }

    if (match.players.length >= 4) {
      return res.status(400).json({ message: "Partido completo" });
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
    res.status(500).json({ message: "Error al unirse" });
  }
};

// POST /api/matches/:id/leave
const leaveMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);   // forzamos número
    const matchId = Number(req.params.id); // también aseguramos número

    // Primero traemos el partido
    const { rows } = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    if (!match.players.includes(userId)) {
      return res.status(400).json({ message: "No estabas en el partido" });
    }

    // Ahora sí removemos al jugador
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
    res.status(500).json({ message: "Error al salir" });
  }
};

// DELETE /api/matches/:id
const deleteMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.id;

    const { rows } = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [matchId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    const match = rows[0];

    if (match.created_by !== userId) {
      return res.status(403).json({ message: "No sos el creador" });
    }

    if (match.players.length > 1) {
      return res.status(400).json({
        message: "No podés borrar el partido si hay otros jugadores",
      });
    }

    await pool.query("DELETE FROM matches WHERE id = $1", [matchId]);

    res.json({ message: "Partido eliminado correctamente" });
  } catch (error) {
    console.error("Error deleteMatch:", error);
    res.status(500).json({ message: "Error al borrar" });
  }
};

module.exports = {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
};