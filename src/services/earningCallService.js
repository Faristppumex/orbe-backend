const axios = require("axios");
const API_KEY = process.env.API_KEY || "8L"; // Use your API key

async function fetchEarningCallTranscript(symbol, year, quarter) {
  const url = `https://financialmodelingprep.com/stable/earning-call-transcript?symbol=${symbol}&year=${year}&quarter=${quarter}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = { fetchEarningCallTranscript };
