import {LAST_BAR_REFRESH_INTERVAL, SUPPORTED_RESOLUTIONS} from "../../config/tradingview";
import {getChartPricesFromStats, timezoneOffset} from "../prices";
import {CHART_PERIODS} from "../../lib/legacy";
import {Bar} from "./types";
import {formatTimeInBarToMs, getCurrentCandleTime} from "./utils";
import {fillBarGaps, getCurrentPriceOfToken, getTokenChartPrice} from "./requests";
import {PeriodParams} from "../../charting_library";

const initialHistoryBarsInfo = {
  period: "",
  data: [],
  ticker: "",
};

export class TVDataProvider {
  lastBar: Bar | null;
  startTime: number;
  lastTicker: string;
  lastPeriod: string;
  barsInfo: {
    period: string;
    data: Bar[];
    ticker: string;
  };

  constructor() {
    this.lastBar = null;
    this.startTime = 0;
    this.lastTicker = "";
    this.lastPeriod = "";
    this.barsInfo = initialHistoryBarsInfo;
  }

  async getCurrentPriceOfToken(ticker: string): Promise<number> {
    // @ts-ignore
    return getCurrentPriceOfToken(ticker);
  }

  async getTokenLastBars(ticker: string, period: string, limit: number): Promise<Bar[]> {
    return getChartPricesFromStats(ticker, period, limit);
  }
  async getTokenChartPrice(ticker: string, period: string): Promise<Bar[]> {
    return getTokenChartPrice(ticker, period);
  }

  async getTokenHistoryBars(
    ticker: string,
    period: string,
    periodParams: PeriodParams,
    shouldRefetchBars: boolean
  ): Promise<Bar[]> {
    const barsInfo = this.barsInfo;
    if (!barsInfo.data.length || barsInfo.ticker !== ticker || barsInfo.period !== period || shouldRefetchBars) {
      try {
        const bars = await this.getTokenChartPrice(ticker, period);
        // @ts-ignore
        const filledBars = fillBarGaps(bars, CHART_PERIODS[period]);
        const currentCandleTime = getCurrentCandleTime(period);
        // @ts-ignore
        const lastCandleTime = currentCandleTime - CHART_PERIODS[period];
        const lastBar = filledBars[filledBars.length - 1];
        if (lastBar.time === currentCandleTime || lastBar.time === lastCandleTime) {
          this.lastBar = { ...lastBar, ticker };
        }
        this.barsInfo.data = filledBars;
        this.barsInfo.ticker = ticker;
        this.barsInfo.period = period;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.barsInfo = initialHistoryBarsInfo;
      }
    }

    const { from, to, countBack } = periodParams;
    const toWithOffset = to + timezoneOffset;
    const fromWithOffset = from + timezoneOffset;
    const bars = barsInfo.data.filter((bar) => bar.time > fromWithOffset && bar.time <= toWithOffset);

    // if no bars returned, return empty array
    if (!bars.length) {
      return [];
    }

    // if bars are fewer than countBack, return all of them
    if (bars.length < countBack) {
      return bars;
    }

    // if bars are more than countBack, return latest bars
    return bars.slice(bars.length - countBack, bars.length);
  }

  async getBars(
    ticker: string,
    resolution: string,
    periodParams: PeriodParams,
    shouldRefetchBars: boolean
  ) {
    // @ts-ignore
    const period = SUPPORTED_RESOLUTIONS[resolution];

    try {
      const bars = await this.getTokenHistoryBars(ticker, period, periodParams, shouldRefetchBars);

      return bars.map(formatTimeInBarToMs);
    } catch {
      throw new Error("Failed to get history bars");
    }
  }

  async getLastBar(ticker: string, period: string) {
    if (!ticker || !period) {
      throw new Error("Invalid input. Ticker, period, and chainId are required parameters.");
    }
    const currentTime = Date.now();
    if (
      currentTime - this.startTime > LAST_BAR_REFRESH_INTERVAL ||
      this.lastTicker !== ticker ||
      this.lastPeriod !== period
    ) {
      const prices = await this.getTokenLastBars(ticker, period, 1);
      if (prices?.length) {
        // @ts-ignore
        const lastBar = prices[0];
        const currentCandleTime = getCurrentCandleTime(period);
        // @ts-ignore
        const lastCandleTime = currentCandleTime - CHART_PERIODS[period];
        if (lastBar.time === currentCandleTime || lastBar.time === lastCandleTime) {
          this.lastBar = { ...lastBar, ticker };
          this.startTime = currentTime;
          this.lastTicker = ticker;
          this.lastPeriod = period;
        }
      }
    }
    return this.lastBar;
  }

  async getLiveBar(ticker: string, resolution: string) {
    // @ts-ignore
    const period = SUPPORTED_RESOLUTIONS[resolution];
    if (!ticker || !period) return;

    const currentCandleTime = getCurrentCandleTime(period);
    try {
      this.lastBar = await this.getLastBar(ticker, period);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (!this.lastBar) return;

    const currentPriceOfToken = await this.getCurrentPriceOfToken(ticker);
    if (ticker !== this.lastBar.ticker) {
      return undefined
    }
    if (this.lastBar.time && currentCandleTime === this.lastBar.time) {
      return {
        ...this.lastBar,
        close: currentPriceOfToken,
        high: Math.max(this.lastBar.open, this.lastBar.high, currentPriceOfToken),
        low: Math.min(this.lastBar.open, this.lastBar.low, currentPriceOfToken),
        ticker,
      };
    } else {
      this.lastBar = {
        time: currentCandleTime,
        open: this.lastBar.close,
        close: currentPriceOfToken,
        high: Math.max(this.lastBar.close, currentPriceOfToken),
        low: Math.min(this.lastBar.close, currentPriceOfToken),
        ticker,
      };
      return this.lastBar;
    }
  }
}
