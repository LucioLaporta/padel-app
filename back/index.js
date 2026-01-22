require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Rutas existentes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const courtsRoutes = require("./routes/courts.routes");
const matchesRoutes = require("./routes/matches.routes");

// NUEVO: rutas de ratings
const ratingsRoutes = require("./routes/ratings.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Usar rutas
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/ratings", ratingsRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Backend de Pádel App funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});