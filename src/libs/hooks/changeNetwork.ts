import { SupportedChains } from "../constants/chain";

async function changeNetwork(id: number) {
  const { ethereum } = window;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + id.toString(16) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      const thisChain = SupportedChains.filter((item) => {
        return item.chainId === id;
      });
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x" + id.toString(16),
            chainName: thisChain[0].name,
            nativeCurrency: {
              name: thisChain[0].chain,
              symbol: thisChain[0].chain,
              decimals: 18,
            },
            rpcUrls: thisChain[0].rpc,
            blockExplorerUrls: [thisChain[0].infoURL],
          },
        ],
      });
    }
  }
}

export default changeNetwork;
