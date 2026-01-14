const express = require("express");
const cors = require("cors");

// Rutas
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Backend de Pádel App funcionando 🚀");
});

// Puerto
const PORT = 3000;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});