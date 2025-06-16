const { fetchFinancialData } = require("../services/financialService");

function transformFinancialApiResponse(apiResponse) {
  // Sort the API response first: newest year, then newest quarter first
  const sortedApiResponse = [...apiResponse].sort((a, b) => {
    // Sort by fiscal year descending
    if (b.fiscalyear !== a.fiscalyear) {
      return b.fiscalyear - a.fiscalyear;
    }
    // Then sort by period descending (Q4 > Q3 > Q2 > Q1)
    // Assuming 'FY' is treated as Q4 for sorting purposes if it exists
    const periodOrder = { FY: 4, Q4: 4, Q3: 3, Q2: 2, Q1: 1 };
    const periodA = periodOrder[a.period] || 0;
    const periodB = periodOrder[b.period] || 0;
    return periodB - periodA;
  });

  const headers = sortedApiResponse.map((item) => {
    let period = item.period;
    if (period === "FY") {
      period = "Q4";
    }
    return `${period} ${item.fiscalyear}`;
  });

  const getValues = (key) =>
    sortedApiResponse.map((item) => item.metrics[key] ?? null);

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
    // Ensure apiResponse is an array before attempting to sort/transform
    if (!Array.isArray(apiResponse)) {
      console.error("API response is not an array:", apiResponse);
      return res
        .status(500)
        .json({ error: "Invalid data format from financial service" });
    }
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
