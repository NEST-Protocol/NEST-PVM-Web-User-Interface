import {
  BNBTokenLogo,
  BTCLogo,
  ETHLogo,
  ETHTokenLogo,
  NESTLogo,
  NHBTCTokenLogo,
  USDTLogo,
} from "../components/icons";

export type TokenType = {
  symbol: string;
  icon: typeof ETHLogo;
  decimals: DecimalsType;
  address: AddressType;
};

export interface AddressType {
  [key: number]: string;
}

export interface DecimalsType {
  [key: number]: number;
}

export const ETH: AddressType = {
  1: String().zeroAddress,
  5: String().zeroAddress,
  56: String().zeroAddress,
  97: String().zeroAddress,
};

export const BTC: AddressType = {
  1: String().zeroAddress,
  5: String().zeroAddress,
  56: String().zeroAddress,
  97: String().zeroAddress,
};

export const BNB: AddressType = {
  1: String().zeroAddress,
  5: String().zeroAddress,
  56: String().zeroAddress,
  97: String().zeroAddress,
};

export const NESTToken: AddressType = {
  1: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
  5: "0xE2975bf674617bbCE57D2c72dCfC926716D8AC1F",
  56: "0x98f8669F6481EbB341B522fCD3663f79A3d1A6A7",
  97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE",
};

export const USDTToken: AddressType = {
  1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  5: "0x5cbb73B367FD69807381d06BC2041BEc86d8487d",
  56: "0x55d398326f99059ff775485246999027b3197955",
  97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc",
};

export const NHBTCToken: AddressType = {
  1: "0x1F832091fAf289Ed4f50FE7418cFbD2611225d46",
  5: String().zeroAddress,
  56: String().zeroAddress,
  97: "0xDda3801487a8Bb5ec19dD1E3510b6340BA435863",
};

export const SwapContract: AddressType = {
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  5: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  97: "0x7E9747Dd4a7390FCA7D86A400D14F031981Bc1E1",
};

export const FuturesV2Contract: AddressType = {
  1: String().zeroAddress,
  5: String().zeroAddress,
  56: "0x907b35BE2dc26b12734D92e5fe20Fd511dFb0723",
  97: "0xE8b787EdE23997Ff5C64067e2220FBbd13b085A1",
};

export const NESTRedeemContract: AddressType = {
  1: "0xaf22d05095d09cb6cb4f18cb7aefd94cb39eb113",
  5: String().zeroAddress,
  56: String().zeroAddress,
  97: "0x6E9c1edACe6Fc03f9666769f09D557b1383f7F57",
};

const All18: DecimalsType = {
  1: 18,
  5: 18,
  56: 18,
  97: 18,
};
const USDTDecimals: DecimalsType = {
  1: 6,
  5: 6,
  56: 18,
  97: 18,
};

export const TokenList: Array<TokenType> = [
  {
    symbol: "BTC",
    icon: BTCLogo,
    decimals: All18,
    address: BTC,
  },
  {
    symbol: "ETH",
    icon: ETHTokenLogo,
    decimals: All18,
    address: ETH,
  },
  {
    symbol: "BNB",
    icon: BNBTokenLogo,
    decimals: All18,
    address: BNB,
  },
  {
    symbol: "NEST",
    icon: NESTLogo,
    decimals: All18,
    address: NESTToken,
  },
  {
    symbol: "USDT",
    icon: USDTLogo,
    decimals: USDTDecimals,
    address: USDTToken,
  },
  {
    symbol: "NHBTC",
    icon: NHBTCTokenLogo,
    decimals: All18,
    address: NHBTCToken,
  },
];
