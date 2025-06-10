const express = require("express");
const { getStockNews } = require("../controllers/newsController");

const router = express.Router();

router.get("/", getStockNews);

module.exports = router;
