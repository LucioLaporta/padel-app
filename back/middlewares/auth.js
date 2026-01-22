const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Traemos usuario completo de la DB
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // 🔒 Bloquear si está baneado
    if (user.banned) {
      return res.status(403).json({
        message: `⚠️ Estás baneado por actitud antideportiva. Motivo: ${user.ban_reason || "No especificado"}. Contactá al admin si crees que es un error.`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;
