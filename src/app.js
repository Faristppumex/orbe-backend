require("dotenv").config();
const cors = require("cors");
const express = require("express");

const profileRoutes = require("./routes/profileRoutes");
const historicalRoutes = require("./routes/historicalRoutes");
const searchRoutes = require("./routes/searchRoutes");
const newsRoutes = require("./routes/newsRoutes");
const financialRoutes = require("./routes/financialRoutes");
const valuationRoutes = require("./routes/valuationRoutes");
const pressReleaseRoutes = require("./routes/pressReleaseRoutes");
const historicalEodRoutes = require("./routes/historicalEodRoutes");
const companyOverviewRoutes = require("./routes/companyOverviewRoutes");
const combinedReportRoutes = require("./routes/combinedReportRoutes");
const earningCallRoutes = require("./routes/earningCallRoutes");
const currentCapitalizationRoutes = require("./routes/currentCapitalizationRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/profile", profileRoutes);
app.use("/api/combined-report", combinedReportRoutes);
app.use("/api/historical", historicalRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/news", newsRoutes);   
app.use("/api/financial", financialRoutes);
app.use("/api/valuation", valuationRoutes);
app.use("/api/press-release", pressReleaseRoutes);
app.use("/api/historical-eod", historicalEodRoutes);
app.use("/api/company-overview", companyOverviewRoutes);
app.use("/api/earning-call-transcript", earningCallRoutes);
app.use("/api/capitalization", currentCapitalizationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
