import { BigNumber } from "ethers";
import { useMemo, useState } from "react";

import { FuturesPrice } from "../pages/Futures/Futures";
import { lipPrice } from "./useFuturesNewOrder";

import { Order } from "../pages/Dashboard/Dashboard";
import { t } from "@lingui/macro";
import { FuturesOrderService } from "../pages/Futures/OrderList";

function useFuturesPOrder(
  data: FuturesOrderService,
  price: FuturesPrice | undefined
) {
  const tokenName = data.product.split("/")[0];
  const isLong = data.direction;
  const lever = data.leverage;
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  const showBasePrice = data.orderPrice.toFixed(
    tokenName.getTokenPriceDecimals()
  );
  const showTriggerTitle = useMemo(() => {
    const isEdit = data.takeProfitPrice === 0 && data.stopLossPrice === 0;
    return !isEdit ? t`Edit` : t`Trigger`;
  }, [data.stopLossPrice, data.takeProfitPrice]);
  const tp = useMemo(() => {
    return data.takeProfitPrice === 0
      ? String().placeHolder
      : data.takeProfitPrice.toFixed(tokenName.getTokenPriceDecimals());
  }, [data.takeProfitPrice, tokenName]);
  const sl = useMemo(() => {
    return data.stopLossPrice === 0
      ? String().placeHolder
      : data.stopLossPrice.toFixed(tokenName.getTokenPriceDecimals());
  }, [data.stopLossPrice, tokenName]);
  const showLiqPrice = useMemo(() => {
    if (price) {
      const balance =
        data.margin.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const orderPrice =
        data.orderPrice.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const append =
        data.append.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const result = lipPrice(
        balance,
        append,
        BigNumber.from(data.leverage.toString()),
        price[tokenName],
        orderPrice,
        data.direction
      );
      return result.bigNumberToShowPrice(18, tokenName.getTokenPriceDecimals());
    } else {
      return String().placeHolder;
    }
  }, [
    data.margin,
    data.direction,
    data.leverage,
    data.orderPrice,
    data.append,
    price,
    tokenName,
  ]);
  const showMarginAssets = useMemo(() => {
    return data.balance.toFixed(2);
  }, [data.balance]);

  const showPercentNum = useMemo(() => {
    const balance_num = data.margin + data.append;
    const marginAssets_num = data.balance;
    if (marginAssets_num >= balance_num) {
      return parseFloat(
        (((marginAssets_num - balance_num) * 100) / balance_num).toFixed(2)
      );
    } else {
      return -parseFloat(
        (((balance_num - marginAssets_num) * 100) / balance_num).toFixed(2)
      );
    }
  }, [data.append, data.balance, data.margin]);
  const showPercent = useMemo(() => {
    if (showPercentNum > 0) {
      return `+${showPercentNum}`;
    } else if (showPercentNum < 0) {
      return `${showPercentNum}`;
    } else {
      return "0";
    }
  }, [showPercentNum]);
  const isRed = useMemo(() => {
    return showPercent.indexOf("-") === 0;
  }, [showPercent]);
  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.walletAddress.toString(),
      leverage: `${data.leverage.toString()}X`,
      orientation: data.direction ? `Long` : `Short`,
      actualRate: showPercentNum,
      index: parseInt(data.id.toString()),
      openPrice: parseFloat(
        data.orderPrice.toFixed(tokenName.getTokenPriceDecimals())
      ),
      tokenPair: `${tokenName}/USDT`,
      actualMargin: parseFloat(data.balance.toFixed(2)),
      initialMargin: parseFloat(data.balance.toFixed(2)),
      lastPrice: parseFloat(
        price
          ? price[tokenName].bigNumberToShowPrice(
              18,
              tokenName.getTokenPriceDecimals()
            )
          : "0"
      ),
      sp: parseFloat(tp === String().placeHolder ? "0" : tp),
      sl: parseFloat(sl === String().placeHolder ? "0" : sl),
    };
    return info;
  }, [
    data.balance,
    data.direction,
    data.id,
    data.leverage,
    data.orderPrice,
    data.walletAddress,
    price,
    showPercentNum,
    sl,
    tokenName,
    tp,
  ]);
  return {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    showTriggerTitle,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  };
}

export default useFuturesPOrder;
