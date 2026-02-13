require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const matchesRoutes = require("./routes/matches.routes");
const courtsRoutes = require("./routes/courts.routes");

// MOUNT ROUTES
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/courts", courtsRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("SERVIDOR OK EN 3000");
});
