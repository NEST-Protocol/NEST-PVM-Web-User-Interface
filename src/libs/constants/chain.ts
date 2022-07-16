type Chain = {
  name: string;
  chainId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

export const BSCTest = {
  name: "BSCTest",
  chainId: 97,
  tokenName: "BSCTest",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [
    `https://data-seed-prebsc-2-s1.binance.org:8545/`
  ],
  infoURL: "https://testnet.bscscan.com/",
};

export const BSC = {
  name: "BSC",
  chainId:56,
  tokenName: "BSC",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [
    `https://bsc-dataseed1.defibit.io/`
  ],
  infoURL: "https://bscscan.com/",
};

const INFURA_API_KEY = 'be0a9832394640b090fceb2b2107993c';

export const Rinkeby = {
  name: "Rinkeby",
  chainId: 4,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
    `wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://rinkeby.etherscan.io/",
};

export const ETH = {
  name: "Mainnet",
  chainId: 1,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://etherscan.io/",
};


// export const SupportedChains: Array<Chain> = [Mainnet, Ropsten, Rinkeby, Goerli, Kovan]
export const SupportedChains: Array<Chain> = [BSCTest, Rinkeby];
