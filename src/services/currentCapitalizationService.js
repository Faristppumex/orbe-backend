const axios = require("axios");

function fetchCapitalizationData(orbeDatabaseUrl, symbol, start_year = 2024) {
  const url = `${orbeDatabaseUrl}/time-series/${symbol}?metrics=totalDebt,cashAndCashEquivalents,minorityInterest,weightedAverageShsOut,weightedAverageShsOutDil&start_year=${start_year}`;
  return axios.get(url).then((response) => response.data);
}
module.exports = { fetchCapitalizationData };
