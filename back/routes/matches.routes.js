const express = require("express");
const router = express.Router();

// Controllers
const {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
} = require("../controllers/matches.controller");

// Middleware de auth (JWT)
const auth = require("../middlewares/auth");

/**
 * GET /api/matches
 * Público
 * Filtros:
 *  - ?level=6ta
 *  - ?available=true
 */
router.get("/", getMatches);

/**
 * POST /api/matches
 * Crear partido (logueado)
 */
router.post("/", auth, createMatch);

/**
 * POST /api/matches/:id/join
 * Unirse a un partido (logueado)
 */
router.post("/:id/join", auth, joinMatch);

/**
 * POST /api/matches/:id/leave
 * Salir de un partido (logueado)
 */
router.post("/:id/leave", auth, leaveMatch);

/**
 * DELETE /api/matches/:id
 * Borrar partido (solo creador)
 */
router.delete("/:id", auth, deleteMatch);

module.exports = router;