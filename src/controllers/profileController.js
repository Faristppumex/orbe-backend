const { fetchProfile } = require("../services/profileService");

async function getProfile(req, res) {
  try {
    const symbol = req.query.symbol || "AAPL"; // Get symbol from query, default to AAPL
    const data = await fetchProfile(symbol); // Pass symbol to service
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch datad" });
  }
}

module.exports = { getProfile };
