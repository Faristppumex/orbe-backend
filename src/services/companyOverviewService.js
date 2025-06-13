const axios = require("axios");
const API_KEY = process.env.API_KEY; // This should be your FMP API Key

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

async function getPerplexityCompanyOverview(symbol) {
  const rawFinancialReport = await fetchFinancialReport(symbol);
  const financialReport = preprocessFinancialReport(rawFinancialReport);

  const prompt = `
Here is the financial report for ${symbol} for FY 2024:
${JSON.stringify(financialReport, null, 2)}

Analyse the financial report and give a CompanyOverview about it. I need the CompanyOverview as a Python-style list of strings assigned to a variable named 'CompanyOverview', like this: CompanyOverview=['The ${symbol} is very ...', 'The company had grown x% in sales...', etc]. Only provide the 'CompanyOverview = [...]' part and nothing else.
  `;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro", // Assuming you want to use sonar-pro as per this block
        messages: [{ role: "user", content: prompt }],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.PPLX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponseContent = response.data.choices[0].message.content;

    if (typeof rawResponseContent === "string") {
      const listStartIndex = rawResponseContent.indexOf("CompanyOverview = [");
      if (listStartIndex !== -1) {
        const arrayContentStart = listStartIndex + "CompanyOverview = [".length;
        let openBrackets = 1;
        let listEndIndex = -1;

        for (let i = arrayContentStart; i < rawResponseContent.length; i++) {
          if (rawResponseContent[i] === "[") {
            openBrackets++;
          } else if (rawResponseContent[i] === "]") {
            openBrackets--;
            if (openBrackets === 0) {
              listEndIndex = i;
              break;
            }
          }
        }

        if (listEndIndex !== -1) {
          const arrayInnerString = rawResponseContent.substring(
            arrayContentStart,
            listEndIndex
          );
          const regex = /(['"])((?:(?!\1|\\).|\\.)*)\1/g;
          let match;
          const items = [];
          while ((match = regex.exec(arrayInnerString)) !== null) {
            items.push(
              match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').trim()
            );
          }

          if (items.length > 0) {
            return items;
          } else {
            console.error(
              "Regex did not find any items in the extracted list string:",
              arrayInnerString
            );
          }
        } else {
          console.error(
            "Could not find the closing bracket for CompanyOverview list."
          );
        }
      } else {
        console.error("Could not find 'CompanyOverview = [' in the response.");
      }

      // Fallback if specific parsing fails
      return rawResponseContent
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*|\*\*|##\s*/g, "").trim())
        .filter((line) => {
          const lowerLine = line.toLowerCase();
          return (
            line.length > 0 &&
            !lowerLine.includes("<think>") &&
            !lowerLine.includes("companyoverview = [") &&
            !lowerLine.startsWith("```") &&
            !lowerLine.startsWith("here's the companyoverview analysis") &&
            !lowerLine.startsWith("key financial ratios/trends:") &&
            !(lowerLine.startsWith("- ") && lowerLine.includes(":")) &&
            !lowerLine.startsWith("]")
          );
        })
        .filter((item) => item.length > 0);
    } else if (Array.isArray(rawResponseContent)) {
      const thinkEndIndex = rawResponseContent.indexOf("</think>");
      let pointsToProcess = rawResponseContent;
      if (thinkEndIndex !== -1) {
        pointsToProcess = rawResponseContent.slice(thinkEndIndex + 1);
      }
      return pointsToProcess
        .map((line) => String(line).trim())
        .filter((line) => {
          const lowerLine = line.toLowerCase();
          return (
            line.length > 0 &&
            !lowerLine.includes("<think>") &&
            !lowerLine.startsWith("okay, let's tackle this query.") &&
            !lowerLine.startsWith("*all figures sourced") &&
            !lowerLine.startsWith("```")
          );
        })
        .filter((item) => item.length > 0);
    }

    console.error(
      "Perplexity AI response content was not a string or an array, or could not be processed:",
      rawResponseContent
    );
    return [];
  } catch (error) {
    console.error(
      "Error fetching or processing Perplexity AI response:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

module.exports = {
  getPerplexityCompanyOverview,
};
