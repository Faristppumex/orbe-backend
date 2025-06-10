const { fetchStockNews } = require("../services/newsService");

async function getStockNews(req, res) {
  try {
    const symbol = req.query.symbol;
    const limit = req.query.limit || 10;
    if (!symbol) {
      return res
        .status(400)
        .json({ error: "Symbol query parameter is required" });
    }
    const data = await fetchStockNews(symbol, limit);
    res.json(data);
  } catch (error) {
    console.error(
      "Error fetching stock news:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch stock news" });
  }
}

module.exports = { getStockNews };
