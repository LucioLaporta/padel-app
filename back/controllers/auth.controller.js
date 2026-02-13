const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length) {
      return res.status(400).json({ message: "Usuario o email ya existe" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (email, username, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, hashed]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error en registro" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Usuario no existe" });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error login" });
  }
};

// PROFILE
exports.profile = async (req, res) => {
  res.json(req.user);
};
