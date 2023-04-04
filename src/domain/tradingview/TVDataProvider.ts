import {SUPPORTED_RESOLUTIONS} from "../../config/tradingview";
import {getChartPricesFromBinance, timezoneOffset} from "../prices";
import {CHART_PERIODS} from "../../lib/legacy";
import {Bar} from "./types";
import {formatTimeInBarToMs, getCurrentCandleTime} from "./utils";
import {fillBarGaps} from "./requests";
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

  async getTokenHistoryBars(
    ticker: string,
    period: string,
    periodParams: PeriodParams,
    shouldRefetchBars: boolean
  ): Promise<Bar[]> {
    const barsInfo = this.barsInfo;
    if (!barsInfo.data.length || barsInfo.ticker !== ticker || barsInfo.period !== period || shouldRefetchBars) {
      try {
        const bars = await getChartPricesFromBinance(ticker, period, 500);
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

  async getLiveBar(ticker: string, resolution: string) {
    // @ts-ignore
    const period = SUPPORTED_RESOLUTIONS[resolution];
    const bars = await getChartPricesFromBinance(ticker, period, 1);
    // @ts-ignore
    const filledBars = fillBarGaps(bars, CHART_PERIODS[resolution]);
    return filledBars.map(formatTimeInBarToMs);
  }
}
