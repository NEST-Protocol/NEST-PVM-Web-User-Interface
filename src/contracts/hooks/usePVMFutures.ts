import { BigNumber } from "ethers";
import { TokenType } from "../../libs/constants/addresses";
import { PVMFutures } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function usePVMFuturesBuy2(
  token: TokenType,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  stopPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = PVMFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("buy2", [
      token.pairIndex[chainId] === "2" ? "1" : "0",
      lever,
      orientation,
      amount,
      stopPrice,
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

export function usePVMFuturesAdd2(index: BigNumber, amount: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = PVMFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("add2", [index, amount]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Add Future positions`,
    info: index.toString(),
    type: TransactionType.PVMFuturesAdd,
  });
  return txPromise;
}

export function usePVMFuturesSell2(index: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = PVMFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("sell2", [index]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Close Future positions`,
    info: index.toString(),
    type: TransactionType.closeLever,
  });
  return txPromise;
}

export function usePVMFuturesSet(index: BigNumber, stopPrice: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = PVMFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("setStopPrice", [
      index,
      stopPrice,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Edit Trigger`,
    info: index.toString(),
    type: TransactionType.PVMFuturesEditTrigger,
  });
  return txPromise;
}

export function usePVMFuturesSell(index: BigNumber, amount: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = PVMFutures();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("sell", [index, amount]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Close Future positions`,
    info: index.toString(),
    type: TransactionType.closeLever,
  });
  return txPromise;
}
