const express = require("express");
const router = express.Router();
const { getMatches, createMatch } = require("../controllers/matches.controller");

// Traer todos los partidos
router.get("/", getMatches);

// Crear un partido
router.post("/", createMatch);

module.exports = router;