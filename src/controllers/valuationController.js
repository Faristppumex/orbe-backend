const { fetchValuationRatios } = require("../services/valuationService");

function transformValuationApiResponse(apiResponse) {
  const headers = [
    "",
    ...apiResponse.map((item) => item.period || item.date || ""),
  ];

  // Substitute missing values with 0 and format as "0.0x"
  const getValues = (key) =>
    apiResponse.map((item) =>
      item.metrics && item.metrics[key] !== undefined
        ? `${Number(item.metrics[key]).toFixed(1)}x`
        : "0.0x"
    );

  return {
    headers,
    rows: [
      ["EV / Sales", ...getValues("evSalesRatio")],
      ["EV / EBITDA", ...getValues("enterpriseValueMultiple")],
      ["EV / EBIT", ...getValues("evEbitRatio")],
      ["EBITDA / Interest Expense", ...getValues("ebitdaInterestExpenseRatio")],
      ["EBIT / Interest Expense", ...getValues("ebitInterestExpenseRatio")],
      [
        "EBITDA - CapEx / Interest Expense",
        ...getValues("ebitdaCapexInterestExpenseRatio"),
      ],
      ["Total Debt/EV", ...getValues("totalDebtEvRatio")],
      ["Price to Earnings", ...getValues("priceEarningsRatio")],
    ],
  };
}

async function getValuationRatios(req, res) {
  try {
    const symbol = req.query.symbol || "AAPL";
    const apiResponse = await fetchValuationRatios(symbol);
    const transformed = transformValuationApiResponse(apiResponse);
    res.json(transformed);
  } catch (error) {
    console.error(
      "Error fetching valuation ratios:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch valuation ratios" });
  }
}

module.exports = { getValuationRatios };
