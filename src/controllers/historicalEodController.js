const {
  fetchMultipleHistoricalEod,
} = require("../services/historicalEodService");

async function getMultipleHistoricalEod(req, res) {
  try {
    // Accept comma-separated symbols: ?symbols=AAPL,MSFT,GOOGL
    const symbols = (req.query.symbols || "AAPL,MSFT,GOOGL,HPQ,DELL").split(
      ","
    );
    const data = await fetchMultipleHistoricalEod(symbols);
    res.json(data);
  } catch (error) {
    console.error(
      "Error fetching historical EOD:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch historical prices" });
  }
}

module.exports = { getMultipleHistoricalEod };
