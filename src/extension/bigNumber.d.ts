import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";

/* eslint-disable no-extend-native */
declare module "ethers" {
  interface BigNumber {
    bigNumberToShowString(decimals: number, scale?: number): string;
    bigNumberToShowPrice(decimals: number, scale?: number): string;
    toBigInt(): bigint;
  }
}

BigNumber.prototype.bigNumberToShowString = function (
  decimals: number,
  scale?: number
) {
  const number = scale ? scale : 2;
  const result = parseFloat(formatUnits(this, decimals)).floor(number);
  return parseFloat(result).toString();
};

BigNumber.prototype.bigNumberToShowPrice = function (
  decimals: number,
  scale?: number
) {
  const number = scale ? scale : 2;
  return parseFloat(formatUnits(this, decimals)).floor(number);
};

BigNumber.prototype.toBigInt = function () {
  return BigInt(this.toString());
};
