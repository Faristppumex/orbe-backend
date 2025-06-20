const axios = require("axios");
async function fetchFinancialData(symbol = "AAPL") {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 4;
  const metrics = [
    "revenue",
    "grossProfit",
    "operatingIncome",
    "ebitda",
    "netIncome",
    "cashAndShortTermInvestments",
    "totalAssets",
    "totalDebt",
    "netDebt",
    "totalLiabilities",
    "totalStockholdersEquity",
    "netCashProvidedByOperatingActivities",
    "investmentsInPropertyPlantAndEquipment",
    "netCashUsedForInvestingActivites",
    "netCashUsedProvidedByFinancingActivities",
    "freeCashFlow",
  ].join(",");

  const url = `http://orbe360.ai:8080/time-series/${symbol}?metrics=${metrics}&start_year=${startYear}`;
  const response = await axios.get(url);
  // console.log(response);
  return response.data;
}

module.exports = { fetchFinancialData };
