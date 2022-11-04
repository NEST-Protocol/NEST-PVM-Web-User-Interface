import { BigNumber } from "ethers";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import { NESTNFTMarket } from "../../libs/hooks/useContract";
import { keccak256 } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";

export const whiteList = [
  "0x688f016CeDD62AD1d8dFA4aBcf3762ab29294489",
  "0xDa23cc497BE691044F2944734EDa6d4f55bC41BA",
  "0x0e20201B2e9bC6eba51bcC6E710C510dC2cFCfA4",
  "0xd9f3aA57576a6da995fb4B7e7272b4F16f04e681",
  "0xa0c5832EAB3363159dB8baC849473FBCfd454686",
  "0x871e642fB0047DC6CE7E79297f07C3ee02D81fC0",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
  "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
];

// whiteList
export const checkWhiteList = (account: string | null | undefined) => {
  const inList = whiteList.filter((item) => {
    return account?.toLocaleLowerCase() === item.toLocaleLowerCase();
  });
  return inList.length > 0 ? true : false;
};

export function useNESTNFTWhiteListBuy(tokenId: BigNumber) {
  const { account, chainId } = useWeb3();
  var contract = NESTNFTMarket();
  var callData: string | undefined;
  if (!chainId || !account) {
    contract = null;
  } else {
    const nodes = whiteList.map((addr) => keccak256(addr));
    const myNode = keccak256(account)
    const merkleTree = new MerkleTree(nodes, keccak256, { sortPairs: true });
    callData = contract?.interface.encodeFunctionData("whiteListBuy", [
      tokenId,
      merkleTree.getHexProof(myNode)
    ]);
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE[chainId!],
  };
  const txPromise = useSendTransaction(contract, tx, {
    title: `Buy NFT`,
    info: "",
    type: TransactionType.NESTNFTWhiteListBuy,
  });
  return txPromise;
}
