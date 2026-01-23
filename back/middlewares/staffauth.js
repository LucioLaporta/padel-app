const pool = require("../config/db");

const staffAuth = async (req, res, next) => {
  const userId = req.user.id;
  const { courtId } = req.params; // se pasa como param o body

  try {
    const { rows } = await pool.query(
      `SELECT * FROM court_staff WHERE user_id = $1 AND court_id = $2`,
      [userId, courtId]
    );

    if (!rows.length) {
      return res.status(403).json({ message: "No sos staff de esta cancha" });
    }

    next();
  } catch (error) {
    console.error("Staff auth error:", error);
    return res.status(500).json({ message: "Error interno de permisos" });
  }
};

module.exports = staffAuth;
