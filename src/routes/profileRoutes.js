const express = require("express");
const { getProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfile);

module.exports = router;

// // Example: backend/routes/profileRoutes.js
// router.get("/", async (req, res) => {
//   const symbol = req.query.symbol;
//   if (!symbol) {
//     return res.status(400).json({ error: "Symbol is required" });
//   }
//   // Fetch company profile for the symbol from your data source
//   const profile = await getCompanyProfileBySymbol(symbol); // implement this function
//   if (!profile) {
//     return res.status(404).json({ error: "Company not found" });
//   }
//   res.json(profile);
// });
