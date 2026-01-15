const express = require("express");
const cors = require("cors");

// Rutas
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const courtsRoutes = require("./routes/courts.routes");
const matchesRoutes = require("./routes/matches.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/matches", matchesRoutes);

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