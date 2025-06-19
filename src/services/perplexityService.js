const axios = require("axios");
const PPLX_API_KEY = process.env.PPLX_API_KEY;

// Given a company profile object, ask Perplexity for CTO, CFO, COO names
async function fetchExecutivesFromPerplexity(profile) {
  const prompt = `
Given the following company profile data:
${JSON.stringify(profile, null, 2)}

Extract the names of the CTO, CFO, and COO if available. 
Return as a JSON object like:
{"cto": "...", "cfo": "...", "coo": "..."}
If a role is not found, use null for that field.
Only return the JSON object.
  `;

  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Try to parse the JSON from the response
  const content = response.data.choices[0].message.content;
  console.log("perplex");
  console.log(content);
  try {
    // Find the first JSON object in the response
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch (e) {
    // Parsing failed
  }
  // Fallback: return nulls
  return { cto: null, cfo: null, coo: null };
}

module.exports = { fetchExecutivesFromPerplexity };
