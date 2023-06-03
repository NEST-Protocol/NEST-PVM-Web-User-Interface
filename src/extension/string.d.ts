import { parseUnits } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { TokenList, TokenType } from "./../contracts/contractAddress";
/* eslint-disable no-extend-native */
declare global {
  interface String {
    placeHolder: string;
    zeroAddress: string;
    showAddress(num?: number): string;
    hashToChainScan(chainId: number | undefined): string;
    chainScan(chainId: number | undefined): string;
    getToken(): TokenType | undefined;
    getTokenPriceDecimals(): number;
    getTokenAddress(chainId: number | undefined): string | undefined;
    formatInputNum(): string;
    formatInputNum4(): string;
    stringToBigNumber(decimals: number | undefined): BigNumber | undefined;
  }
}

String.prototype.zeroAddress = "0x0000000000000000000000000000000000000000";
String.prototype.placeHolder = "-";

String.prototype.showAddress = function (num?: number) {
  const number = num ? num : 4;
  return (
    this.substring(0, 2 + number ?? 4) +
    "...." +
    this.substring(this.length - number, this.length)
  );
};

String.prototype.chainScan = function (chainId: number | undefined) {
  if (chainId === 1) {
    return "etherscan";
  } else if (chainId === 5) {
    return `goerli.etherscan`;
  } else if (chainId === 56) {
    return `bscscan`;
  } else if (chainId === 97) {
    return `testnet.bscscan`;
  } else {
    return "";
  }
};

String.prototype.hashToChainScan = function (chainId: number | undefined) {
  if (chainId === 1) {
    return `https://etherscan.io/tx/${this}`;
  } else if (chainId === 5) {
    return `https://goerli.etherscan.io/tx/${this}`;
  } else if (chainId === 56) {
    return `https://bscscan.com/tx/${this}`;
  } else if (chainId === 97) {
    return `https://testnet.bscscan.com/tx/${this}`;
  } else if (chainId === 534353) {
    return `https://blockscout.scroll.io/tx/${this}`;
  } else {
    return "";
  }
};

String.prototype.getToken = function () {
  const dataArray = TokenList.filter((item) => item.symbol === this);
  return dataArray.length > 0 ? dataArray[0] : undefined;
};

String.prototype.getTokenPriceDecimals = function () {
  const dataArray = TokenList.filter((item) => item.symbol === this);
  if (dataArray.length > 0) {
    const token = dataArray[0];
    return token.priceDecimals;
  }
  return 2;
};

String.prototype.getTokenAddress = function (chainId: number | undefined) {
  const dataArray = TokenList.filter((item) => item.symbol === this);
  if (dataArray.length === 0 || !chainId) {
    return undefined;
  }
  return dataArray[0].address[chainId];
};

String.prototype.formatInputNum = function () {
  return this.replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(
      /^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,
      "$1$2.$3"
    )
    .replace(/^\./g, "");
};

String.prototype.formatInputNum4 = function () {
  return this.replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3")
    .replace(/^\./g, "");
};

String.prototype.stringToBigNumber = function (decimals: number | undefined) {
  if (decimals && this !== "") {
    return parseUnits(this, decimals);
  } else {
    return undefined;
  }
};

export {};
