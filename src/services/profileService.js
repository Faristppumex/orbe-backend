const axios = require("axios");
const { fetchExecutivesFromPerplexity } = require("./perplexityService");

const API_KEY = process.env.API_KEY;

// Fetch profile for a given company symbol (default: AAPL)
async function fetchProfile(symbol) {
  const response = await axios.get(
    `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${API_KEY}`
  );
  const data = response.data;

  // If data is an array and has at least one profile
  if (Array.isArray(data) && data.length > 0) {
    const profile = data[0];
    // Fetch executives from Perplexity
    const executives = await fetchExecutivesFromPerplexity(profile);
    // Merge and return
    return [{ ...profile, ...executives }];
  }
  return data;
}

module.exports = { fetchProfile };
