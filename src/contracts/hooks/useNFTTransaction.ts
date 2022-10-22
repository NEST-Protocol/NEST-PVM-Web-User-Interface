import { BigNumber } from 'ethers';
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import { NESTNFT } from "../../libs/hooks/useContract";

export function useNESTNFTMint() {
  const { account, chainId } = useWeb3();
  var contract = NESTNFT();
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

export function useNESTNFclaim(index?: BigNumber) {
    const { account, chainId } = useWeb3();
    var contract = NESTNFT();
    var callData: string | undefined;
    if (!chainId || !index) {
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

  export function useNESTNFTApprove(to?: string, tokenId?: BigNumber) {
    const { account, chainId } = useWeb3();
    var contract = NESTNFT();
    var callData: string | undefined;
    if (!chainId || !to || !tokenId) {
      contract = null;
    } else {
      callData = contract?.interface.encodeFunctionData("approve", [to, tokenId]);
    }
    const tx = {
      from: account,
      to: contract?.address,
      data: callData,
      value: PRICE_FEE[chainId!],
    };
    const txPromise = useSendTransaction(contract, tx, {
      title: `NFT approve`,
      info: "",
      type: TransactionType.approve,
    });
    return txPromise;
  }
