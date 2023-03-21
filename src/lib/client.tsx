import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { infuraProvider } from "wagmi/providers/infura";
import { ProviderProps } from "./provider";
import { okxWallet } from "./okxWallet";
import {
  MetaMask,
  CoinbaseWallet,
  WalletConnect,
  TrustWallet,
  OKX,
} from "../components/icons";
import useTheme from "../hooks/useTheme";

const { chains, provider, webSocketProvider } = configureChains(
  // [bsc],
  [bscTestnet],
  [
    infuraProvider({ apiKey: "be0a9832394640b090fceb2b2107993c" }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === 97) {
          return {
            http: "https://data-seed-prebsc-2-s2.binance.org:8545",
          };
        } else if (chain.id === 56) {
          return {
            http: "https://bsc-dataseed1.defibit.io/",
          };
        } else {
          return {
            http: "",
          };
        }
      },
    }),
  ],
  { targetQuorum: 1 }
);

export const Wallets = [
  {
    wallet: metaMaskWallet({ chains }),
    icon: MetaMask,
    name: "MetaMask",
  },
  {
    wallet: walletConnectWallet({ chains }),
    icon: WalletConnect,
    name: "WalletConnect",
  },
  {
    wallet: coinbaseWallet({ chains, appName: "NEST" }),
    icon: CoinbaseWallet,
    name: "coinbase Wallet",
  },
  { wallet: trustWallet({ chains }), icon: TrustWallet, name: "Trust Wallet" },
  { wallet: okxWallet({ chains }), icon: OKX, name: "OKX Wallet" },
];

const client = createClient({
  autoConnect: true,
  connectors: connectorsForWallets([
    {
      groupName: "main",
      wallets: Wallets.map((item) => item.wallet),
    },
  ]),
  provider,
  webSocketProvider,
});

const WalletProvider: FC<ProviderProps> = ({ children }) => {
  const { nowTheme } = useTheme();
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        theme={nowTheme.isLight ? lightTheme() : darkTheme()}
        chains={chains}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletProvider;
