const pool = require("../config/db");

// GET /api/matches
const getMatches = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { level, available } = req.query;

    let query = `
      SELECT *
      FROM matches
      WHERE start_time >= NOW()
    `;
    const values = [];
    let idx = 1;

    if (level) {
      query += ` AND level = $${idx}`;
      values.push(level);
      idx++;
    }

    query += " ORDER BY start_time ASC";

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
          playersCount < maxPlayers &&
          match.status === "OPEN",
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

    const userId = Number(req.user.id);
    const { start_time, end_time, level, price } = req.body;

    if (!start_time || !end_time || !level || !price) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const levelsPermitidos = [
      "8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra",
    ];
    if (!levelsPermitidos.includes(level)) {
      return res.status(400).json({ message: "Categoría no válida" });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Precio inválido" });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Horario inválido" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "El horario de inicio debe ser menor al de fin" });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: "No se puede crear un partido en el pasado" });
    }

    const overlap = await pool.query(
      `
      SELECT id
      FROM matches
      WHERE level = $1
        AND status IN ('OPEN', 'FULL')
        AND (start_time < $3 AND end_time > $2)
      `,
      [level, start, end]
    );

    if (overlap.rows.length > 0) {
      return res.status(400).json({ message: "Ya existe un partido en ese horario y categoría" });
    }

    const result = await pool.query(
      `
      INSERT INTO matches
        (start_time, end_time, players, level, price, created_by, status)
      VALUES
        ($1, $2, ARRAY[$3]::int[], $4, $5, $3, 'OPEN')
      RETURNING *
      `,
      [start, end, userId, level, price]
    );

    // Mensaje más amigable con cupos restantes
    const match = result.rows[0];
    const spotsLeft = 4 - match.players.length;
    const message = `Partido creado correctamente. Cupos disponibles: ${spotsLeft}`;

    res.status(201).json({ message, match });
  } catch (error) {
    console.error("Error createMatch:", error);
    res.status(500).json({ message: "Error al crear partido" });
  }
};

// POST /api/matches/:id/join
const joinMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const matchId = Number(req.params.id);

    // Traemos el partido
    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    const match = rows[0];

    // Validaciones
    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en el partido" });
    }

    if (match.status !== "OPEN") {
      return res.status(400).json({ message: "El partido ya está lleno" });
    }

    if (match.players.length >= 4) {
      return res.status(400).json({ message: "El partido ya está lleno" });
    }

    // Determinar nuevo estado
    const newStatus = match.players.length + 1 >= 4 ? "FULL" : "OPEN";

    // Actualizar partido
    const updated = await pool.query(
      `UPDATE matches
       SET players = array_append(players, $1),
           status = $3
       WHERE id = $2
       RETURNING *`,
      [userId, matchId, newStatus]
    );

    const updatedMatch = updated.rows[0];
    const spotsLeft = 4 - updatedMatch.players.length;

    // Mensaje más amigable con cupos restantes
    const message =
      newStatus === "FULL"
        ? "Te uniste al partido correctamente. El partido ya está lleno."
        : `Te uniste al partido correctamente. Cupos disponibles: ${spotsLeft}`;

    res.json({ message, match: updatedMatch });
  } catch (error) {
    console.error("Error joinMatch:", error);
    res.status(500).json({ message: "Error al unirse" });
  }
};

// POST /api/matches/:id/leave
const leaveMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const matchId = Number(req.params.id);

    // Traemos el partido
    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    const match = rows[0];

    if (!match.players.includes(userId)) {
      return res.status(400).json({ message: "No estabas en el partido" });
    }

    // Determinar nuevo estado
    const newStatus = match.players.length - 1 < 4 ? "OPEN" : match.status;

    // Actualizar partido
    const updated = await pool.query(
      `UPDATE matches
       SET players = array_remove(players, $1),
           status = $3
       WHERE id = $2
       RETURNING *`,
      [userId, matchId, newStatus]
    );

    // Mensaje más amigable según estado
    const message =
      newStatus === "OPEN"
        ? "Saliste del partido correctamente. Ahora hay cupos disponibles."
        : "Saliste del partido correctamente.";

    res.json({ message, match: updated.rows[0] });
  } catch (error) {
    console.error("Error leaveMatch:", error);
    res.status(500).json({ message: "Error al salir" });
  }
};

// DELETE /api/matches/:id
const deleteMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const matchId = Number(req.params.id);

    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    const match = rows[0];

    if (match.created_by !== userId) return res.status(403).json({ message: "No sos el creador" });

    if (match.players.length > 1) {
      return res.status(400).json({ message: "No podés borrar el partido si hay otros jugadores" });
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
