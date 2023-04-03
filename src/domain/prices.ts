export const timezoneOffset = -new Date().getTimezoneOffset() * 60;

export async function getChartPricesFromStats(symbol: string, period: string, limit: number) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&limit=${limit}&interval=${period}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const prices = await response.json();
    return prices.map((price: any) => {
      return {
        time: price[0] / 1000 + timezoneOffset,
        open: Number(price[1]),
        close: Number(price[4]),
        high: Number(price[2]),
        low: Number(price[3]),
      }
    });
  } catch (error) {
    const url = `https://api.nestfi.net/api/oracle/price/klines?symbol=${symbol}USDT&limit=${limit}&interval=${period}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const prices = await response.json();
      return prices.map((price: any) => {
        return {
          time: price[0] / 1000 + timezoneOffset,
          open: Number(price[1]),
          close: Number(price[4]),
          high: Number(price[2]),
          low: Number(price[3]),
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error fetching data: ${e}`);
    }
  }
}