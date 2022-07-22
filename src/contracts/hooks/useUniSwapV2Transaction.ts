import { UniSwapV2Contract } from "./../../libs/constants/addresses";
import { BigNumber } from "ethers";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { UniSwapV2 } from "../../libs/hooks/useContract";

export function useUniSwapV2Swap(
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  path: Array<string>,
  to: string
) {
  const { account, chainId } = useWeb3();
  var contract = UniSwapV2(UniSwapV2Contract);
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    const time = new Date().getTime() / 1000 + 600;
    callData = contract?.interface.encodeFunctionData(
      "swapExactTokensForTokens",
      [
        amountIn,
        amountOutMin,
        path,
        to,
        BigNumber.from(time.toFixed(0).toString()),
      ]
    );
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
