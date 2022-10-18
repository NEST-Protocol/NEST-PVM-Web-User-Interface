import { BigNumber } from 'ethers';
import { NESTNFTContract } from "./../../libs/constants/addresses";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import { NESTNFT } from "../../libs/hooks/useContract";

export function useNESTNFTMint() {
  const { account, chainId } = useWeb3();
  var contract = NESTNFT(NESTNFTContract);
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("mint");
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE[chainId!],
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Mint NFT`,
    info: "",
    type: TransactionType.NESTNFTMint,
  });
  return txPromise;
}

export function useNESTNFclaim(index: BigNumber) {
    const { account, chainId } = useWeb3();
    var contract = NESTNFT(NESTNFTContract);
    var callData: string | undefined;
    if (!chainId) {
      contract = null;
    } else {
      callData = contract?.interface.encodeFunctionData("claim", [index]);
    }
    const tx = {
      from: account,
      to: contract?.address,
      data: callData,
      value: PRICE_FEE[chainId!],
    };
    const txPromise = useSendTransaction(contract, tx, {
      title: `Claim NFT`,
      info: "",
      type: TransactionType.NESTNFTClaim,
    });
    return txPromise;
  }
