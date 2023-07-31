import { useCallback, useMemo, useState } from "react";
import { Order } from "../pages/Dashboard/Dashboard";
import { t } from "@lingui/macro";
import useNEST from "./useNEST";
import { serviceCancel } from "../lib/NESTRequest";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "./useTransactionReceipt";
import { SnackBarType } from "../components/SnackBar/NormalSnackBar";
import { FuturesOrderService } from "../pages/Futures/OrderList";

function useFuturesOrder(data: FuturesOrderService, updateList: () => void) {
  const { chainsData, signature } = useNEST();
  const [loading, setLoading] = useState<boolean>(false);
  const tokenName = data.product.split("/")[0];
  const isLong = data.direction;
  const lever = data.leverage;
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  const showLimitPrice = useMemo(() => {
    return data.orderPrice.toFixed(tokenName.getTokenPriceDecimals());
  }, [data.orderPrice, tokenName]);
  const showBalance = useMemo(() => {
    return data.margin.toFixed(2);
  }, [data.margin]);
  const { addTransactionNotice } = usePendingTransactionsBase();
  /**
   * action
   */
  const close = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const closeBase: { [key: string]: any } = await serviceCancel(
        data.id.toString(),
        chainsData.chainId,
        { Authorization: signature.signature }
      );
      if (Number(closeBase["errorCode"]) === 0) {
        updateList();
      }
      addTransactionNotice({
        type: TransactionType.futures_closeLimit,
        info: "",
        result:
          Number(closeBase["errorCode"]) === 0
            ? SnackBarType.success
            : SnackBarType.fail,
      });
    }
    setLoading(false);
  }, [addTransactionNotice, chainsData.chainId, data.id, signature, updateList]);
  /**
   * main button
   */
  const mainButtonTitle = useMemo(() => {
    return t`Close`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading) {
      return;
    } else {
      setLoading(true);
      close();
    }
  }, [close, mainButtonLoading]);
  const tp = useMemo(() => {
    return data.takeProfitPrice === 0
      ? String().placeHolder
      : data.takeProfitPrice.floor(tokenName.getTokenPriceDecimals());
  }, [data.takeProfitPrice, tokenName]);
  const sl = useMemo(() => {
    return data.stopLossPrice === 0
      ? String().placeHolder
      : data.stopLossPrice.floor(tokenName.getTokenPriceDecimals());
  }, [data.stopLossPrice, tokenName]);

  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.walletAddress.toString(),
      leverage: `${data.leverage.toString()}X`,
      orientation: data.direction ? `Long` : `Short`,
      actualRate: 0,
      index: parseInt(data.id.toString()),
      openPrice: data.orderPrice,
      tokenPair: `${tokenName}/USDT`,
      actualMargin: 0,
      initialMargin: parseFloat(data.balance.floor(2)),
      lastPrice: 0,
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
