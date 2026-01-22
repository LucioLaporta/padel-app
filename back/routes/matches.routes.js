const express = require("express");
const router = express.Router();

const {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  finishMatch,
} = require("../controllers/matches.controller");

const auth = require("../middlewares/auth");

router.get("/", auth, getMatches);
router.post("/", auth, createMatch);
router.post("/:id/join", auth, joinMatch);
router.post("/:id/leave", auth, leaveMatch);
router.post("/:id/finish", auth, finishMatch);

module.exports = router;
