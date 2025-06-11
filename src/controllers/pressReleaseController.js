const { fetchPressReleases } = require("../services/pressReleaseService");

async function getPressReleases(req, res) {
  try {
    const symbol = req.query.symbol || "NKE";
    const data = await fetchPressReleases(symbol);
    res.json(data);
  } catch (error) {
    console.error(
      "Error fetching press releases:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch press releases" });
  }
}

module.exports = { getPressReleases };
