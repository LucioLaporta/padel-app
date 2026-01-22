const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  ratePlayer,
  getPlayerRating,
  getAllComments,
} = require("../controllers/ratings.controller");

// POST: calificar jugador
router.post("/player", authMiddleware, ratePlayer);

// GET: rating promedio jugador
router.get("/player/:id", getPlayerRating);

// GET: todos los comentarios (solo admins)
router.get("/comments", authMiddleware, getAllComments);

module.exports = router;
