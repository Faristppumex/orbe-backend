const {
  //   getDummyCompanyOverviewPoints,
  getPerplexityCompanyOverview,
} = require("../services/companyOverviewService");

async function getCompanyOverviewPoints(req, res) {
  const symbol = req.query.symbol || "IBM";
  const useAI = req.query.ai === "true";

  if (useAI) {
    try {
      const points = await getPerplexityCompanyOverview(symbol);

      //   console.log("RAW response:", JSON.stringify(response.data, null, 2));

      return res.json(points);
    } catch (error) {
      console.error("Perplexity AI error message:", error.message);
      console.error("API error status:", error.response?.status);
      console.error("API error data (from Perplexity):", error.response?.data); // THIS IS KEY!
      console.error("Stack:", error.stack);
      return res.status(error.response?.status || 500).json({
        error: "Failed to get overview from AI",
        details: error.response?.data || error.message,
      });
    }
  } else {
    return "not Available";
  }
}

module.exports = { getCompanyOverviewPoints };
