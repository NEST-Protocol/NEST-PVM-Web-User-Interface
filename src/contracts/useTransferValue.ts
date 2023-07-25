import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import useNEST from "../hooks/useNEST";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";
import { NESTServiceOther } from "./contractAddress";
import { BigNumber } from "ethers/lib/ethers";
import { useEffect, useMemo } from "react";

export function useTransferValue(amount: BigNumber) {
  const { chainsData } = useNEST();
  const value = useMemo(() => {
    return chainsData.chainId ? amount : BigNumber.from("0");
  }, [amount, chainsData.chainId]);
  const { addPendingList } = usePendingTransactions();
  const { config } = usePrepareSendTransaction({
    request: {
      to: NESTServiceOther[chainsData.chainId ?? 97],
      value: value,
    },
  });
  const { data, isLoading, isSuccess, sendTransaction, reset } =
    useSendTransaction(config);
  useEffect(() => {
    if (data) {
      addPendingList({
        hash: data.hash,
        type: TransactionType.deposit,
      });
      reset();
    }
  }, [addPendingList, data, reset]);

  return {
    sendTransaction,
    isLoading,
    isSuccess,
  };
}
