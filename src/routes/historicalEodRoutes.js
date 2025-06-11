const express = require("express");
const {
  getMultipleHistoricalEod,
} = require("../controllers/historicalEodController");

const router = express.Router();

router.get("/", getMultipleHistoricalEod);

module.exports = router;
