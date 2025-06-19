import axios from "axios";
const API_KEY = process.env.API_KEY;


export class CurrentCapitalizationService {
  private ORBE_DATABASE_URL: string;

  constructor(orbeDatabaseUrl: string) {
    this.ORBE_DATABASE_URL = orbeDatabaseUrl;
  }

  async fetchCapitalizationData(symbol: string, start_year: number = 2024) {
    const url = `${this.ORBE_DATABASE_URL}/time-series/${symbol}?metrics=totalDebt,cashAndCashEquivalents,minorityInterest,weightedAverageShsOut,weightedAverageShsOutDil&start_year=${start_year}`;
    const response = await axios.get(url);
    return response.data;
  }
}
