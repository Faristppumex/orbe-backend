const express = require("express");
const { getValuationRatios } = require("../controllers/valuationController");

const router = express.Router();

router.get("/", getValuationRatios);

module.exports = router;
