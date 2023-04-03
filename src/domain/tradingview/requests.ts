import { getChartPricesFromStats, timezoneOffset } from "../prices";

function getCurrentBarTimestamp(periodSeconds: number) {
  return Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000);
}

export const getTokenChartPrice = async (symbol: string, period: string) => {
  let prices;
  try {
    prices = await getChartPricesFromStats(symbol, period, 500);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.warn(ex, "Switching to graph chainlink data");
  }
  return prices;
};

// get current price of token, by chainId and symbol
// return price in 18 decimals
export async function getCurrentPriceOfToken(symbol: string) {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await res.json();
    return data.value;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    try {
      const res = await fetch(`https://api.nestfi.net/api/oracle/price/${symbol.toLowerCase()}usdt`);
      const data = await res.json();
      return data.value;
    } catch (e) {
      console.log(e)
    }
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
