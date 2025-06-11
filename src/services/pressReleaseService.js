const axios = require("axios");
const API_KEY = process.env.API_KEY;

async function fetchPressReleases(symbol = "AAPL") {
  const url = `https://financialmodelingprep.com/stable/news/press-releases?limit=5&symbols=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  console.log(response.data);
  return response.data;
}

module.exports = { fetchPressReleases };
