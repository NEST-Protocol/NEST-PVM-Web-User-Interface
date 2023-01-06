import { BigNumber } from "ethers";
import { NESTRedeem } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function useNESTRedeemRedeem(oldTokenAmount: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTRedeem();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("redeem", [
      oldTokenAmount,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Swap`,
    info: "",
    type: TransactionType.swap,
  });
  return txPromise;
}
