import { useCallback, useEffect } from "react";
import { useState } from "react";
import { createContainer } from "unstated-next";
import { useWaitForTransaction } from "wagmi";
import { SnackBarType } from "../components/SnackBar/NormalSnackBar";
import useTransactionSnackBar from "./useNESTSnackBar";
import { t } from "@lingui/macro";

export enum TransactionType {
  approve,
  futures_buy,
  futures_buy_request,
  futures_add,
  futures_sell,
  futures_sell_request,
  futures_editPosition,
  futures_editLimit,
  futures_closeLimit,
  swap_uni,
  swap_nhbtc,
  faucet_scroll,
}

export type TransactionInfo = {
  hash: string;
  type: TransactionType;
  info?: string;
};

export const getTransactionTypeString = (text: string) => {
  if (text === `Approve`) {
    return t`Approve`;
  } else if (text === `Open position`) {
    return t`Open position`;
  } else if (text === `Open position request`) {
    return t`Open position request`;
  } else if (text === `Add position`) {
    return t`Add position`;
  } else if (text === `Sell position`) {
    return t`Sell position`;
  } else if (text === `Sell position request`) {
    return t`Sell position request`;
  } else if (text === `Edit Position`) {
    return t`Edit Position`;
  } else if (text === `Edit Limit Order`) {
    return t`Edit Limit Order`;
  } else if (text === `Close Limit Order`) {
    return t`Close Limit Order`;
  } else if (text === `Swap`) {
    return t`Swap`;
  } else if (text === `Received`) {
    return t`Received`;
  } else {
    return "";
  }
};

const getInfoTitle = (type: TransactionType) => {
  switch (type) {
    case TransactionType.approve:
      return `Approve`;
    case TransactionType.futures_buy:
      return `Open position`;
    case TransactionType.futures_buy_request:
      return `Open position request`;
    case TransactionType.futures_add:
      return `Add position`;
    case TransactionType.futures_sell:
      return `Sell position`;
    case TransactionType.futures_sell_request:
      return `Sell position request`;
    case TransactionType.futures_editPosition:
      return `Edit Position`;
    case TransactionType.futures_editLimit:
      return `Edit Limit Order`;
    case TransactionType.futures_closeLimit:
      return `Close Limit Order`;
    case TransactionType.swap_uni:
    case TransactionType.swap_nhbtc:
      return `Swap`;
    case TransactionType.faucet_scroll:
      return `Received`;
  }
};

const getInfo = (type: TransactionType) => {
  switch (type) {
    case TransactionType.faucet_scroll:
      return t`Successfully received 100NEST test tokens`;
    default:
      return "";
  }
};

export const usePendingTransactionsBase = () => {
  const [info, setInfo] = useState<TransactionInfo>();
  const { transactionSnackBar } = useTransactionSnackBar();
  const [pendingList, setPendingList] = useState<Array<TransactionInfo>>([]);
  const { isSuccess, isError } = useWaitForTransaction({
    hash: info?.hash as `0x${string}`,
  });

  useEffect(() => {
    if ((isSuccess || isError) && info) {
      const type = isSuccess ? SnackBarType.success : SnackBarType.fail;
      transactionSnackBar(
        getInfoTitle(info.type),
        getInfo(info.type),
        type,
        info.hash
      );
      const newList = pendingList.slice(1, pendingList.length - 1);
      setPendingList(newList);
      setInfo(undefined);
    }
  }, [info, isError, isSuccess, transactionSnackBar, pendingList]);
  useEffect(() => {
    if (!info && pendingList.length > 0) {
      const thisInfo = pendingList[0];
      setInfo(thisInfo);
    }
  }, [info, pendingList]);

  const addPendingList = (info: TransactionInfo) => {
    const same = pendingList.filter((item) => item.hash === info.hash);
    if (same.length === 0) {
      setPendingList([...pendingList, info]);
    }
  };

  const isPendingOrder = useCallback(
    (type: TransactionType, order: number) => {
      return (
        pendingList.filter(
          (item) => item.type === type && item.info === order.toString()
        ).length > 0
      );
    },
    [pendingList]
  );

  const isPendingType = useCallback(
    (type: TransactionType) => {
      return pendingList.filter((item) => item.type === type).length > 0;
    },
    [pendingList]
  );

  return { addPendingList, pendingList, isPendingOrder, isPendingType };
};

const usePendingTransactionsCon = createContainer(usePendingTransactionsBase);
export function usePendingTransactions() {
  return usePendingTransactionsCon.useContainer();
}
export const PendingTransactionsProvider = usePendingTransactionsCon.Provider;
