const axios = require("axios");
const API_KEY = process.env.API_KEY; // FMP API Key
const PPLX_API_KEY = process.env.PPLX_API_KEY; // Perplexity API Key

async function fetchPressReleases(symbol = "AAPL", limit = 20) {
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
      }\nText: ${content.substring(0, 300)}...\n---`; // Reduced substring for brevity
    })
    .join("\n\n");
}

async function getPerplexityPressReleaseSummary(symbol) {
  const pressReleases = await fetchPressReleases(symbol);

  if (!Array.isArray(pressReleases) || pressReleases.length === 0) {
    return ["No press releases found to summarize."];
  }

  const formattedPressReleases = formatPressReleasesForPrompt(pressReleases);

  const prompt = `
Here are the latest press releases for ${symbol}:
${formattedPressReleases}

Given the recent news about ${symbol}extract and return only the "Key Detail" as a plain list.
  `; // Modified prompt for clearer instructions

  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "precise and consise, i need the content in the format , no need for such explanation => 'Here are the key details about... :'",
        },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log("hello");
  const messageContentArray = response.data.choices[0].message.content;

  if (!Array.isArray(messageContentArray)) {
    console.error(
      "Perplexity AI response for press releases is not an array:"
      // messageContentArray
    );
    if (typeof messageContentArray === "string") {
      // If it's a string, try to split and clean
      return messageContentArray
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*|\*\*|##\s*/g, "").trim()) // Remove common list markers, bold, and headers
        .filter(
          (line) =>
            line.length > 0 &&
            !line.toLowerCase().includes("<think>") &&
            !line.toLowerCase().includes("</think>") &&
            !line.toLowerCase().startsWith("okay, i need to summarize") &&
            !line
              .toLowerCase()
              .startsWith("apple's recent press releases highlight") &&
            !line.toLowerCase().startsWith("these developments underscore")
        );
    }
    return [];
  }

  // New parsing logic for the array response
  let summaryStarted = false;
  const extractedPoints = [];

  for (const line of messageContentArray) {
    const trimmedLine = line.trim();

    if (
      trimmedLine
        .toLowerCase()
        .startsWith("apple's recent press releases highlight")
    ) {
      summaryStarted = true;
      continue; // Skip this introductory line
    }

    if (!summaryStarted) {
      continue; // Skip lines before the summary starts (likely the <think> block)
    }

    if (trimmedLine.toLowerCase().startsWith("these developments underscore")) {
      break; // Stop when we reach the concluding sentence
    }

    if (trimmedLine.startsWith("## ") || trimmedLine.length === 0) {
      continue; // Skip section headers and empty lines
    }

    // Clean the line: remove potential markdown like ** and leading list markers
    const cleanedLine = trimmedLine
      .replace(/^[-•*]\s*|\*\*/g, "")
      .replace(/\*\*$/g, "")
      .trim();
    if (cleanedLine.length > 0) {
      extractedPoints.push(cleanedLine);
    }
  }

  return extractedPoints;
}

module.exports = { fetchPressReleases, getPerplexityPressReleaseSummary };
