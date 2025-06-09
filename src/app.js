const express = require("express");
const profileRoutes = require("./routes/profileRoutes");
const historicalRoutes = require("./routes/historicalRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use("/api/profile", profileRoutes);
app.use("/api/historical", historicalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
