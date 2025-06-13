const axios = require("axios");
const API_KEY = process.env.API_KEY;

async function fetchHistoricalEod(symbol) {
  const url = `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);

  // Return array of { date, close }
  return Array.isArray(response.data)
    ? response.data.map((item) => ({ date: item.date, close: item.close }))
    : [];
}

async function  fetchMultipleHistoricalEod(symbols = []) {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const data = await fetchHistoricalEod(symbol);
      return { symbol, data };
    })
  );
  // Return as { AAPL: [...], MSFT: [...], ... }
  return results.reduce((acc, curr) => {
    acc[curr.symbol] = curr.data;
    return acc;
  }, {});
}

module.exports = { fetchHistoricalEod, fetchMultipleHistoricalEod };
