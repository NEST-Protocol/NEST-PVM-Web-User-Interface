import { useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ERC20ABI from "./ABI/ERC20.json";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";
import useNEST from "../hooks/useNEST";
import { NESTService, NESTServiceOther, USDTToken } from "./contractAddress";

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
    transaction,
  };
}

export function useTokenTransfer(
  tokenAddress: `0x${string}`,
  amount: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const toAddress = useMemo(() => {
    if (chainsData.chainId) {
      if (
        tokenAddress.toLocaleLowerCase() ===
        USDTToken[chainsData.chainId].toLocaleLowerCase()
      ) {
        return NESTServiceOther[chainsData.chainId] as `0x${string}`;
      }
      return NESTService[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, tokenAddress]);
  const token = useMemo(() => {
    if (toAddress) {
      return tokenAddress;
    }
  }, [toAddress, tokenAddress]);

  const { config } = usePrepareContractWrite({
    address: token,
    abi: ERC20ABI,
    functionName: "transfer",
    args: [toAddress, amount],
    enabled: true,
  });
  const transaction = useContractWrite({
    ...config,
    request: { ...config.request, value: BigNumber.from("0") },
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.deposit,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export default useTokenApprove;
