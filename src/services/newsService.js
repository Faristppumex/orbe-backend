const axios = require("axios");

const API_KEY = process.env.API_KEY;

async function fetchStockNews(symbol, limit = 10) {
  const response = await axios.get(
    `https://financialmodelingprep.com/stable/news/stock?symbols=${encodeURIComponent(
      symbol
    )}&limit=${limit}&apikey=${API_KEY}`
  );
  return response.data;
}

module.exports = { fetchStockNews };
