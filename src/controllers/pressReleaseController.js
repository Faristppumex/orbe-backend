const {
  fetchPressReleases,
  getPerplexityPressReleaseSummary,
} = require("../services/pressReleaseService");

async function getPressReleases(req, res) {
  try {
    const symbol = req.query.symbol || "NKE";
    const data = await fetchPressReleases(symbol);
    res.json(data);
  } catch (error) {
    console.error(
      "Error fetching press releases:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch press releases" });
  }
}

async function getPressReleaseSummaryPoints(req, res) {
  const symbol = req.query.symbol || "AAPL"; // Default to AAPL or get from query

  try {
    const points = await getPerplexityPressReleaseSummary(symbol);
    // console.log("hitts")
    return res.json(points);
  } catch (error) {
    console.error("Press Release Summary AI error message:", error.message);
    console.error("API error status:", error.response?.status);
    console.error("API error data (from Perplexity):", error.response?.data);
    console.error("Stack:", error.stack);
    return res.status(error.response?.status || 500).json({
      error: "Failed to get press release summary from AI",
      details: error.response?.data || error.message,
    });
  }
}

module.exports = { getPressReleases, getPressReleaseSummaryPoints };
