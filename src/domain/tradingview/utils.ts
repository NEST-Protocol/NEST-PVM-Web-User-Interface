import { timezoneOffset } from "../prices";
import { CHART_PERIODS } from "../../lib/legacy";
import { Bar } from "./types";

export function getObjectKeyFromValue(value: any, object: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function formatTimeInBarToMs(bar: Bar) {
  return {
    ...bar,
    time: bar.time * 1000,
  };
}

export function getCurrentCandleTime(period: string) {
  // Converts current time to seconds, rounds down to nearest period, adds timezone offset, and converts back to milliseconds
  // @ts-ignore
  const periodSeconds = CHART_PERIODS[period];
  return Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds + timezoneOffset;
}
