const register = (req, res) => {
  const { email, username, password, clase } = req.body;

  const clasesValidas = [
    "8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"
  ];

  if (!email || !username || !password || !clase) {
    return res.status(400).json({
      message: "Faltan datos obligatorios"
    });
  }

  if (!clasesValidas.includes(clase)) {
    return res.status(400).json({
      message: "Clase inválida"
    });
  }

  return res.status(201).json({
    message: "Usuario registrado correctamente",
    user: {
      email,
      username,
      clase,
      reputacion: 5
    }
  });
};

module.exports = {
  register
};