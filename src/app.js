require("dotenv").config();

const express = require("express");
const profileRoutes = require("./routes/profileRoutes");
const historicalRoutes = require("./routes/historicalRoutes");
const searchRoutes = require("./routes/searchRoutes");
const newsRoutes = require("./routes/newsRoutes");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use("/api/profile", profileRoutes);
app.use("/api/historical", historicalRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
