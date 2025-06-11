const express = require("express");
const { getFinancialData } = require("../controllers/financialController");

const router = express.Router();

router.get("/", getFinancialData);

module.exports = router;
