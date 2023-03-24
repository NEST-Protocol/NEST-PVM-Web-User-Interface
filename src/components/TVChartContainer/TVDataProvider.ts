import {BigNumber, BigNumberish, ethers} from "ethers";
import { LibrarySymbolInfo, PeriodParams, Bar as BarType } from "../../charting_library"
import {formatTimeInBarToMs, SUPPORTED_RESOLUTIONS} from "../../hooks/useTVDatafeed";
import {CHART_PERIODS} from "./TVChartContainer";
import {limitDecimals, numberWithCommas, padDecimals} from "../../lib/numbers";

export const LAST_BAR_REFRESH_INTERVAL = 15000; // 15 seconds

export type Bar = BarType & {
  ticker?: string;
};

export const USD_DECIMALS = 30;

function getCurrentBarTimestamp(periodSeconds: number) {
  return Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000);
}


export const formatAmount = (
  amount: BigNumberish | undefined,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas?: boolean,
  defaultValue?: string
) => {
  if (!defaultValue) {
    defaultValue = "...";
  }
  if (amount === undefined || amount.toString().length === 0) {
    return defaultValue;
  }
  if (displayDecimals === undefined) {
    displayDecimals = 4;
  }
  let amountStr = ethers.utils.formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
};

export const timezoneOffset = -new Date().getTimezoneOffset() * 60;

export function getCurrentCandleTime(period: string) {
  // Converts current time to seconds, rounds down to nearest period, adds timezone offset, and converts back to milliseconds
  // @ts-ignore
  const periodSeconds = CHART_PERIODS[period];
  return Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds + timezoneOffset;
}

export function getStablePriceData(period: any, countBack = 100) {
  // @ts-ignore
  const periodSeconds = CHART_PERIODS[period];
  const now = Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds;
  let priceData: any = [];
  for (let i = countBack; i > 0; i--) {
    priceData.push({
      time: now - i * periodSeconds,
      open: 1,
      close: 1,
      high: 1,
      low: 1,
    });
  }
  return priceData;
}

export function fillBarGaps(prices: any, periodSeconds: any) {
  if (prices.length < 2) return prices;

  const currentBarTimestamp = getCurrentBarTimestamp(periodSeconds) / 1000 + timezoneOffset;
  let lastBar = prices[prices.length - 1];

  if (lastBar.time !== currentBarTimestamp) {
    prices.push({
      ...lastBar,
      time: currentBarTimestamp,
    });
  }

  const newPrices = [prices[0]];
  let prevTime = prices[0].time;

  for (let i = 1; i < prices.length; i++) {
    const { time, open } = prices[i];
    if (prevTime) {
      const numBarsToFill = Math.floor((time - prevTime) / periodSeconds) - 1;
      for (let j = numBarsToFill; j > 0; j--) {
        const newBar = {
          time: time - j * periodSeconds,
          open,
          close: open,
          high: open * 1.0003,
          low: open * 0.9996,
        };
        newPrices.push(newBar);
      }
    }
    prevTime = time;
    newPrices.push(prices[i]);
  }

  return newPrices;
}

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

  async getCurrentPriceOfToken(chainId: number, ticker: string): Promise<BigNumberish> {
    return getCurrentPriceOfToken(chainId, ticker);
  }

  async getTokenLastBars(chainId: number, ticker: string, period: string, limit: number): Promise<Bar[]> {
    // const url = `${GMX_STATS_API_URL}/candles/${symbol}?preferableChainId=${chainId}&period=${period}&limit=${limit}`;
    return getLimitChartPricesFromStats(chainId, ticker, period, limit);
  }
  async getTokenChartPrice(chainId: number, ticker: string, period: string): Promise<Bar[]> {
    return getTokenChartPrice(chainId, ticker, period);
  }

  async getTokenHistoryBars(
    chainId: number,
    ticker: string,
    period: string,
    periodParams: PeriodParams,
    shouldRefetchBars: boolean
  ): Promise<Bar[]> {
    const barsInfo = this.barsInfo;
    if (!barsInfo.data.length || barsInfo.ticker !== ticker || barsInfo.period !== period || shouldRefetchBars) {
      try {
        const bars = await this.getTokenChartPrice(chainId, ticker, period);
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
    chainId: number,
    ticker: string,
    resolution: string,
    isStable: boolean,
    periodParams: PeriodParams,
    shouldRefetchBars: boolean
  ) {
    // @ts-ignore
    const period = SUPPORTED_RESOLUTIONS[resolution];
    const { countBack } = periodParams;

    try {
      const bars = isStable
        ? getStablePriceData(period, countBack)
        : await this.getTokenHistoryBars(chainId, ticker, period, periodParams, shouldRefetchBars);

      return bars.map(formatTimeInBarToMs);
    } catch {
      throw new Error("Failed to get history bars");
    }
  }

  async getLastBar(chainId: number, ticker: string, period: string) {
    if (!ticker || !period || !chainId) {
      throw new Error("Invalid input. Ticker, period, and chainId are required parameters.");
    }
    const currentTime = Date.now();
    if (
      currentTime - this.startTime > LAST_BAR_REFRESH_INTERVAL ||
      this.lastTicker !== ticker ||
      this.lastPeriod !== period
    ) {
      const prices = await this.getTokenLastBars(chainId, ticker, period, 1);
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

  async getLiveBar(chainId: number, ticker: string, resolution: string) {
    // @ts-ignore
    const period = SUPPORTED_RESOLUTIONS[resolution];
    if (!ticker || !period || !chainId) return;

    const currentCandleTime = getCurrentCandleTime(period);
    try {
      this.lastBar = await this.getLastBar(chainId, ticker, period);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (!this.lastBar) return;

    const currentPrice = await this.getCurrentPriceOfToken(chainId, ticker);
    const averagePriceValue = parseFloat(formatAmount(currentPrice, USD_DECIMALS, 4));
    if (this.lastBar.time && currentCandleTime === this.lastBar.time && ticker === this.lastBar.ticker) {
      return {
        ...this.lastBar,
        close: averagePriceValue,
        high: Math.max(this.lastBar.open, this.lastBar.high, averagePriceValue),
        low: Math.min(this.lastBar.open, this.lastBar.low, averagePriceValue),
        ticker,
      };
    } else {
      const newBar = {
        time: currentCandleTime,
        open: this.lastBar.close,
        close: averagePriceValue,
        high: Math.max(this.lastBar.close, averagePriceValue),
        low: Math.min(this.lastBar.close, averagePriceValue),
        ticker,
      };
      this.lastBar = newBar;
      return this.lastBar;
    }
  }

}

export async function getCurrentPriceOfToken(chainId: number, symbol: string) {
  try {
    // TODO request and return a price, by chainId and symbol
    return BigNumber.from('29999999900000000000000000000000000')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  return BigNumber.from(0);
}

export async function getLimitChartPricesFromStats(chainId: number, ticker: string, period: string, limit: number) {
  // https://stats.gmx.io/api/candles/${symbol}?preferableChainId=${chainId}&period=${period}&limit=${limit}
  return [];
}

export async function getTokenChartPrice(chainId: number, ticker: string, period: string) {
  // https://stats.gmx.io/api/candles/${symbol}?preferableChainId=${chainId}&period=${period}
  return [];
}