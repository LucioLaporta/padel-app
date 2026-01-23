require("dotenv").config();

const express = require("express");
const cors = require("cors");

// rutas
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const courtsRoutes = require("./routes/courts.routes");
const matchesRoutes = require("./routes/matches.routes");
const ratingsRoutes = require("./routes/ratings.routes");
const courtstaffRoutes = require("./routes/courtstaff.routes"); // staff

const app = express();

app.use(cors());
app.use(express.json());

// usar rutas
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/courtstaff", courtstaffRoutes);

// ruta raíz
app.get("/", (req, res) => {
  res.send("Backend de Pádel App funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});