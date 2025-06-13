const express = require("express");
const {
  getPressReleaseSummaryPoints,
  fetchPressReleases,
} = require("../controllers/pressReleaseController"); // Assuming fetchPressReleases is also in your controller

const router = express.Router();

// This route will handle GET requests to /api/press-release?symbol=XYZ
// and use the controller function that calls Perplexity for summarization.
router.get("/", getPressReleaseSummaryPoints);

// Optional: If you still want an endpoint to get raw press releases without summarization
// you could add another route, for example:
// router.get("/raw", fetchPressReleases);
// This would be accessible via /api/press-release/raw?symbol=XYZ

module.exports = router;
