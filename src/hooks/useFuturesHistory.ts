
import { useMemo, useState } from "react";
import { Order } from "../pages/Dashboard/Dashboard";

export interface FuturesHistoryService {
  actualMargin: number;
  actualRate: number;
  appendMargin: number;
  index: number;
  initialMargin: number;
  lastPrice: number;
  leverage: string;
  openPrice: number;
  orderType: string;
  orientation: string;
  owner: string;
  sl: number;
  sp: number;
  time: number;
  tokenPair: string;
}

function useFuturesHistory(data: FuturesHistoryService) {
  const tokenName = data.tokenPair.split("/")[0];
  const isLong = data.orientation === "Long";
  const lever = useMemo(() => {
    return data.leverage ? Number(data.leverage.toString().split("X")[0]) : 0;
  }, [data.leverage]);
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  const tp = useMemo(() => {
    return data.sp
      ? data.sp.toFixed(tokenName.getTokenPriceDecimals())
      : String().placeHolder;
  }, [data.sp, tokenName]);
  const sl = useMemo(() => {
    return data.sl
      ? data.sl.toFixed(tokenName.getTokenPriceDecimals())
      : String().placeHolder;
  }, [data.sl, tokenName]);
  const showOpenPrice = useMemo(() => {
    
    if (data.openPrice) {
      return data.openPrice.toFixed(tokenName.getTokenPriceDecimals());
    } else {
      return String().placeHolder;
    }
  }, [data.openPrice, tokenName]);
  const showMarginAssets = useMemo(() => {
    return data.actualMargin
      ? data.actualMargin.floor(2)
      : String().placeHolder;
  }, [data.actualMargin]);
  const time = useMemo(() => {
    if (data.time) {
      const timestamp = new Date(data.time * 1000);
      return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
    } else {
      return String().placeHolder;
    }
  }, [data.time]);
  const showClosePrice = useMemo(() => {
    return data.lastPrice ? data.lastPrice.toString() : "0";
  }, [data.lastPrice]);

  const showPercentNum = useMemo(() => {
    return data.actualRate ? data.actualRate : 0;
  }, [data.actualRate]);
  const showPercent = useMemo(() => {
    if (showPercentNum > 0) {
      return `+${showPercentNum.floor(2)}`;
    } else if (showPercentNum < 0) {
      return `${showPercentNum.floor(2)}`;
    } else {
      return "0";
    }
  }, [showPercentNum]);
  const isRed = useMemo(() => {
    return showPercent.indexOf("-") === 0;
  }, [showPercent]);
  // TODO
  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.owner,
      leverage: data.leverage,
      orientation: data.orientation,
      actualRate: data.actualRate,
      index: data.index,
      openPrice: data.openPrice,
      tokenPair: data.tokenPair,
      actualMargin: data.actualMargin,
      initialMargin: data.initialMargin,
      lastPrice: data.lastPrice,
      sp: parseFloat(data.sp.toFixed(tokenName.getTokenPriceDecimals())),
      sl: parseFloat(data.sl.toFixed(tokenName.getTokenPriceDecimals())),
    };
    return info;
  }, [
    data.actualMargin,
    data.actualRate,
    data.index,
    data.initialMargin,
    data.lastPrice,
    data.leverage,
    data.openPrice,
    data.orientation,
    data.owner,
    data.sl,
    data.sp,
    data.tokenPair,
    tokenName,
  ]);
  return {
    tokenName,
    isLong,
    lever,
    tp,
    sl,
    showOpenPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
    time,
    showClosePrice
  };
}

export default useFuturesHistory;
