import { useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useNEST from "../hooks/useNEST";
import UNISwapV2ABI from "./ABI/UNISwapV2.json";
import { SwapContract } from "./contractAddress";
import useAddGasLimit from "./useAddGasLimit";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";

function useSwapExactTokensForTokens(
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  path: Array<string> | undefined,
  to: string | undefined,
  type?: TransactionType
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const time = new Date().getTime() / 1000 + 600;
  const address = useMemo(() => {
    if (chainsData.chainId && path && to && !BigNumber.from("0").eq(amountIn)) {
      return SwapContract[chainsData.chainId] as `0x${string}`;
    }
  }, [amountIn, chainsData.chainId, path, to]);
  const { config, isLoading } = usePrepareContractWrite({
    address: address,
    abi: UNISwapV2ABI,
    functionName: "swapExactTokensForTokens",
    args: [
      BigInt(amountIn.toString()),
      BigInt(amountOutMin.toString()),
      path,
      to,
      BigInt(time.toFixed(0)),
    ],
    enabled: true,
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: type ?? TransactionType.swap_uni,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data, type]);

  return {
    transaction,
    isLoading,
  };
}

export function useSwapExactETHForTokens(
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  path: Array<string> | undefined,
  to: string | undefined,
  type?: TransactionType
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const time = new Date().getTime() / 1000 + 600;
  const address = useMemo(() => {
    if (chainsData.chainId && path && to && !BigNumber.from("0").eq(amountIn)) {
      return SwapContract[chainsData.chainId] as `0x${string}`;
    }
  }, [amountIn, chainsData.chainId, path, to]);
  const { config, isLoading } = usePrepareContractWrite({
    address: address,
    abi: UNISwapV2ABI,
    functionName: "swapExactETHForTokens",
    args: [amountOutMin.toBigInt(), path, to, BigInt(time.toFixed(0))],
    enabled: true,
    value: amountIn.toBigInt(),
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
  });

  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: type ?? TransactionType.swap_uni,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data, type]);

  return {
    transaction,
    isLoading,
  };
}

export default useSwapExactTokensForTokens;
