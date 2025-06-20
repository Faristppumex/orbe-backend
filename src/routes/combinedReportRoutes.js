const express = require("express");
const {
  getCombinedReport,
} = require("../controllers/combinedReportController");

  const router = express.Router();
  
// This route will handle GET requests to /api/combined-report?symbol=XYZ
router.get("/", getCombinedReport);

module.exports = router;
