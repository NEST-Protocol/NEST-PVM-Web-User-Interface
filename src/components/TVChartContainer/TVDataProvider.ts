import {Bar as BarType, PeriodParams} from "../../charting_library"
import {formatTimeInBarToMs, SUPPORTED_RESOLUTIONS} from "../../hooks/useTVDatafeed";
import {CHART_PERIODS} from "./TVChartContainer";
import {formatAmount} from "../../lib/numbers";
import {BigNumberish} from "ethers";

export type Bar = BarType & {
  ticker?: string;
};

const initialHistoryBarsInfo = {
  period: "",
  data: [],
  ticker: "",
};

export function fillBarGaps(prices: any[], periodSeconds: number) {
  if (prices.length < 2) return prices;
  let currentBarTimestamp = Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000);
  currentBarTimestamp = currentBarTimestamp / 1000 + timezoneOffset;
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
    const {time, open} = prices[i];
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

export const timezoneOffset = -new Date().getTimezoneOffset() * 60;

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
    try {
      const bars = await this.getTokenHistoryBars(chainId, ticker, period, periodParams, shouldRefetchBars);
      return bars.map(formatTimeInBarToMs);
    } catch {
      throw new Error("Failed to get history bars");
    }
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
          this.lastBar = {...lastBar, ticker};
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

    const {from, to, countBack} = periodParams;
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

  async getTokenChartPrice(chainId: number, ticker: string, period: string): Promise<Bar[]> {
    let prices;
    try {
      prices = await getChartPricesFromStats(chainId, ticker, period);
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.warn(ex, "Switching to other source");
    }
    return prices;
  }

  async getTokenLastBars(chainId: number, ticker: string, period: string, limit: number): Promise<Bar[]> {
    return getLimitChartPricesFromStats(chainId, ticker, period, limit);
  }

  async getLastBar(chainId: number, ticker: string, period: string) {
    if (!ticker || !period || !chainId) {
      throw new Error("Invalid input. Ticker, period, and chainId are required parameters.");
    }
    const currentTime = Date.now();
    if (
      currentTime - this.startTime > 15000 ||
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

  async getCurrentPriceOfToken(chainId: number, ticker: string): Promise<BigNumberish> {
    return getCurrentPriceOfToken(chainId, ticker);
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
    const averagePriceValue = parseFloat(formatAmount(currentPrice, 30, 4));
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

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function getCurrentCandleTime(period: string) {
  // Converts current time to seconds, rounds down to nearest period, adds timezone offset, and converts back to milliseconds
  // @ts-ignore
  const periodSeconds = CHART_PERIODS[period];
  return Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds + timezoneOffset;
}

export async function getChartPricesFromStats(chainId: number, symbol: string, period: string) {
  // @ts-ignore
  const timeDiff = CHART_PERIODS[period] * 3000;
  const from = Math.floor(Date.now() / 1000 - timeDiff);
  // TODO, chainId
  const url = `https://stats.gmx.io/api/candles/${symbol}?preferableChainId=42161&period=${period}&from=${from}&preferableSource=fast`;
  const TIMEOUT = 5000;
  const res: Response = await new Promise(async (resolve, reject) => {
    let done = false;
    setTimeout(() => {
      done = true;
      reject(new Error(`request timeout ${url}`));
    }, TIMEOUT);

    let lastEx;
    for (let i = 0; i < 3; i++) {
      if (done) return;
      try {
        const res = await fetch(url);
        resolve(res);
        return;
      } catch (ex) {
        await sleep(300);
        lastEx = ex;
      }
    }
    reject(lastEx);
  });
  if (!res.ok) {
    throw new Error(`request failed ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  let prices = json?.prices;
  if (!prices || prices.length < 1) {
    throw new Error(`not enough prices data: ${prices?.length}`);
  }

  const OBSOLETE_THRESHOLD = Date.now() / 1000 - 60 * 30; // 30 min ago
  const updatedAt = json?.updatedAt || 0;
  if (updatedAt < OBSOLETE_THRESHOLD) {
    throw new Error(
      "chart data is obsolete, last price record at " +
      new Date(updatedAt * 1000).toISOString() +
      " now: " +
      new Date().toISOString()
    );
  }

  prices = prices.map(formatBarInfo);
  return prices;
}

export async function getLimitChartPricesFromStats(chainId: number, symbol: string, period: string, limit = 1) {
  const url = `https://stats.gmx.io/api/candles/${symbol}?preferableChainId=42161&period=${period}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const prices = await response.json().then(({ prices }) => prices);
    return prices.map(formatBarInfo);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error fetching data: ${error}`);
  }
}

function formatBarInfo(bar: any) {
  const { t, o: open, c: close, h: high, l: low } = bar;
  return {
    time: t + timezoneOffset,
    open,
    close,
    high,
    low,
  };
}

export async function getCurrentPriceOfToken(chainId: number, symbol: string) {
  return "1000"
}