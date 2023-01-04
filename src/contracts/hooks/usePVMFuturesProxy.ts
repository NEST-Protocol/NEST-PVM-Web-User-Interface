import { BigNumber } from "ethers";
import { TokenType } from "../../libs/constants/addresses";
import { PVMFuturesProxy } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function usePVMFuturesProxyNew(
  token: TokenType,
  lever: BigNumber,
  orientation: boolean,
  amount: BigNumber,
  limitPrice: BigNumber,
  stopPrice: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = PVMFuturesProxy();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("newLimitOrder", [
      token.pairIndex[chainId],
      lever,
      orientation,
      amount,
      limitPrice,
      stopPrice,
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

export function usePVMFuturesProxyCancel(index: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = PVMFuturesProxy();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("cancelLimitOrder", [
      index,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Cancel Limit Order`,
    info: "",
    type: TransactionType.PVMFuturesProxyCancel,
  });
  return txPromise;
}
