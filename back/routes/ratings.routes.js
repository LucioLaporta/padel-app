const express = require("express");
const router = express.Router();
const { rateCourt, ratePlayer, getCourtRating, getPlayerRating } = require("../controllers/ratings.controller");
const authMiddleware = require("../middlewares/auth"); // tu middleware de token

// Votar cancha / jugador (POST)
router.post("/court", authMiddleware, rateCourt);
router.post("/player", authMiddleware, ratePlayer);

// Ver rating cancha / jugador (GET)
router.get("/court/:id", getCourtRating);
router.get("/player/:id", getPlayerRating);

module.exports = router;