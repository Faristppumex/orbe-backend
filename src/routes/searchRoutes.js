const express = require("express");
const { getSearchResults } = require("../controllers/searchController");

const router = express.Router();

router.get("/", getSearchResults);

module.exports = router;
