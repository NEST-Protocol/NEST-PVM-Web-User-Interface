import { BigNumber } from "ethers";
import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenFORT,
  TokenNest,
  TokenNHBTC,
  TokenUSDT,
} from "../../components/Icon";
import { ZERO_ADDRESS } from "../utils";

export type AddressesType = {
  [key: number]: string;
};

export type PairIndexType = {
  [key: number]: string;
};

export type TokenType = {
  symbol: string;
  Icon: typeof TokenETH;
  decimals: number;
  addresses: AddressesType;
  pairIndex: PairIndexType;
  nowPrice?: BigNumber;
  k?: BigNumber;
  sigmaSQ?: BigNumber;
};

export const tokenList: { [key: string]: TokenType } = {
  ETH: {
    symbol: "ETH",
    Icon: TokenETH,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      5: ZERO_ADDRESS,
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS,
    },
    pairIndex: {
      1: "1",
      5: "0",
      56: "0",
      97: "0",
    },
    sigmaSQ: BigNumber.from("45659142400"),
  },
  BNB: {
    symbol: "BNB",
    Icon: TokenBNB,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      5: ZERO_ADDRESS,
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS,
    },
    pairIndex: {
      1: "3",
      5: "0",
      56: "3",
      97: "3",
    },
    sigmaSQ: BigNumber.from("45659142400"),
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      5: "0x5cbb73B367FD69807381d06BC2041BEc86d8487d",
      56: "0x55d398326f99059ff775485246999027b3197955",
      97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc",
    },
    pairIndex: {
      1: "",
      5: "",
      56: "",
      97: "",
    },
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      1: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      5: "0x2E5963e4385Fc85B81B81A7146adC58236AF3f33",
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0x5Df87aE415206707fd52aDa20a5Eac2Ec70e8dbb",
    },
    pairIndex: {
      1: "",
      5: "",
      56: "",
      97: "",
    },
  },
  BTC: {
    symbol: "BTC",
    Icon: TokenBTC,
    decimals: 18,
    addresses: {
      1: "0x0316EB71485b0Ab14103307bf65a021042c6d380",
      5: "0x48e5c876074549cD4Bb7be0800154450b59b1eB6",
      56: "0x46893c30fBDF3A5818507309c0BDca62eB3e1E6b",
      97: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B",
    },
    pairIndex: {
      1: "0",
      5: "1",
      56: "2",
      97: "2",
    },
    sigmaSQ: BigNumber.from("31708924900"),
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      1: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
      5: "0xE2975bf674617bbCE57D2c72dCfC926716D8AC1F",
      56: "0x98f8669F6481EbB341B522fCD3663f79A3d1A6A7",
      97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE",
    },
    pairIndex: {
      1: "",
      5: "",
      56: "",
      97: "",
    },
    sigmaSQ: BigNumber.from("0"),
  },
  NHBTC: {
    symbol: "NHBTC",
    Icon: TokenNHBTC,
    decimals: 18,
    addresses: {
      1: "0x1F832091fAf289Ed4f50FE7418cFbD2611225d46",
      5: "",
      56: "",
      97: "0xDda3801487a8Bb5ec19dD1E3510b6340BA435863",
    },
    pairIndex: {},
    sigmaSQ: BigNumber.from("0"),
  },
};

export const PVMOptionContract: AddressesType = {
  1: "0x10F7f08A278e495CBCa66388A2400fF0deFe3122",
  5: "0xc4513DE545d02DC8F61D742530620CcFd0E977D8",
  56: "0x12858F7f24AA830EeAdab2437480277E92B0723a",
  97: "0x8bBd5db40F61C628a8F62ba75752227b1BFbF6a8",
};

export const PVMLeverContract: AddressesType = {
  1: "0x0E48e068958b3E683a664FB81697F7046f83C3A8",
  5: "0x3713Ac1FF40a191905D568E4Db65cb392474BCEC",
  56: "0x8e32C33814271bD64D5138bE9d47Cd55025074CD",
  97: "0xb8B5b3CDdC5DA7F4B75Bd4B408389b923962ee98",
};
export const PVMFuturesContract: AddressesType = {
  1: "",
  5: "",
  56: "0x8e32C33814271bD64D5138bE9d47Cd55025074CD",
  97: "0xA2D58989ef9981065f749C217984DB21970fF0b7",
};
export const PVMFuturesProxyContract: AddressesType = {
  1: "",
  5: "",
  56: "0x8b2A11F6C5cEbB00793dCE502a9B08741eDBcb96",
  97: "0xd6C4BE39748510BB5b8B2eF0b0aF71B860691bcb",
};
export const NESTRedeemContract: AddressesType = {
  1: "0xaf22d05095d09cb6cb4f18cb7aefd94cb39eb113",
  5: "",
  56: "",
  97: "0x6E9c1edACe6Fc03f9666769f09D557b1383f7F57",
};

export const NestPrice: AddressesType = {
  1: "0xE544cF993C7d477C7ef8E91D28aCA250D135aa03",
  5: "0x3948F9ec377110327dE3Fb8176C8Ed46296d76bA",
  56: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  97: "0xF2f9E62f52389EF223f5Fa8b9926e95386935277",
};

export const PVMPayBackContract: AddressesType = {
  1: "0x7b65629A811eBB0d6CC99bDc4d1d606f8F707125",
  5: "0xdA83DF38F34Cd4E8756827C185f7826C98Db97f0",
  56: "0x8AA36CF9CD7e88b63F32c53C66BFaDd409367B2f",
  97: "0xB82c97436C3ae453cd21Ef68Ec6900D2e0380Bcd",
};

export const UniSwapV2Contract: AddressesType = {
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  5: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  97: "0xd99d1c33f9fc3444f8101754abc46c52416550d1",
};

export const NESTNFTContract: AddressesType = {
  1: "",
  5: "",
  56: "0xCBB79049675F06AFF618CFEB74c2B0Bf411E064a",
  97: "0x0b933B3a74ADd67e0690f7962e2AbbE975048326",
};

export const NESTNFTAuctionContract: AddressesType = {
  1: "",
  5: "",
  56: "0x84DC9B49b09d2eB07Cb2D78D2F11bA5b04CeaDf3",
  97: "0xF61Dd2B661184FAE507475d03ED561593f1882d4",
};

export const NESTNFTMarketContract: AddressesType = {
  1: "",
  5: "",
  56: "0x8b2bc5A2B20acd6a2A71E1dc8D78F6964C65a472",
  97: "0xd435489F3BB3b6004230b67bb122bac22419Fdfd",
};

export const TestTokenContract: AddressesType = {
  1: ZERO_ADDRESS,
  5: ZERO_ADDRESS,
  56: ZERO_ADDRESS,
  97: "0x953750D91CaCcFBD43fcbC562BB2d66975231CE7",
};

export const NestTrustFuturesContract: AddressesType = {
  1: ZERO_ADDRESS,
  5: ZERO_ADDRESS,
  56: ZERO_ADDRESS,
  97: "0x573e166aAEEFb1baE40653351330cE29cc5E1434",
};
