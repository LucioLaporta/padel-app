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
const auth = require("../middlewares/auth"); // asegúrate que es auth.js

router.get("/", getMatches);
router.post("/", auth, createMatch);
router.post("/:id/join", auth, joinMatch);
router.post("/:id/leave", auth, leaveMatch);
router.delete("/:id", auth, deleteMatch);

module.exports = router;