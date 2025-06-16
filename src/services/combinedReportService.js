const axios = require("axios");
const API_KEY = process.env.API_KEY; // FMP API Key
const PPLX_API_KEY = process.env.PPLX_API_KEY; // Perplexity API Key

// --- Helper functions ---

async function fetchFinancialReport(symbol) {
  const url = `${process.env.FMP_BASE_URL}/financial-reports-json?symbol=${symbol}&year=2024&period=FY&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

function preprocessFinancialReport(reportArray) {
  if (!Array.isArray(reportArray)) {
    return reportArray; // Return as is if not an array (e.g., already an object)
  }
  if (reportArray.length === 0) {
    return {}; // Return empty object if array is empty
  }
  // If it's an array of reports (e.g. quarterly), FMP often returns the latest first.
  // For a single FY report, it might be an array with one object.
  // We'll assume for now we want the first element if it's an array, or the object itself.
  const reportData = Array.isArray(reportArray) ? reportArray[0] : reportArray;

  const processedReport = {};
  if (typeof reportData === "object" && reportData !== null) {
    for (const key in reportData) {
      processedReport[key] = reportData[key];
    }
  }
  return processedReport;
}

// Helper function to select key financial data to reduce token count
// This function is kept for potential future use or if you switch back.
function selectKeyFinancialData(fullReport) {
  if (
    !fullReport ||
    typeof fullReport !== "object" ||
    Object.keys(fullReport).length === 0
  ) {
    return { info: "No detailed financial data provided or report is empty." };
  }
  const keyData = {
    symbol: fullReport.symbol,
    reportedCurrency: fullReport.reportedCurrency,
    fillingDate: fullReport.fillingDate,
    period: fullReport.period,
    revenue: fullReport.revenue,
    netIncome: fullReport.netIncome,
    eps: fullReport.eps || fullReport.earningsPerShare,
    grossProfit: fullReport.grossProfit,
    operatingIncome: fullReport.operatingIncome,
    totalAssets: fullReport.totalAssets,
    totalLiabilities: fullReport.totalLiabilities,
    netCashProvidedByOperatingActivities:
      fullReport.netCashProvidedByOperatingActivities,
    freeCashFlow: fullReport.freeCashFlow,
  };
  Object.keys(keyData).forEach(
    (key) => keyData[key] === undefined && delete keyData[key]
  );
  if (Object.keys(keyData).length <= 4 && fullReport.symbol) {
    return {
      info: `Selected financial highlights for ${fullReport.symbol} (${
        fullReport.period || "N/A"
      } ${fullReport.fiscalYear || fullReport.calendarYear || ""})`,
      revenue: fullReport.revenue,
      netIncome: fullReport.netIncome,
      eps: fullReport.eps || fullReport.earningsPerShare,
    };
  }
  return keyData;
}

async function fetchPressReleases(symbol, limit = 3) {
  // Keep limit low for tokens
  const url = `https://financialmodelingprep.com/stable/news/press-releases?limit=${limit}&symbols=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

function formatPressReleasesForPrompt(pressReleases) {
  if (!Array.isArray(pressReleases) || pressReleases.length === 0) {
    return "No press releases found.";
  }
  return pressReleases
    .map((pr, index) => {
      const content = pr.text || pr.content || "No content available.";
      return `Press Release ${index + 1} (Date: ${pr.date}):\nTitle: ${
        pr.title
      }\nText: ${content.substring(0, 400)}...\n---`; // Slightly reduced substring for press releases
    })
    .join("\n\n");
}

// --- Main function for combined analysis ---

async function getCombinedAnalysisFromPerplexity(symbol) {
  // 1. Fetch all necessary data
  const rawFinancialReport = await fetchFinancialReport(symbol);
  // Use the processed (raw) financial report for the prompt
  const financialDataForPrompt = preprocessFinancialReport(rawFinancialReport);

  const originalPressReleases = await fetchPressReleases(symbol);
  const formattedPressReleasesForAI = formatPressReleasesForPrompt(
    originalPressReleases
  );

  // 2. Construct the combined prompt
  const prompt = `
Here is the financial report data for ${symbol}:
${JSON.stringify(financialDataForPrompt, null, 2)}

Here are the latest press releases for ${symbol}:
${formattedPressReleasesForAI}

Based on all the information provided:

1.  Provide a CompanyOverview based on the financial report data. I need this as a Python-style list of strings assigned to a variable named 'CompanyOverview'. Example: CompanyOverview=['Financial point 1...', 'Financial point 2...', etc]. Only provide the 'CompanyOverview = [...]' part for this.

2.  For the press releases provided above, analyze the sentiment of each one (e.g., Positive, Negative, Neutral). Provide these sentiments as a Python-style list of strings assigned to 'PressReleaseSentiments', in the same order as the press releases appear in the input. For example, if there are 3 press releases, the output should be like: PressReleaseSentiments=['Positive', 'Neutral', 'Negative']. Only provide the 'PressReleaseSentiments = [...]' part for this.

3.  If possible, provide a list of top 5 (minimum) key competitors assigned to 'KeyCompetitors'. Example: KeyCompetitors=['Competitor A', 'Competitor B', ...].

4.  If possible, provide a list of top 5 (minimum) key customers assigned to 'KeyCustomers'. Example: KeyCustomers=['Customer X', 'Customer Y', ...].

Ensure all lists are provided clearly and distinctly, in the specified formats and order.
  `;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-reasoning-pro",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${PPLX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponseContent = response.data.choices[0].message.content;

    const companyOverviewPoints = parseListFromString(
      rawResponseContent,
      "CompanyOverview"
    );
    const pressReleaseSentiments = parseListFromString(
      rawResponseContent,
      "PressReleaseSentiments"
    );
    const keyCompetitors = parseListFromString(
      rawResponseContent,
      "KeyCompetitors"
    );
    const keyCustomers = parseListFromString(
      rawResponseContent,
      "KeyCustomers"
    );

    const pressReleasesForFrontend = originalPressReleases.map((pr, index) => {
      const originalText = pr.text || pr.content || "No content available.";
      return {
        text: originalText,
        sentiment: pressReleaseSentiments[index] || "N/A",
        date: pr.date,
        title: pr.title,
      };
    });

    return {
      companyOverview: companyOverviewPoints || [],
      pressReleases: pressReleasesForFrontend,
      keyCompetitors: keyCompetitors || [],
      keyCustomers: keyCustomers || [],
    };
  } catch (error) {
    console.error(
      "Error fetching or processing combined Perplexity AI response:",
      error.response ? error.response.data : error.message
    );
    let errorDetails = error.message;
    if (error.response && error.response.data && error.response.data.error) {
      errorDetails = error.response.data.error.message || error.message;
      if (error.response.data.error.type === "too_many_prompt_tokens") {
        console.error(
          "Prompt too long. Consider reducing financial data (e.g., by using selectKeyFinancialData) or press release content/count."
        );
      }
    }
    return {
      companyOverview: [],
      pressReleases: [],
      keyCompetitors: [],
      keyCustomers: [],
      error: "Failed to get combined analysis from AI.",
      details: errorDetails,
    };
  }
}

function parseListFromString(content, listName) {
  if (typeof content !== "string") return [];
  const listStartIndex = content.indexOf(`${listName} = [`);
  if (listStartIndex === -1) return [];
  const arrayContentStart = listStartIndex + `${listName} = [`.length;
  let openBrackets = 1;
  let listEndIndex = -1;
  for (let i = arrayContentStart; i < content.length; i++) {
    if (content[i] === "[") openBrackets++;
    else if (content[i] === "]") {
      openBrackets--;
      if (openBrackets === 0) {
        listEndIndex = i;
        break;
      }
    }
  }
  if (listEndIndex === -1) return [];
  const arrayInnerString = content.substring(arrayContentStart, listEndIndex);
  const regex = /(['"])((?:(?!\1|\\).|\\.)*)\1/g;
  let match;
  const items = [];
  while ((match = regex.exec(arrayInnerString)) !== null) {
    items.push(match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').trim());
  }
  return items;
}

module.exports = { getCombinedAnalysisFromPerplexity };
