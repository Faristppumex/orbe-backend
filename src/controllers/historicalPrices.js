const { fetchHistoricalPrices } = require("../services/historicalPrices");

async function getHistoricalPrices(req, res) {
  try {
    const symbol = req.query.symbol || "AAPL";
    const data = await fetchHistoricalPrices(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

module.exports = { getHistoricalPrices };
