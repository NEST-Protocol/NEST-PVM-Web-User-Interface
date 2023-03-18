import { BigNumber } from "ethers";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useFuturesSell } from "../contracts/useFuturesBuy";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesClose(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
  const showPosition = useMemo(() => {
    const lever = data.lever.toString();
    const longOrShort = data.orientation ? "Long" : "Short";
    const balance = BigNumber.from(
      data.balance.toString()
    ).bigNumberToShowString(4, 2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.lever, data.orientation]);

  const showClosePrice = useMemo(() => {
    if (!price) {
      return String().placeHolder;
    }
    const token = priceToken[parseInt(data.channelIndex.toString())];
    return BigNumber.from(price[token].toString()).bigNumberToShowString(18, 2);
  }, [data.channelIndex, price]);

  const showFee = useMemo(() => {
    if (!price) {
      return String().placeHolder;
    }
    const token = priceToken[parseInt(data.channelIndex.toString())];
    const fee = BigNumber.from("1")
      .mul(data.lever)
      .mul(data.balance)
      .mul(price[token])
      .div(BigNumber.from("1000").mul(data.basePrice));
    return fee.bigNumberToShowString(4, 2);
  }, [data.balance, data.basePrice, data.channelIndex, data.lever, price]);
  const feeTip = useMemo(() => {
    return "Position*0.1%";
  }, []);
  /**
   * action
   */
  const { transaction: sell } = useFuturesSell(data.index);

  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_sell,
      parseInt(data.index.toString())
    );
  }, [data.index, isPendingOrder]);
  useEffect(() => {
    if (send && !pending) {
      onClose();
    } else if (!send && pending) {
      setSend(true);
    }
  }, [onClose, pending, send]);
  const mainButtonTitle = useMemo(() => {
    return "Confirm";
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (sell.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [sell.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonLoading) {
      sell.write?.();
    }
  }, [mainButtonLoading, sell]);
  return {
    showPosition,
    showClosePrice,
    showFee,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    feeTip,
  };
}

export default useFuturesClose;
