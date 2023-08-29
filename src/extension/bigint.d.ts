import { BigNumber } from "ethers/lib/ethers";

declare global {
  interface BigInt {
    toBigNumber(): BigNumber;
  }
}

BigInt.prototype.toBigNumber = function () {
  return BigNumber.from(this.toString());
};

export {};
