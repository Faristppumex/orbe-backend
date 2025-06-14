const axios = require("axios");

const API_KEY = process.env.API_KEY;

// Fetch profile for a given company symbol (default: AAPL)
async function fetchProfile(symbol) {
  const response = await axios.get(
    `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${API_KEY}`
  );
  return response.data;
}

module.exports = { fetchProfile };
