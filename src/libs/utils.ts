import { BigNumber } from "ethers";

export type NumberBigNumberType = {
  [key: number]: BigNumber;
}
export type NumberNumberType = {
  [key: number]: number;
}
export type NumberStringType = {
  [key: number]: string;
}

export const PRICE_FEE: NumberBigNumberType = {
  1: normalToBigNumber("0"),
  4: normalToBigNumber("0"),
  56: normalToBigNumber("0"),
  97: normalToBigNumber("0.002"),
}
export const BLOCK_TIME: NumberNumberType = {
  1: 14000,
  4: 14000,
  56: 3000,
  97: 3000,
}
export const WIN_GET_STRING: NumberStringType = {
  1: 'prcEth',
  4: 'prcRinkeby',
  56: 'prc',
  97: 'prcTest',
}
export const WINV2_GET_STRING: NumberStringType = {
  1: 'prcEth',
  4: 'prcRinkeby',
  56: 'prc',
  97: 'prcTest',
}
export const WIN_TOAST_WAIT: NumberNumberType = {
  1: 20000,
  4: 20000,
  56: 10000,
  97: 10000,
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BASE_AMOUNT = BigNumber.from('1000000000000000000');
export const BASE_2000ETH_AMOUNT = BigNumber.from('2000000000000000000000');

/**
 * BigNumber->float
 * @param num BigNumber
 * @param decimals usdt=6, other=18
 * @param fix save num
 * @returns float string
 */
export function bigNumberToNormal(
  num: BigNumber,
  decimals: number = 18,
  fix: number = 18
): string {
  const str = num.toString();
  const strLength = str.length;
  var newStr: string;
  if (strLength > decimals) {
    newStr =
      str.substr(0, strLength - decimals) +
      "." +
      str.substr(strLength - decimals, strLength);
  } else {
    var baseStr: string = "";
    for (var i = 0; i < decimals - strLength; i++) {
      baseStr += "0";
    }
    newStr = "0." + baseStr + str;
  }
  // /0
  var resultBaseStr = newStr;
  if (resultBaseStr.indexOf(".") !== -1) {
    const resultBaseStrArray = resultBaseStr.split(".");
    resultBaseStr =
      resultBaseStrArray[0] + "." + resultBaseStrArray[1].substr(0, fix);
  }
  if (fix <= 6 || fix === 10) {
    while (resultBaseStr[resultBaseStr.length-1] === '0') {
      resultBaseStr = resultBaseStr.substr(0, resultBaseStr.length-1)
      if (resultBaseStr[resultBaseStr.length-1] === '.') {
        resultBaseStr = resultBaseStr.substr(0, resultBaseStr.length-1)
        break
      }
    }
  }
  return resultBaseStr;
}

/**
 * string -> BigNumber
 * @param num num string
 * @param decimals usdt=6, other=18
 * @returns BigNumber
 */
export function normalToBigNumber(
  num: string,
  decimals: number = 18
): BigNumber {
  const pointNum = num.indexOf(".");
  var baseStr: string = "";
  var i = 0;
  if (pointNum !== -1) {
    const strArray = num.split(".");
    if (strArray[1].length > 18) {
      throw Error("normalToBigNumber:more decimals");
    }
    for (i; i < decimals - strArray[1].length; i++) {
      baseStr += "0";
    }
    return BigNumber.from(strArray[0] + strArray[1] + baseStr);
  } else {
    for (i; i < decimals; i++) {
      baseStr += "0";
    }
    return BigNumber.from(num + baseStr);
  }
}

export function getBaseBigNumber(num: number): BigNumber {
  var numStr = "1";
  for (var i = 0; i < num; i++) {
    numStr += "0";
  }
  return BigNumber.from(numStr);
}

/**
 * gasLimit add
 * @param value gaslImit
 * @returns gaslImit + 10%
 */
export function addGasLimit(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 1000)).div(BigNumber.from(10000));
}

/**
 * address string
 * @param address address
 * @returns .... string
 */
export function showEllipsisAddress(address: string): string {
  return address.substring(0, 8) + "...." + address.substring(address.length - 6, address.length);
}
export function showEllipsisAddress2(address: string): string {
  return address.substring(0, 6) + "...." + address.substring(address.length - 4, address.length);
}
export function showEllipsisAddress3(address: string): string {
  return address.substring(0, 4) + "...." + address.substring(address.length - 2, address.length);
}

export function checkWidth():boolean {
  const width = window.innerWidth;
  const breakpoint = 1000;
  return width < breakpoint ? false : true
}

export function formatInputNum(value: string): string {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(
      // eslint-disable-next-line no-useless-escape
      /^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,
      "$1$2.$3"
    )
    .replace(/^\./g, "");
}

export function formatPVMWinInputNum(value: string): string {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(
      // eslint-disable-next-line no-useless-escape
      /^(\-)*(\d+)\.(\d\d).*$/,
      "$1$2.$3"
    )
    .replace(/^\./g, "");
}

export function forMoney(value: string) {
  // eslint-disable-next-line no-useless-escape
  value = parseFloat((value + "").replace(/[^\d\.-]/g, "")) + "";
  var l = value.split(".")[0].split("").reverse(),
    r = value.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}
