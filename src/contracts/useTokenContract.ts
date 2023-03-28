import { useEffect } from "react";
import { BigNumber } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import ERC20ABI from "./ABI/ERC20.json";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";

function useTokenApprove(
  tokenAddress: `0x${string}`,
  to: `0x${string}` | string | undefined,
  amount: BigNumber
) {
  const { addPendingList } = usePendingTransactions();
  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "approve",
    args: [to, amount],
    enabled: true,
  });
  const transaction = useContractWrite(config);
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.approve,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction
  };
}

export default useTokenApprove;
