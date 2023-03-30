import { useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useNEST from "../hooks/useNEST";
import FuturesV2ABI from "./ABI/FuturesV2.json";
import { FuturesV2Contract } from "./contractAddress";
import useAddGasLimit from "./useAddGasLimit";
import {
  TransactionType,
  usePendingTransactions,
} from "../hooks/useTransactionReceipt";

export const MIN_NEST = 50;
export const MIN_NEST_BIG_NUMBER = BigNumber.from("500000");

export function useNewBuyRequest(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  basePrice: BigNumber | undefined,
  limit: boolean,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && !MIN_NEST_BIG_NUMBER.gt(amount) && basePrice) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [amount, chainsData.chainId, basePrice]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "newBuyRequest",
    args: [
      channelIndex,
      lever,
      orientation,
      amount,
      basePrice,
      limit,
      stopProfitPrice,
      stopLossPrice,
    ],
    enabled: true,
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
    request: { ...config.request, gasLimit: gasLimit },
    onError(error) {
      console.log("Error", error);
    },
  });
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.futures_buy,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);
  return {
    transaction,
  };
}

export function useNewBuyRequestWithUSDT(
  usdtAmount: BigNumber | undefined,
  minNestAmount: BigNumber | undefined,
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  basePrice: BigNumber | undefined,
  limit: boolean,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && usdtAmount && minNestAmount && basePrice) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, minNestAmount, usdtAmount, basePrice]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "newBuyRequestWithUsdt",
    args: [
      usdtAmount,
      minNestAmount,
      channelIndex,
      lever,
      orientation,
      basePrice,
      limit,
      stopProfitPrice,
      stopLossPrice,
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
        type: TransactionType.futures_buy,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useNewSellRequest(orderIndex: BigNumber) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "newSellRequest",
    args: [orderIndex],
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
        type: TransactionType.futures_sell,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesAdd(
  orderIndex: BigNumber,
  amount: BigNumber | undefined
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && amount) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [amount, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "add",
    args: [orderIndex, amount],
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
        type: TransactionType.futures_add,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return { transaction };
}

export function useFuturesUpdateLimitPrice(
  orderIndex: BigNumber,
  limitPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "updateLimitPrice",
    args: [orderIndex, limitPrice],
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
        type: TransactionType.futures_editLimit,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useUpdateStopPrice(
  orderIndex: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "updateStopPrice",
    args: [orderIndex, stopProfitPrice, stopLossPrice],
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
        type: TransactionType.futures_editPosition,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useCancelBuyRequest(orderIndex: BigNumber) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "cancelBuyRequest",
    args: [orderIndex],
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
        type: TransactionType.futures_closeLimit,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}
