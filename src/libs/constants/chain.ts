type Chain = {
  name: string;
  chain: string;
  chainId: number;
  network: string;
  networkId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

export const BNBTest = {
  name: "BNBTest",
  chain: 'BNB',
  chainId: 97,
  network: 'BNBTest',
  networkId: 97,
  tokenName: "BNBTest",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [`https://data-seed-prebsc-2-s1.binance.org:8545/`],
  infoURL: "https://testnet.bscscan.com/",
  explorers: [],
};

export const BNB = {
  name: "BNB",
  chain: 'BNB',
  chainId: 56,
  network: 'BNB',
  networkId: 56,
  tokenName: "BNB",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [`https://bsc-dataseed1.defibit.io/`],
  infoURL: "https://bscscan.com/",
  explorers: [],
};

const INFURA_API_KEY = "be0a9832394640b090fceb2b2107993c";

export const Rinkeby = {
  name: "Rinkeby",
  chain: 'ETH',
  chainId: 4,
  network: 'Rinkeby',
  networkId: 4,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
    `wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://rinkeby.etherscan.io/",
  explorers: [],
};

export const Ethereum = {
  name: "Ethereum",
  chain: 'ETH',
  chainId: 1,
  network: 'Ethereum',
  networkId: 1,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://etherscan.io/",
  explorers: [],
};

// export const SupportedChains: Array<Chain> = [Ethereum, BNB]
// export const SupportedChains: Array<Chain> = [BNB, Ethereum];
export const SupportedChains: Array<Chain> = [Rinkeby, Ethereum];