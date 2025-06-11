const { fetchFinancialData } = require("../services/financialService");

function transformFinancialApiResponse(apiResponse) {
  const headers = apiResponse.map(
    (item) => `${item.period} ${item.fiscalyear}`
  );

  const getValues = (key) =>
    apiResponse.map((item) => item.metrics[key] ?? null);

  return {
    headers,
    data: {
      "Income Statement": [
        ["Sales", getValues("revenue")],
        ["Gross Income", getValues("grossProfit")],
        ["EBIT", getValues("operatingIncome")],
        ["EBITDA", getValues("ebitda")],
        ["Net Income", getValues("netIncome")],
      ],
      "Balance Sheet": [
        [
          "Cash & Short-Term Investments",
          getValues("cashAndShortTermInvestments"),
        ],
        ["Total Assets", getValues("totalAssets")],
        ["Total Debt", getValues("totalDebt")],
        ["Net Debt", getValues("netDebt")],
        ["Total Liabilities", getValues("totalLiabilities")],
        ["Total Shareholders' Equity", getValues("totalStockholdersEquity")],
      ],
      "Cash Flow": [
        [
          "Net Operating Cash Flow",
          getValues("netCashProvidedByOperatingActivities"),
        ],
        [
          "Capital Expenditures",
          getValues("investmentsInPropertyPlantAndEquipment"),
        ],
        [
          "Net Investing Cash Flow",
          getValues("netCashUsedForInvestingActivites"),
        ],
        [
          "Net Financing Cash Flow",
          getValues("netCashUsedProvidedByFinancingActivities"),
        ],
        ["Free Cash Flow", getValues("freeCashFlow")],
      ],
    },
  };
}

async function getFinancialData(req, res) {
  try {
    const symbol = req.query.symbol || "AAPL";
    const apiResponse = await fetchFinancialData(symbol);
    const transformed = transformFinancialApiResponse(apiResponse);
    res.json(transformed);
  } catch (error) {
    console.error(
      "Error fetching financial data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch financial data" });
  }
}

module.exports = { getFinancialData };
