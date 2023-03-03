import { BigNumber } from "ethers/lib/ethers";
import { NESTTrustFutures } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function useTrustFuturesBuy(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("buy", [
      channelIndex,
      lever,
      orientation,
      amount,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Open Future positions`,
    info: "",
    type: TransactionType.buyLever,
  });
  return txPromise;
}

export function useTrustFuturesBuyWithStopOrder(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("buyWithStopOrder", [
      channelIndex,
      lever,
      orientation,
      amount,
      stopProfitPrice,
      stopLossPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Open Future positions`,
    info: "",
    type: TransactionType.PVMFuturesProxyNew,
  });
  return txPromise;
}

export function useTrustFuturesNewTrustOrder(
  channelIndex: BigNumber,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  limitPrice: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("newTrustOrder", [
      channelIndex,
      lever,
      orientation,
      amount,
      limitPrice,
      stopProfitPrice,
      stopLossPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `New Limit Order`,
    info: "",
    type: TransactionType.PVMFuturesProxyNew,
  });
  return txPromise;
}

export function useTrustFuturesAdd(orderIndex: BigNumber, amount: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("add", [
      orderIndex,
      amount,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Add Future positions`,
    info: orderIndex.toString(),
    type: TransactionType.PVMFuturesAdd,
  });
  return txPromise;
}

export function useTrustFuturesSell(orderIndex: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("sell", [orderIndex]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Close Future positions`,
    info: orderIndex.toString(),
    type: TransactionType.closeLever,
  });
  return txPromise;
}

export function useTrustFuturesNewStopOrder(
  orderIndex: BigNumber,
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("newStopOrder", [
      orderIndex,
      stopProfitPrice,
      stopLossPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Edit Trigger`,
    info: orderIndex.toString(),
    type: TransactionType.PVMFuturesEditTrigger,
  });
  return txPromise;
}

export function useTrustFuturesUpdateStopPrice(
  stopProfitPrice: BigNumber,
  stopLossPrice: BigNumber,
  trustOrderIndex?: BigNumber,
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId || !trustOrderIndex) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("updateStopPrice", [
      trustOrderIndex,
      stopProfitPrice,
      stopLossPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Edit Trigger`,
    info: trustOrderIndex ? trustOrderIndex.toString() : '',
    type: TransactionType.PVMFuturesEditTrigger,
  });
  return txPromise;
}

export function useTrustFuturesUpdateLimitPrice(
  trustOrderIndex: BigNumber,
  limitPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("updateLimitPrice", [
      trustOrderIndex,
      limitPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Update Limit Order`,
    info: trustOrderIndex.toString(),
    type: TransactionType.PVMFuturesProxyEdit,
  });
  return txPromise;
}

export function useTrustFuturesCancelLimitOrder(trustOrderIndex: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTTrustFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("cancelLimitOrder", [
      trustOrderIndex,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Cancel Limit Order`,
    info: trustOrderIndex.toString(),
    type: TransactionType.PVMFuturesProxyCancel,
  });
  return txPromise;
}
