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
import { t } from "@lingui/macro";
import useNEST from "./useNEST";
import useNESTSnackBar from "./useNESTSnackBar";

function useFuturesOrder(data: FuturesOrderV2) {
  const { stopAll } = useNEST();
  const { messageSnackBar } = useNESTSnackBar();
  const { isPendingOrder } = usePendingTransactions();
  const tokenName = priceToken[parseInt(data.channelIndex.toString())];
  const isLong = data.orientation;
  const lever = parseInt(data.lever.toString());
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  const showLimitPrice = useMemo(() => {
    return BigNumber.from(data.basePrice.toString()).bigNumberToShowPrice(
      18,
      tokenName.getTokenPriceDecimals()
    );
  }, [data.basePrice, tokenName]);
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
    return t`Close`;
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
    } else if (stopAll) {
      messageSnackBar(t`待定文案`);
      return;
    } else {
      closeLimit.write?.();
    }
  }, [closeLimit, mainButtonLoading, messageSnackBar, stopAll]);
  const tp = useMemo(() => {
    const tpNum = data.stopProfitPrice;
    return BigNumber.from("0").eq(tpNum)
      ? String().placeHolder
      : BigNumber.from(tpNum.toString()).bigNumberToShowPrice(
          18,
          tokenName.getTokenPriceDecimals()
        );
  }, [data.stopProfitPrice, tokenName]);
  const sl = useMemo(() => {
    const slNum = data.stopLossPrice;
    return BigNumber.from("0").eq(slNum)
      ? String().placeHolder
      : BigNumber.from(slNum.toString()).bigNumberToShowPrice(
          18,
          tokenName.getTokenPriceDecimals()
        );
  }, [data.stopLossPrice, tokenName]);

  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.owner.toString(),
      leverage: `${data.lever.toString()}X`,
      orientation: data.orientation ? t`Long` : t`Short`,
      actualRate: 0,
      index: parseInt(data.index.toString()),
      openPrice: parseFloat(
        data.basePrice.bigNumberToShowPrice(
          18,
          tokenName.getTokenPriceDecimals()
        )
      ),
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
