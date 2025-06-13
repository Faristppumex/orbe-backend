const axios = require("axios");
const API_KEY = process.env.API_KEY; // FMP API Key
const PPLX_API_KEY = process.env.PPLX_API_KEY; // Perplexity API Key

// --- Helper functions (can be imported from your existing services or defined here) ---

async function fetchFinancialReport(symbol) {
  const url = `${process.env.FMP_BASE_URL}/financial-reports-json?symbol=${symbol}&year=2024&period=FY&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

function preprocessFinancialReport(reportArray) {
  if (!Array.isArray(reportArray)) {
    return reportArray;
  }
  const processedReport = {};
  reportArray.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      for (const key in item) {
        processedReport[key] = item[key];
      }
    }
  });
  return processedReport;
}

async function fetchPressReleases(symbol, limit = 10) {
  // Limit press releases for prompt length
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
      return `Press Release ${index + 1}:\nTitle: ${pr.title}\nDate: ${
        pr.date
      }\nText: ${content.substring(0, 250)}...\n---`; // Keep substring short
    })
    .join("\n\n");
}

// --- Main function for combined analysis ---

async function getCombinedAnalysisFromPerplexity(symbol) {
  // 1. Fetch all necessary data
  const rawFinancialReport = await fetchFinancialReport(symbol);
  const financialReport = preprocessFinancialReport(rawFinancialReport);
  const pressReleases = await fetchPressReleases(symbol); // Consider a limit
  const formattedPressReleases = formatPressReleasesForPrompt(pressReleases);

  // 2. Construct the combined prompt
  const prompt = `
Here is the financial report for ${symbol} for FY 2024:
${JSON.stringify(financialReport, null, 2)}

Here are the latest press releases for ${symbol}:
${formattedPressReleases}

Based on all the information provided:

1.  First, provide a CompanyOverview based *only* on the financial report. I need this as a Python-style list of strings assigned to a variable named 'CompanyOverview', like this: CompanyOverview=['Financial point 1...', 'Financial point 2...', etc]. Only provide the 'CompanyOverview = [...]' part for this.

2.  Second, provide a summary of the key details(small description can be given each point consisting 2,3 lines) from the press releases. I need this as a Python-style list of strings assigned to a variable named 'PressReleaseSummary', like this: PressReleaseSummary=['Press release point 1...', 'Press release point 2...', etc]. Only provide the 'PressReleaseSummary = [...]' part for this.

Ensure both lists are provided clearly and distinctly, with 'CompanyOverview' first, then 'PressReleaseSummary'.
  `;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-reasoning-pro", // Or your preferred model
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
    // console.log("Raw combined response:", rawResponseContent); // For debugging

    // 3. Parse the combined response
    const companyOverviewPoints = parseListFromString(
      rawResponseContent,
      "CompanyOverview"
    );
    const pressReleasePoints = parseListFromString(
      rawResponseContent,
      "PressReleaseSummary"
    );

    return {
      companyOverview: companyOverviewPoints || [],
      pressReleaseSummary: pressReleasePoints || [],
    };
  } catch (error) {
    console.error(
      "Error fetching or processing combined Perplexity AI response:",
      error.response ? error.response.data : error.message
    );
    return {
      companyOverview: [],
      pressReleaseSummary: [],
      error: "Failed to get combined analysis from AI",
      details: error.message,
    };
  }
}

// --- Helper function to parse lists from the response string ---
function parseListFromString(content, listName) {
  if (typeof content !== "string") return [];

  const listStartIndex = content.indexOf(`${listName} = [`);
  if (listStartIndex === -1) {
    console.error(`Could not find '${listName} = [' in the response.`);
    return [];
  }

  const arrayContentStart = listStartIndex + `${listName} = [`.length;
  let openBrackets = 1;
  let listEndIndex = -1;

  for (let i = arrayContentStart; i < content.length; i++) {
    if (content[i] === "[") {
      openBrackets++;
    } else if (content[i] === "]") {
      openBrackets--;
      if (openBrackets === 0) {
        listEndIndex = i;
        break;
      }
    }
  }

  if (listEndIndex === -1) {
    console.error(`Could not find the closing bracket for ${listName} list.`);
    return [];
  }

  const arrayInnerString = content.substring(arrayContentStart, listEndIndex);
  const regex = /(['"])((?:(?!\1|\\).|\\.)*)\1/g;
  let match;
  const items = [];
  while ((match = regex.exec(arrayInnerString)) !== null) {
    items.push(match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').trim());
  }

  if (items.length === 0) {
    console.error(
      `Regex did not find any items in the extracted ${listName} list string:`,
      arrayInnerString
    );
  }
  return items;
}

module.exports = { getCombinedAnalysisFromPerplexity };
