import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import { useFuturesEditLimit as useFuturesEditLimitTransaction } from "../contracts/useFuturesBuy";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesEditLimit(data: FuturesOrderV2, onClose: () => void) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
  const defaultLimitPrice = useMemo(() => {
    return data.trustOrder
      ? data.trustOrder.limitPrice.bigNumberToShowString(18)
      : "";
  }, [data.trustOrder]);
  const [limitPrice, setLimitPrice] = useState(defaultLimitPrice);
  const trustOrderIndex = useMemo(() => {
    return data.trustOrder ? data.trustOrder.index : undefined;
  }, [data.trustOrder]);
  /**
   * action
   */
  const { transaction: edit } = useFuturesEditLimitTransaction(
    trustOrderIndex,
    limitPrice.stringToBigNumber(18)
  );
  /**
   * main button
   */
  const pending = useMemo(() => {
    if (data.trustOrder) {
      return isPendingOrder(
        TransactionType.futures_editLimit,
        parseInt(data.trustOrder.index.toString())
      );
    } else {
      return false;
    }
  }, [data.trustOrder, isPendingOrder]);
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
