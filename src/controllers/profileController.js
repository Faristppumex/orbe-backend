const { fetchProfile } = require("../services/profileService");

async function getProfile(req, res) {
  try {
    // const symbol = req.query.symbol || "NKE";
    const data = await fetchProfile();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

module.exports = { getProfile };
