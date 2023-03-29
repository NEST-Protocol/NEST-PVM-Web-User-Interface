import { BigNumber } from "ethers";

import {bigNumberify, expandDecimals} from "./numbers";

export const USD_DECIMALS = 30;
export const LONG = "Long";
export const SHORT = "Short";
export const PRECISION = expandDecimals(1, 30);

export function deserialize(data: any) {
  for (const [key, value] of Object.entries(data) as any) {
    if (value._type === "BigNumber") {
      data[key] = bigNumberify(value.value);
    }
  }
  return data;
}

export const CHART_PERIODS = {
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
};