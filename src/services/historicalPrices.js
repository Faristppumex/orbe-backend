const axios = require("axios");

async function fetchHistoricalPrices() {
  const url =
    "https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?apikey=8LL2fsCzkr0lE7LHVZdWf7WiQ1owyG8Z";
  const response = await axios.get(url);

  // Only return date and close for each historical item
  const historical = Array.isArray(response.data.historical)
    ? response.data.historical.map((item) => ({
        date: item.date,
        close: item.close,
      }))
    : [];

  return historical;
}

module.exports = { fetchHistoricalPrices };
