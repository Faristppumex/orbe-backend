const {
  fetchEarningCallTranscript,
} = require("../services/earningCallService");

async function getEarningCallTranscript(req, res) {
  try {
    const symbol = req.query.symbol || "AAPL";
    const year = req.query.year || "2020";
    const quarter = req.query.quarter || "3";
    const data = await fetchEarningCallTranscript(symbol, year, quarter);
    res.json(data);
  } catch (error) {
    console.error("Error fetching earning call transcript:", error.message);
    res.status(500).json({ error: "Failed to fetch earning call transcript" });
  }
}

module.exports = { getEarningCallTranscript };
