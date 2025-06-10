const axios = require("axios");

const API_KEY = process.env.API_KEY;

async function fetchSearchResults(query) {
  const response = await axios.get(
    `https://financialmodelingprep.com/stable/search-symbol?query=${encodeURIComponent(
      query
    )}&apikey=${API_KEY}`
  );
  return response.data;
}

module.exports = { fetchSearchResults };
