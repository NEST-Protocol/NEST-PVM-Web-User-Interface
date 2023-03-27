import {Bar as BarType, PeriodParams} from "../../charting_library"
import {SUPPORTED_RESOLUTIONS} from "../../hooks/useTVDatafeed";
import {CHART_PERIODS} from "./TVChartContainer";

export type Bar = BarType & {
  ticker?: string;
};

const initialHistoryBarsInfo = {
  period: "",
  data: [],
  ticker: "",
};

function getCurrentBarTimestamp(periodSeconds: number) {
  return Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000);
}

export function fillBarGaps(prices: any[], periodSeconds: number) {
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
      return bars.map((bar) => ({
          ...bar,
          time: bar.time * 1000,
        }));
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
        // @ts-ignore
        const periodSeconds = CHART_PERIODS[period];
        const currentCandleTime = Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds + timezoneOffset;
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
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
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

  prices = prices.map((bar: any) => {
    const { t, o: open, c: close, h: high, l: low } = bar;
    return {
      time: t + timezoneOffset,
      open,
      close,
      high,
      low,
    };
  });
  return prices;
}