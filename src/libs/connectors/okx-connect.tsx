import { OKXConnector } from "./connector/okx-connector";
import { SupportedChains } from "../constants/chain";

export const connector = new OKXConnector({
  supportedChainIds: SupportedChains.map((c) => c.chainId),
});

export const id = "OKX Wallet";
export const Icon = "";
export const name = "OKX Wallet";
export const result = { id, connector, Icon, name };

export default result;
