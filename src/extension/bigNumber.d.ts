import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";

/* eslint-disable no-extend-native */
declare module "ethers" {
  interface BigNumber {
    bigNumberToShowString(decimals: number, scale?: number): string;
  }
}

BigNumber.prototype.bigNumberToShowString = function (
  decimals: number,
  scale?: number
) {
  const number = scale ? scale : 2;
  const result = parseFloat(formatUnits(this, decimals)).toFixed(number);
  return parseFloat(result).toString();
};
