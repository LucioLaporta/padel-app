const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  getMatches,
  createMatch,
  joinMatch,
} = require("../controllers/matches.controller");

// Traer todos los partidos (público)
router.get("/", getMatches);

// Crear un partido (requiere login)
router.post("/", authMiddleware, createMatch);

// Unirse a un partido (requiere login)
router.post("/:id/join", authMiddleware, joinMatch);

module.exports = router;