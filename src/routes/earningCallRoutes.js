const express = require("express");
const {
  getEarningCallTranscript,
} = require("../controllers/earningCallController");

const router = express.Router();

router.get("/", getEarningCallTranscript);

module.exports = router;
