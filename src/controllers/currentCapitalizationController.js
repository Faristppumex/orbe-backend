const { get } = require("../routes/currentCapitalizationRoutes");
const {
  fetchCapitalizationData,
} = require("../services/currentCapitalizationService");

async function getCapitalizationData(req, res) {
  try {
    const symbol = req.query.symbol;
    const start_year = req.query.start_year || 2024;
    const orbeDatabaseUrl = process.env.ORBE_DATABASE_URL || "";
    if (!symbol) {
      return res
        .status(400)
        .json({ error: "symbol query parameter is required" });
    }
    const data = await fetchCapitalizationData(
      orbeDatabaseUrl,
      symbol,
      start_year
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching capitalization data:", error);
    res.status(500).json({ error: "Failed to fetch capitalization data" });
  }
}

module.exports = { getCapitalizationData };
