const pool = require("../config/db");

// ================= GET MATCHES =================
const getMatches = async (req, res) => {
  try {
    const userId = req.user?.id ? parseInt(req.user.id) : null;
    const { level, available } = req.query;

    let query = `
      SELECT m.*,
             COUNT(mp.user_id) AS players_count,
             ARRAY_AGG(mp.user_id) FILTER (WHERE mp.user_id IS NOT NULL) AS players
      FROM matches m
      LEFT JOIN match_players mp ON mp.match_id = m.id
      WHERE m.start_time >= NOW()
    `;

    const values = [];
    let idx = 1;

    if (level) {
      query += ` AND m.level = $${idx}`;
      values.push(level);
      idx++;
    }

    query += ` GROUP BY m.id ORDER BY m.start_time ASC`;

    const result = await pool.query(query, values);

    let matches = result.rows.map(m => {
      const players = m.players || [];
      const playersCount = parseInt(m.players_count);
      const maxPlayers = 4;
      const isOwner = userId && m.created_by === userId;

      return {
        ...m,
        players,
        players_count: playersCount,
        spots_left: maxPlayers - playersCount,
        is_full: playersCount >= maxPlayers,
        is_joined: userId ? players.includes(userId) : false,
        is_owner: !!isOwner,
        can_join: userId && !players.includes(userId) && playersCount < 4,
      };
    });

    if (available === "true") {
      matches = matches.filter(m => !m.is_full);
    }

    res.json({ matches });

  } catch (err) {
    console.error("getMatches ERROR:", err);
    res.status(500).json({ message: "Error matches" });
  }
};

// ================= CREATE MATCH =================
const createMatch = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "No autorizado" });

    const userId = parseInt(req.user.id);
    const { start_time, end_time, level, price, court_id } = req.body;

    if (!start_time || !end_time || !level || !price || !court_id) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const levelsPermitidos = ["8va","7ma","6ta","5ta","4ta","3ra","2da","1ra"];
    if (!levelsPermitidos.includes(level)) {
      return res.status(400).json({ message: "Categoría no válida" });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (start >= end) return res.status(400).json({ message: "Horario inválido" });
    if (start < new Date()) return res.status(400).json({ message: "No se puede crear en el pasado" });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Crear match
      const matchResult = await client.query(`
        INSERT INTO matches (start_time, end_time, level, price, created_by, status, court_id)
        VALUES ($1,$2,$3,$4,$5,'OPEN',$6)
        RETURNING *
      `, [start, end, level, price, userId, court_id]);

      const match = matchResult.rows[0];

      // Insertar creador como player
      await client.query(
        "INSERT INTO match_players (match_id, user_id) VALUES ($1,$2)",
        [match.id, userId]
      );

      await client.query("COMMIT");

      res.status(201).json({ match });

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error("CREATE MATCH ERROR:", err);
    res.status(500).json({ message: "Error crear partido" });
  }
};


// ================= JOIN MATCH =================
const joinMatch = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const matchId = parseInt(req.params.id);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Lock match
      const match = await client.query(
        "SELECT id FROM matches WHERE id=$1 FOR UPDATE",
        [matchId]
      );

      if (!match.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Partido no existe" });
      }

      // ya está?
      const exists = await client.query(
        "SELECT 1 FROM match_players WHERE match_id=$1 AND user_id=$2",
        [matchId, userId]
      );

      if (exists.rows.length) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Ya estás en el partido" });
      }

      // contar players
      const count = await client.query(
        "SELECT COUNT(*) FROM match_players WHERE match_id=$1",
        [matchId]
      );

      if (parseInt(count.rows[0].count) >= 4) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Partido lleno" });
      }

      // insertar
      await client.query(
        "INSERT INTO match_players (match_id, user_id) VALUES ($1,$2)",
        [matchId, userId]
      );

      await client.query("COMMIT");
      res.json({ message: "Joined OK" });

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("JOIN ERROR", error);
    res.status(500).json({ message: "Error join" });
  }
};


// ================= LEAVE MATCH =================
const leaveMatch = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const matchId = parseInt(req.params.id);

    await pool.query(
      "DELETE FROM match_players WHERE match_id=$1 AND user_id=$2",
      [matchId, userId]
    );

    res.json({ message: "Saliste del partido" });

  } catch (err) {
    console.error("leaveMatch ERROR:", err);
    res.status(500).json({ message: "Error leave" });
  }
};


// ================= FINISH MATCH =================
const finishMatch = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const matchId = parseInt(req.params.id);

    const { rows } = await pool.query("SELECT * FROM matches WHERE id=$1", [matchId]);
    if (!rows.length) return res.status(404).json({ message: "Partido no encontrado" });

    if (rows[0].created_by !== userId) {
      return res.status(403).json({ message: "No sos el creador" });
    }

    await pool.query("UPDATE matches SET status='FINISHED' WHERE id=$1", [matchId]);

    res.json({ message: "Partido finalizado" });

  } catch (error) {
    console.error("FINISH ERROR:", error);
    res.status(500).json({ message: "Error al finalizar" });
  }
};

module.exports = {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  finishMatch,
};
