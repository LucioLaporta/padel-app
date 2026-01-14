const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api", healthRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend de Pádel App funcionando 🚀");
});

// Puerto
const PORT = 3000;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
