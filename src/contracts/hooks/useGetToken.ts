import { tokenList } from "../../libs/constants/addresses";
import { TestToken } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function useGetToken(tokenName: string) {
  const { chainId } = useWeb3();
  var contract = TestToken();
  var callData: string | undefined;
  const { account } = useWeb3();
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("getToken", [
      tokenList[tokenName].addresses[chainId],
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Transfer`,
    info: "",
    type: TransactionType.transfer,
  });
  return txPromise;
}
