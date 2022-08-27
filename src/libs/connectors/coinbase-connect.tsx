import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { SupportedChains } from "../constants/chain";

export const connector = new WalletLinkConnector({
    url: SupportedChains[1].rpc[0],
    appName: 'NEST',
    supportedChainIds: SupportedChains.map((c) => c.chainId),
  });
  
  export const id = "Coinbase";
  export const Icon = "";
  export const name = "Coinbase";
  export const result = { id, connector, Icon, name };
  
  export default result;