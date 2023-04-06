import { BigNumber } from "ethers";

import {bigNumberify} from "./numbers";

export const LONG = "Long";
export const SHORT = "Short";

export function deserialize(data: any) {
  for (const [key, value] of Object.entries(data) as any) {
    if (value._type === "BigNumber") {
      data[key] = bigNumberify(value.value);
    }
  }
  return data;
}

export const CHART_PERIODS = {
  "1s": 1,
  "1m": 60,
  "3m": 60 * 3,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "30m": 60 * 30,
  "1h": 60 * 60,
  "2h": 60 * 60 * 2,
  "4h": 60 * 60 * 4,
  "6h": 60 * 60 * 6,
  "8h": 60 * 60 * 8,
  "12h": 60 * 60 * 12,
  "1d": 60 * 60 * 24,
  "3d": 60 * 60 * 24 * 3,
};