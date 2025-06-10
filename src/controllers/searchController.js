const { fetchSearchResults } = require("../services/searchService");

async function getSearchResults(req, res) {
  try {
    const query = req.query.query || "";
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const data = await fetchSearchResults(query);
    res.json(data);
  } catch (error) {
    console.error(
      "Error fetching search results:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch search results" });
  }
}

module.exports = { getSearchResults };
