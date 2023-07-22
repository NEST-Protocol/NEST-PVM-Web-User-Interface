import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { Order } from "../pages/Dashboard/Dashboard";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import { lipPrice } from "./useFuturesNewOrder";
import { FuturesOrderService } from "./useFuturesOrderList";
import { t } from "@lingui/macro";

function useFuturesPOrderClose(
  data: FuturesOrderService,
  price: FuturesPrice | undefined
) {
  // const tokenName = useMemo(() => {
  //   return data.product.split("/")[0];
  // }, [data.product]);
  // const isLong = data.direction;
  // const lever = parseInt(data.leverage.toString());
  // const [showShareOrderModal, setShowShareOrderModal] =
  //   useState<boolean>(false);

  // const marginAssets = useMemo(() => {
  //   return data.actualMargin.stringToBigNumber(18);
  // }, [data.actualMargin]);
  // const showBasePrice = BigNumber.from(
  //   data.basePrice.toString()
  // ).bigNumberToShowPrice(18, tokenName.getTokenPriceDecimals());
  // const tp = useMemo(() => {
  //   const tpNum = data.stopProfitPrice;
  //   return BigNumber.from("0").eq(tpNum)
  //     ? String().placeHolder
  //     : BigNumber.from(tpNum.toString()).bigNumberToShowPrice(
  //         18,
  //         tokenName.getTokenPriceDecimals()
  //       );
  // }, [data.stopProfitPrice, tokenName]);
  // const sl = useMemo(() => {
  //   const slNum = data.stopLossPrice;
  //   return BigNumber.from("0").eq(slNum)
  //     ? String().placeHolder
  //     : BigNumber.from(slNum.toString()).bigNumberToShowPrice(
  //         18,
  //         tokenName.getTokenPriceDecimals()
  //       );
  // }, [data.stopLossPrice, tokenName]);
  // const showLiqPrice = useMemo(() => {
  //   const result = lipPrice(
  //     data.balance,
  //     data.appends,
  //     data.lever,
  //     data.basePrice,
  //     data.basePrice,
  //     data.orientation
  //   );
  //   return result.bigNumberToShowPrice(18, tokenName.getTokenPriceDecimals());
  // }, [
  //   data.appends,
  //   data.balance,
  //   data.basePrice,
  //   data.lever,
  //   data.orientation,
  //   tokenName,
  // ]);
  // const showMarginAssets = useMemo(() => {
  //   if (marginAssets) {
  //     return BigNumber.from(marginAssets.toString()).bigNumberToShowString(
  //       18,
  //       2
  //     );
  //   } else {
  //     return String().placeHolder;
  //   }
  // }, [marginAssets]);
  // const showPercentNum = useMemo(() => {
  //   if (marginAssets) {
  //     const marginAssets_num = parseFloat(
  //       marginAssets.bigNumberToShowString(18, 2)
  //     );
  //     const balance_num = parseFloat(
  //       BigNumber.from(data.balance.toString())
  //         .add(data.appends)
  //         .bigNumberToShowString(4, 2)
  //     );
  //     if (marginAssets_num >= balance_num) {
  //       return parseFloat(
  //         (((marginAssets_num - balance_num) * 100) / balance_num).toFixed(2)
  //       );
  //     } else {
  //       return -parseFloat(
  //         (((balance_num - marginAssets_num) * 100) / balance_num).toFixed(2)
  //       );
  //     }
  //   } else {
  //     return 0;
  //   }
  // }, [data.appends, data.balance, marginAssets]);
  // const showPercent = useMemo(() => {
  //   if (showPercentNum > 0) {
  //     return `+${showPercentNum}`;
  //   } else if (showPercentNum < 0) {
  //     return `${showPercentNum}`;
  //   } else {
  //     return "0";
  //   }
  // }, [showPercentNum]);
  // const isRed = useMemo(() => {
  //   return showPercent.indexOf("-") === 0;
  // }, [showPercent]);
  // const showTitle = useMemo(() => {
  //   return data.baseBlock.toString() === "0"
  //     ? t`Liquidated`
  //     : t`Trigger executed`;
  // }, [data.baseBlock]);
  // const shareOrder = useMemo(() => {
  //   const info: Order = {
  //     owner: data.owner.toString(),
  //     leverage: `${data.lever.toString()}X`,
  //     orientation: data.orientation ? t`Long` : t`Short`,
  //     actualRate: showPercentNum,
  //     index: parseInt(data.index.toString()),
  //     openPrice: parseFloat(data.basePrice.bigNumberToShowPrice(18, tokenName.getTokenPriceDecimals())),
  //     tokenPair: `${tokenName}/USDT`,
  //     actualMargin: marginAssets
  //       ? parseFloat(marginAssets.bigNumberToShowString(18, 2))
  //       : 0,
  //     initialMargin: parseFloat(
  //       BigNumber.from(data.balance.toString()).bigNumberToShowString(4, 2)
  //     ),
  //     lastPrice: parseFloat(
  //       price ? price[tokenName].bigNumberToShowPrice(18, tokenName.getTokenPriceDecimals()) : "0"
  //     ),
  //     sp: parseFloat(tp === String().placeHolder ? "0" : tp),
  //     sl: parseFloat(sl === String().placeHolder ? "0" : sl),
  //   };
  //   return info;
  // }, [
  //   data.balance,
  //   data.basePrice,
  //   data.index,
  //   data.lever,
  //   data.orientation,
  //   data.owner,
  //   marginAssets,
  //   price,
  //   showPercentNum,
  //   sl,
  //   tokenName,
  //   tp,
  // ]);
  return {
    // tokenName,
    // isLong,
    // lever,
    // showBasePrice,
    // tp,
    // sl,
    // showLiqPrice,
    // showMarginAssets,
    // showPercent,
    // isRed,
    // showTitle,
    // showShareOrderModal,
    // setShowShareOrderModal,
    // shareOrder,
  };
}

export default useFuturesPOrderClose;
