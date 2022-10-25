import { BigNumber } from "ethers";
import { NESTNFTContract } from "./../../libs/constants/addresses";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import { NESTNFTAuction } from "../../libs/hooks/useContract";

export function useNESTNFTAuctionStart(
  tokenId: BigNumber,
  cycle: BigNumber,
  price?: BigNumber
) {
  const { account, chainId } = useWeb3();
  var contract = NESTNFTAuction();
  var callData: string | undefined;
  if (!chainId || !price) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("startAuction", [
      NESTNFTContract[chainId],
      tokenId,
      price,
      cycle,
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE[chainId!],
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `NFT start auction`,
    info: "",
    type: TransactionType.NESTNFTAuctionStart,
  });
  return txPromise;
}

export function useNESTNFTAuction(index: BigNumber, price?: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTNFTAuction();
  var callData: string | undefined;
  if (!chainId || !price) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("bid", [index, price]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE[chainId!],
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `NFT bid`,
    info: "",
    type: TransactionType.NESTNFTAuction,
  });
  return txPromise;
}

export function useNESTNFTAuctionEnd(index: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTNFTAuction();
  var callData: string | undefined;
  if (!chainId) {
    contract = null;
  } else {
    callData = contract?.interface.encodeFunctionData("endAuction", [index]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE[chainId!],
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `NFT end auction`,
    info: "",
    type: TransactionType.NESTNFTAuctionEnd,
  });
  return txPromise;
}
