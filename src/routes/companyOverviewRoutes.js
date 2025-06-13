const express = require("express");
const {
  getCompanyOverviewPoints,
} = require("../controllers/companyOverviewController");

const router = express.Router();

router.get("/", getCompanyOverviewPoints);

module.exports = router;
