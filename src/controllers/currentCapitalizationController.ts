import { Request, Response } from "express";
const {
  CurrentCapitalizationService,
} = require("../services/currentCapitalizationService");

const capService = new CurrentCapitalizationService(
  process.env.ORBE_DATABASE_URL || ""
);

export const getCapitalizationData = async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;
    const start_year = req.query.start_year
      ? Number(req.query.start_year)
      : 2024;
    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }
    const data = await capService.fetchCapitalizationData(symbol, start_year);

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching capitalization data:", error.message);
    res.status(500).json({ error: "Failed to fetch capitalization data" });
  }
};
