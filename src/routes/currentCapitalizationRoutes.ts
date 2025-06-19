import { Router } from "express";
const getCapitalizationData = require("../controllers/currentCapitalizationController");

const router = Router();

router.get("/", getCapitalizationData);

export default router;
