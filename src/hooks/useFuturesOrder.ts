import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useCancelBuyRequest } from "../contracts/useFuturesBuyV2";
import { Order } from "../pages/Dashboard/Dashboard";
import { priceToken } from "../pages/Futures/Futures";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesOrder(data: FuturesOrderV2) {
  const { isPendingOrder } = usePendingTransactions();
  const tokenName = priceToken[parseInt(data.channelIndex.toString())];
  const isLong = data.orientation;
  const lever = parseInt(data.lever.toString());
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  const showLimitPrice = useMemo(() => {
    return BigNumber.from(data.basePrice.toString()).bigNumberToShowString(
      18,
      2
    );
  }, [data.basePrice]);
  const showBalance = useMemo(() => {
    return BigNumber.from(data.balance.toString()).bigNumberToShowString(4, 2);
  }, [data.balance]);
  /**
   * action
   */
  const { transaction: closeLimit } = useCancelBuyRequest(data.index);
  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_closeLimit,
      parseInt(data.index.toString())
    );
  }, [data.index, isPendingOrder]);
  const mainButtonTitle = useMemo(() => {
    return "Close";
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (closeLimit.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [closeLimit.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading) {
      return;
    } else {
      closeLimit.write?.();
    }
  }, [closeLimit, mainButtonLoading]);
  const tp = useMemo(() => {
    const tpNum = data.stopProfitPrice;
    return BigNumber.from("0").eq(tpNum)
      ? String().placeHolder
      : BigNumber.from(tpNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopProfitPrice]);
  const sl = useMemo(() => {
    const slNum = data.stopLossPrice;
    return BigNumber.from("0").eq(slNum)
      ? String().placeHolder
      : BigNumber.from(slNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopLossPrice]);
  
  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.owner.toString(),
      leverage: `${data.lever.toString()}X`,
      orientation: data.orientation ? "Long" : "Short",
      actualRate: 0,
      index: parseInt(data.index.toString()),
      openPrice: parseFloat(data.basePrice.bigNumberToShowString(18, 2)),
      tokenPair: `${tokenName}/USDT`,
      actualMargin: 0,
      initialMargin: parseFloat(
        BigNumber.from(data.balance.toString()).bigNumberToShowString(4, 2)
      ),
      lastPrice: 0,
      sp: parseFloat(tp === String().placeHolder ? "0" : tp),
      sl: parseFloat(sl === String().placeHolder ? "0" : sl),
    };
    return info;
  }, [
    data.balance,
    data.basePrice,
    data.index,
    data.lever,
    data.orientation,
    data.owner,
    sl,
    tokenName,
    tp,
  ]);
  return {
    tokenName,
    isLong,
    lever,
    showLimitPrice,
    showBalance,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
    tp,
    sl,
  };
}

export default useFuturesOrder;
