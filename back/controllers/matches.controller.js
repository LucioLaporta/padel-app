const pool = require("../config/db");

// GET /api/matches
const getMatches = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { level, available } = req.query;

    // 1️⃣ Marcar partidos finalizados automáticamente
    await pool.query(`
      UPDATE matches
      SET status = 'FINISHED'
      WHERE end_time < NOW()
        AND status != 'FINISHED'
    `);

    // 2️⃣ Traer ratings hechos por el usuario (si está logueado)
    let ratingsByMatch = {};

    if (userId) {
      const ratingsResult = await pool.query(
        `
        SELECT match_id, rated_user_id, stars
        FROM match_player_ratings
        WHERE rater_id = $1
        `,
        [userId]
      );

      ratingsResult.rows.forEach((r) => {
        if (!ratingsByMatch[r.match_id]) {
          ratingsByMatch[r.match_id] = {};
        }
        ratingsByMatch[r.match_id][r.rated_user_id] = r.stars;
      });
    }

    // 3️⃣ Traer partidos, excluyendo bloques de cancha
    let query = `
      SELECT *
      FROM matches m
      WHERE start_time >= NOW()
        AND NOT EXISTS (
          SELECT 1
          FROM court_blocks cb
          WHERE cb.court_id = m.court_id
            AND cb.start_time < m.end_time
            AND cb.end_time > m.start_time
        )
    `;
    const values = [];
    let idx = 1;

    if (level) {
      query += ` AND level = $${idx}`;
      values.push(level);
      idx++;
    }

    query += ` ORDER BY start_time ASC`;

    const result = await pool.query(query, values);

    // 4️⃣ Armar respuesta
    let matches = result.rows.map((match) => {
      const playersCount = match.players.length;
      const maxPlayers = 4;
      const isOwner = userId && match.created_by === userId;

      let playersRatings = null;

      if (userId && match.players.includes(userId)) {
        playersRatings = {};
        match.players.forEach((pid) => {
          if (pid !== userId) {
            playersRatings[pid] =
              ratingsByMatch[match.id]?.[pid] ?? null;
          }
        });
      }

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
        players_ratings: playersRatings,
      };
    });

    // Filtrar solo los disponibles si se pidió
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
    const { start_time, end_time, level, price, court_id } = req.body;

    if (!start_time || !end_time || !level || !price || !court_id) {
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

    if (start >= end) {
      return res.status(400).json({ message: "Horario inválido" });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: "No se puede crear un partido en el pasado" });
    }

    // overlap con otros partidos
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

    if (overlap.rows.length) {
      return res.status(400).json({ message: "Ya existe un partido en ese horario y categoría" });
    }

    // verificar bloqueos de la cancha
    const blockOverlap = await pool.query(
      `SELECT id FROM court_blocks
       WHERE court_id = $1 AND start_time < $3 AND end_time > $2`,
      [court_id, start, end]
    );

    if (blockOverlap.rows.length) {
      return res.status(400).json({ message: "El horario coincide con un bloqueo de la cancha" });
    }

    // INSERT
    const result = await pool.query(
      `
      INSERT INTO matches
        (start_time, end_time, players, level, price, created_by, status, court_id)
      VALUES
        ($1, $2, ARRAY[$3]::int[], $4, $5, $3, 'OPEN', $6)
      RETURNING *
      `,
      [start, end, userId, level, price, court_id]
    );

    res.status(201).json({ match: result.rows[0] });
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

    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    const match = rows[0];

    if (match.players.includes(userId)) {
      return res.status(400).json({ message: "Ya estás en el partido" });
    }

    if (match.status !== "OPEN") {
      return res.status(400).json({ message: "El partido no está abierto" });
    }

    const newStatus = match.players.length + 1 >= 4 ? "FULL" : "OPEN";

    const updated = await pool.query(
      `
      UPDATE matches
      SET players = array_append(players, $1),
          status = $3
      WHERE id = $2
      RETURNING *
      `,
      [userId, matchId, newStatus]
    );

    res.json({ match: updated.rows[0] });
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

    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    await pool.query(
      `
      UPDATE matches
      SET players = array_remove(players, $1),
          status = 'OPEN'
      WHERE id = $2
      `,
      [userId, matchId]
    );

    res.json({ message: "Saliste del partido" });
  } catch (error) {
    console.error("Error leaveMatch:", error);
    res.status(500).json({ message: "Error al salir" });
  }
};

// POST /api/matches/:id/finish
const finishMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const matchId = Number(req.params.id);

    const { rows } = await pool.query("SELECT * FROM matches WHERE id = $1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    if (rows[0].created_by !== userId) {
      return res.status(403).json({ message: "No sos el creador del partido" });
    }

    await pool.query(
      "UPDATE matches SET status = 'FINISHED' WHERE id = $1",
      [matchId]
    );

    res.json({ message: "Partido finalizado correctamente" });
  } catch (error) {
    console.error("Error finishMatch:", error);
    res.status(500).json({ message: "Error al finalizar partido" });
  }
};

module.exports = {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  finishMatch,
};
