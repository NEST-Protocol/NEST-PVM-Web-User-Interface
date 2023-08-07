import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { infuraProvider } from "wagmi/providers/infura";
import { ProviderProps } from "./provider";

import {
  MetaMask,
  CoinbaseWallet,
  WalletConnect,
  TrustWallet,
  OKX,
} from "../components/icons";
import useTheme from "../hooks/useTheme";

const scrollAlphaTestnet = {
  id: 534353,
  name: "scroll Alpha Testnet",
  network: "scroll Alpha Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://scroll-alpha-public.unifra.io"],
    },
    public: {
      http: ["https://scroll-alpha-public.unifra.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "scrollExplorer",
      url: "https://blockscout.scroll.io/",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  // [bsc, scrollAlphaTestnet],
  [bscTestnet],
  // [bsc],
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
        } else if (chain.id === 534353) {
          return {
            http: "https://scroll-alpha-public.unifra.io",
          };
        } else {
          return {
            http: "",
          };
        }
      },
    }),
  ]
);

export const Wallets = [
  {
    wallet: metaMaskWallet({ projectId: "NEST", chains: chains }),
    icon: MetaMask,
    name: "MetaMask",
  },
  {
    wallet: walletConnectWallet({ projectId: "NEST", chains: chains }),
    icon: WalletConnect,
    name: "WalletConnect",
  },
  {
    wallet: coinbaseWallet({ chains, appName: "NEST" }),
    icon: CoinbaseWallet,
    name: "coinbase Wallet",
  },
  {
    wallet: trustWallet({ projectId: "NEST", chains: chains }),
    icon: TrustWallet,
    name: "Trust Wallet",
  },
  {
    wallet: okxWallet({ projectId: "NEST", chains: chains }),
    icon: OKX,
    name: "OKX Wallet",
  },
];

const config = createConfig({
  autoConnect: true,
  connectors: connectorsForWallets([
    {
      groupName: "main",
      wallets: Wallets.map((item) => item.wallet),
    },
  ]),
  publicClient,
});

const WalletProvider: FC<ProviderProps> = ({ children }) => {
  const { nowTheme } = useTheme();
  return (
    <WagmiConfig config={config}>
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
