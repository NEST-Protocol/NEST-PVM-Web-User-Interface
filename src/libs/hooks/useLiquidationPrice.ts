import { BigNumber } from "ethers/lib/ethers";
import { parseUnits } from "ethers/lib/utils";
import { BLOCK_TIME } from "../utils";

const useLiquidationPrice = (
  baseBalance: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  basePrice: BigNumber,
  chainId?: number
) => {
  if (!chainId || baseBalance.lt(parseUnits("50.0", "ether"))) {
    return BigNumber.from("0");
  }
  const minValue = baseBalance.mul(lever).div(50);
  const MIN_VALUE = parseUnits("10.0", "ether");
  const minBalance = minValue.lt(MIN_VALUE) ? MIN_VALUE : minValue;

  const expMiuT = (miu: BigNumber, chainId: number) => {
    return miu
      .mul(10)
      .mul(BLOCK_TIME[chainId] / 1000)
      .div(1000)
      .add(BigNumber.from("18446744073709552000"));
  };
  // left - right = minBalance
  var oraclePrice: BigNumber;
  var left: BigNumber;
  var right: BigNumber;
  if (orientation) {
    right = baseBalance.mul(lever);
    left = right.add(minBalance);
    oraclePrice = left
      .sub(baseBalance)
      .mul(basePrice)
      .mul(expMiuT(BigNumber.from("64051194700"), chainId))
      .div(baseBalance)
      .div(lever.mul(BigNumber.from("2").pow(64)));
    console.log(1 << 64);
  } else {
    left = baseBalance.mul(lever.add(BigNumber.from("1")));
    right = left.sub(minBalance);
    oraclePrice = right
      .mul(basePrice)
      .mul(expMiuT(BigNumber.from("0"), chainId))
      .div(baseBalance)
      .div(lever.mul(BigNumber.from("2").pow(64)));
  }
  return oraclePrice;
};

export default useLiquidationPrice;
