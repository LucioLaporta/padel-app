const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
const register = async (req, res) => {
  const { email, username, password, clase } = req.body;

  const clasesValidas = [
    "8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"
  ];

  if (!email || !username || !password || !clase) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!clasesValidas.includes(clase)) {
    return res.status(400).json({ message: "Clase inválida" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, username, password, clase, reputacion)
       VALUES ($1, $2, $3, $4, 5)
       RETURNING id, email, username, clase, reputacion`,
      [email, username, hashedPassword, clase]
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: result.rows[0],
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password requeridos" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = result.rows[0];

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        clase: user.clase,
        reputacion: user.reputacion,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // <-- esto te muestra el error real
    return res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { register, login };