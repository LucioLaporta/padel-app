const express = require("express");
const router = express.Router();

const { getCourts } = require("../controllers/courts.controller");

router.get("/", getCourts);

module.exports = router;