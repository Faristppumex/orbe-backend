const express = require("express");
const { getHistoricalPrices } = require("../controllers/historicalPrices");

const router = express.Router();

router.get("/", getHistoricalPrices);

module.exports = router;
