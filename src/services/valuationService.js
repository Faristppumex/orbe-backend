const axios = require("axios");

async function fetchValuationRatios(symbol = "AAPL") {
  const metrics = [
    "evSalesRatio",
    "enterpriseValueMultiple",
    "evEbitRatio",
    "ebitdaInterestExpenseRatio",
    "ebitInterestExpenseRatio",
    "ebitdaCapexInterestExpenseRatio",
    "totalDebtEvRatio",
    "priceEarningsRatio",
  ].join(",");
  const url = `http://orbe360.ai:8080/time-series/${symbol}?metrics=${metrics}&start_year=2021`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = { fetchValuationRatios };
