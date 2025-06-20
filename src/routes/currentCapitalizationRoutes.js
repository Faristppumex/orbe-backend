const express = require("express");
const {
  getCapitalizationData,
} = require("../controllers/currentCapitalizationController");

const router = express.Router();
// This route will handle GET requests to /api/capitalization?symbol=XYZ&start_year=2024
router.get("/", getCapitalizationData);

module.exports = router;
