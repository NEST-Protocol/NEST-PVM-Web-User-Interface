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

function useFuturesBuy(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && !MIN_NEST_BIG_NUMBER.gt(amount)) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [amount, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "buy",
    args: [channelIndex, lever, orientation, amount],
    enabled: true,
  });
  const gasLimit = useAddGasLimit(config, 30);
  const transaction = useContractWrite({
    ...config,
    request: { ...config.request, gasLimit: gasLimit },
  });
  console.log(transaction.error)
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

export function useFuturesBuyWithStopOrder(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && !MIN_NEST_BIG_NUMBER.gt(amount)) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [amount, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "buyWithStopOrder",
    args: [
      channelIndex,
      lever,
      orientation,
      amount,
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
        type: TransactionType.futures_buyWithStopOrder,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesBuyWithUSDT(
  usdtAmount: BigNumber | undefined,
  minNestAmount: BigNumber | undefined,
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && usdtAmount && minNestAmount) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, minNestAmount, usdtAmount]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "buyWithUsdt",
    args: [
      usdtAmount,
      minNestAmount,
      channelIndex,
      lever,
      orientation,
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
  console.log(transaction.error)
  useEffect(() => {
    if (transaction.data) {
      addPendingList({
        hash: transaction.data.hash,
        type: TransactionType.futures_buyWithStopOrder,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesNewTrustOrder(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  limitPrice: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (
      chainsData.chainId &&
      !MIN_NEST_BIG_NUMBER.gt(amount) &&
      !BigNumber.from("0").eq(limitPrice)
    ) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [amount, limitPrice, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "newTrustOrder",
    args: [
      channelIndex,
      lever,
      orientation,
      amount,
      limitPrice,
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
        type: TransactionType.futures_newTrustOrder,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesNewTrustOrderWithUSDT(
  usdtAmount: BigNumber | undefined,
  minNestAmount: BigNumber | undefined,
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  limitPrice: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (
      chainsData.chainId &&
      usdtAmount &&
      minNestAmount &&
      !BigNumber.from("0").eq(limitPrice)
    ) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, usdtAmount, minNestAmount, limitPrice]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "newTrustOrderWithUsdt",
    args: [
      usdtAmount,
      minNestAmount,
      channelIndex,
      lever,
      orientation,
      limitPrice,
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
        type: TransactionType.futures_newTrustOrder,
      });
      transaction.reset();
    }
  }, [addPendingList, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesSell(orderIndex: BigNumber) {
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
    functionName: "sell",
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
  console.log(config.request)
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

export function useFuturesEditLimit(
  trustOrderIndex: BigNumber | undefined,
  limitPrice: BigNumber | undefined
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && limitPrice && trustOrderIndex) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [trustOrderIndex, limitPrice, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "updateLimitPrice",
    args: [trustOrderIndex, limitPrice],
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
        info: trustOrderIndex?.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, trustOrderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesCloseLimit(trustOrderIndex: BigNumber | undefined) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && trustOrderIndex) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [trustOrderIndex, chainsData.chainId]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "cancelLimitOrder",
    args: [trustOrderIndex],
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
        info: trustOrderIndex?.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, trustOrderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesEditPosition(
  trustOrderIndex: BigNumber | undefined,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { chainsData } = useNEST();
  const { addPendingList } = usePendingTransactions();
  const address = useMemo(() => {
    if (chainsData.chainId && trustOrderIndex) {
      return FuturesV2Contract[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, trustOrderIndex]);
  const { config } = usePrepareContractWrite({
    address: address,
    abi: FuturesV2ABI,
    functionName: "updateStopPrice",
    args: [trustOrderIndex, stopProfitPrice, stopLossPrice],
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
        info: trustOrderIndex?.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, trustOrderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export function useFuturesNewStopOrder(
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
    functionName: "newStopOrder",
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
        type: TransactionType.futures_editPosition2,
        info: orderIndex.toString(),
      });
      transaction.reset();
    }
  }, [addPendingList, orderIndex, transaction, transaction.data]);

  return {
    transaction,
  };
}

export default useFuturesBuy;
