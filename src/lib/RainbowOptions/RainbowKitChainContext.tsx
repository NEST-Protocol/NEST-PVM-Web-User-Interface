import{ createContext, useContext } from "react";

export interface RainbowKitChain {
  id: number;
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

interface RainbowKitChainContextValue {
  chains: RainbowKitChain[];
  initialChainId?: number;
}

const RainbowKitChainContext = createContext<RainbowKitChainContextValue>({
  chains: [],
});

export const useRainbowKitChains = () =>
  useContext(RainbowKitChainContext).chains;

export const useInitialChainId = () =>
  useContext(RainbowKitChainContext).initialChainId;
