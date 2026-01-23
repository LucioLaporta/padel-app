const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const staffAuth = require("../middlewares/staffauth");
const { createBlock, listBlocks } = require("../controllers/courtStaff.controller");
const { getMatchesByCourt } = require("../controllers/courtstaffmatches.controller");

// Crear bloqueo manual en la cancha (staff)
router.post("/:courtId/blocks", authMiddleware, staffAuth, createBlock);

// Listar bloques de la cancha (staff)
router.get("/:courtId/blocks", authMiddleware, staffAuth, listBlocks);

// Ver partidos de la cancha (staff)
router.get("/:courtId/matches", authMiddleware, staffAuth, getMatchesByCourt);

module.exports = router;
