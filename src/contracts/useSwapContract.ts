import { useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useNEST from "../hooks/useNEST";
import UNISwapV2ABI from "./ABI/UNISwapV2.json";
import NESTRedeemABI from "./ABI/NESTRedeem.json";
import { NESTRedeemContract, SwapContract } from "./contractAddress";
import useAddGasLimit from "./useAddGasLimit";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";

function useSwapExactTokensForTokens(
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  path: Array<string> | undefined,
  to: string | undefined
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const time = new Date().getTime() / 1000 + 600;
  const address = useMemo(() => {
    if (chainsData.chainId && path && to && !BigNumber.from("0").eq(amountIn)) {
      return SwapContract[chainsData.chainId] as `0x${string}`;
    }
  }, [amountIn, chainsData.chainId, path, to]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: UNISwapV2ABI,
    functionName: "swapExactTokensForTokens",
    args: [
      amountIn,
      amountOutMin,
      path,
      to,
      BigNumber.from(time.toFixed(0).toString()),
    ],
    enabled: true,
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
    request: { ...config.request, gasLimit: gasLimit },
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.swap_uni,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export default useSwapExactTokensForTokens;

export function useSwapNHBTCToNEST(oldTokenAmount: BigNumber) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && !BigNumber.from("0").eq(oldTokenAmount)) {
      return NESTRedeemContract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, oldTokenAmount]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: NESTRedeemABI,
    functionName: "redeem",
    args: [oldTokenAmount],
    enabled: true,
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
    request: { ...config.request, gasLimit: gasLimit },
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.swap_nhbtc,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}
