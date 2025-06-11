const express = require("express");
const { getPressReleases } = require("../controllers/pressReleaseController");

const router = express.Router();

router.get("/", getPressReleases);

module.exports = router;
