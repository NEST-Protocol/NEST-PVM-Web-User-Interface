import { getServerUrl } from "../../config/backend";
import { getTokenBySymbol, getWrappedToken } from "../../config/tokens";
import { getChartPricesFromStats, timezoneOffset } from "../prices";

function getCurrentBarTimestamp(periodSeconds: number) {
  return Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000);
}

export const getTokenChartPrice = async (chainId: number, symbol: string, period: string) => {
  let prices;
  try {
    prices = await getChartPricesFromStats(chainId, symbol, period);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.warn(ex, "Switching to graph chainlink data");
  }
  return prices;
};

export async function getCurrentPriceOfToken(chainId: number, symbol: string) {
  try {
    const indexPricesUrl = getServerUrl(chainId, "/prices");
    const response = await fetch(indexPricesUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const indexPrices = await response.json();
    let symbolInfo = getTokenBySymbol(chainId, symbol);
    if (symbolInfo.isNative) {
      symbolInfo = getWrappedToken(chainId);
    }
    return indexPrices[symbolInfo.address];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
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
