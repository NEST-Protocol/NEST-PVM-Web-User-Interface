import { useEffect, useMemo } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useNEST from "../hooks/useNEST";
import ScrollNESTABI from "./ABI/ScrollNEST.json";
import { NESTToken } from "./contractAddress";
import useAddGasLimit from "./useAddGasLimit";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";

export function useScrollNESTfaucet() {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId) {
      return NESTToken[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: ScrollNESTABI,
    functionName: "faucet",
    args: [],
    enabled: true,
  });
  // const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.faucet_scroll,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}
