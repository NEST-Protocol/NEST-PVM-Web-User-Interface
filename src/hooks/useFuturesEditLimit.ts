import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import { useFuturesUpdateLimitPrice } from "../contracts/useFuturesBuyV2";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";
import { BigNumber } from "ethers";
import { t } from "@lingui/macro";
import { priceToken } from "../pages/Futures/Futures";

function useFuturesEditLimit(data: FuturesOrderV2, onClose: () => void) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
  const tokenPair = useMemo(() => {
    return priceToken[parseInt(data.channelIndex.toString())];
  }, [data.channelIndex]);
  const defaultLimitPrice = useMemo(() => {
    return !BigNumber.from("0").eq(data.basePrice)
      ? data.basePrice.bigNumberToShowString(
          18,
          tokenPair.getTokenPriceDecimals()
        )
      : "";
  }, [data.basePrice, tokenPair]);
  const [limitPrice, setLimitPrice] = useState(defaultLimitPrice);
  /**
   * action
   */
  const { transaction: edit } = useFuturesUpdateLimitPrice(
    data.index,
    limitPrice.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_editLimit,
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
    return t`Confirm`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (edit.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [edit.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading) {
      return;
    } else {
      edit.write?.();
    }
  }, [edit, mainButtonLoading]);
  return {
    limitPrice,
    setLimitPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useFuturesEditLimit;
