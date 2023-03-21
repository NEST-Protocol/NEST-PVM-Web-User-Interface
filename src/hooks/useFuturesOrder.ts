import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useFuturesCloseLimit } from "../contracts/useFuturesBuy";
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
  const trustOrderIndex = useMemo(() => {
    return data.trustOrder ? data.trustOrder.index : undefined;
  }, [data.trustOrder]);
  const showLimitPrice = useMemo(() => {
    const limitNum = data.trustOrder
      ? data.trustOrder.limitPrice
      : BigNumber.from("0");
    return BigNumber.from(limitNum.toString()).bigNumberToShowString(18, 2);
  }, [data.trustOrder]);
  const showBalance = useMemo(() => {
    const balanceNum = data.trustOrder
      ? data.trustOrder.balance
      : BigNumber.from("0");
    return BigNumber.from(balanceNum.toString()).bigNumberToShowString(4, 2);
  }, [data.trustOrder]);
  /**
   * action
   */
  const { transaction: closeLimit } = useFuturesCloseLimit(trustOrderIndex);
  /**
   * main button
   */
  const pending = useMemo(() => {
    if (data.trustOrder) {
      return isPendingOrder(
        TransactionType.futures_closeLimit,
        parseInt(data.trustOrder.index.toString())
      );
    } else {
      return false;
    }
  }, [data.trustOrder, isPendingOrder]);
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
    if (data.trustOrder) {
      const tpNum = data.trustOrder.stopProfitPrice;
      return BigNumber.from("0").eq(tpNum)
        ? String().placeHolder
        : BigNumber.from(tpNum.toString()).bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [data.trustOrder]);
  const sl = useMemo(() => {
    if (data.trustOrder) {
      const slNum = data.trustOrder.stopLossPrice;
      return BigNumber.from("0").eq(slNum)
        ? String().placeHolder
        : BigNumber.from(slNum.toString()).bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [data.trustOrder]);
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
    sl
  };
}

export default useFuturesOrder;
