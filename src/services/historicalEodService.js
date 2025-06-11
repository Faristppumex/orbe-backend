const axios = require("axios");
const API_KEY = process.env.API_KEY;

async function fetchHistoricalEod(symbol) {
  const url = `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);

  // response.data is already an array of objects
  return Array.isArray(response.data)
    ? response.data.map((item) => item.close)
    : [];
}

async function fetchMultipleHistoricalEod(symbols = []) {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const closes = await fetchHistoricalEod(symbol);
      return { symbol, closes };
    })
  );
  // Return as { AAPL: [...], MSFT: [...], ... }
  return results.reduce((acc, curr) => {
    acc[curr.symbol] = curr.closes;
    return acc;
  }, {});
}

module.exports = { fetchHistoricalEod, fetchMultipleHistoricalEod };
