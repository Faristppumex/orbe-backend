// Example: src/controllers/combinedReportController.js
const {
  getCombinedAnalysisFromPerplexity,
} = require("../services/combinedReportService");

async function getCombinedReport(req, res) {
  const symbol = req.query.symbol || "AAPL"; // Or your default

  try {
    const combinedData = await getCombinedAnalysisFromPerplexity(symbol);
    return res.json(combinedData);
  } catch (error) {
    // This catch might be redundant if service handles its own errors well
    console.error("Controller error getting combined report:", error.message);
    return res.status(500).json({
      error: "Failed to get combined report",
      details: error.message,
    });
  }
}

module.exports = { getCombinedReport };
