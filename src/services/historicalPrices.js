const axios = require("axios");
const API_KEY = process.env.API_KEY;

async function fetchHistoricalPrices() {
  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?apikey=${API_KEY}`;
  const response = await axios.get(url);

  // Only return date and close for each historical item
  const historical = Array.isArray(response.data.historical)
    ? response.data.historical.map((item) => ({
        date: item.date,
        close: item.close,
      }))
    : [];
  if (historical) {
    console.log(historical);
  }

  return historical;
}

module.exports = { fetchHistoricalPrices };
