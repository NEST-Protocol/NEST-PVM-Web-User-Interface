import { BigNumber } from "ethers";
import {
  TokenBTC,
  TokenETH,
  TokenFORT,
  TokenNest,
  TokenUSDT,
} from "../../components/Icon";
import { ZERO_ADDRESS } from "../utils";

export type AddressesType = {
  [key: number]: string;
};

export type PairIndexType = {
  [key: number]: string;
}

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
      3: ZERO_ADDRESS,
      4: ZERO_ADDRESS,
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS
    },
    pairIndex: {
      1: '1',
      3: '1',
      4: '1',
      56: '0',
      97: '0'
    },
    sigmaSQ: BigNumber.from('45659142400')
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      3: "0xc6611844fD9FAE67ABFAdB5a67E33A4fbbB00893",
      4: "0x2d750210c0b5343a0b79beff8F054C9add7d2411",
      56: "0x55d398326f99059ff775485246999027b3197955",
      97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc"
    },
    pairIndex: {
      1: '',
      3: '',
      4: '',
      56: '',
      97: ''
    }
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      1: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      3: "0xFe864063e10e5f7D99803765f28d2676A582A816",
      4: "0xc408edF487e98bB932eD4A8983038FF19352eDbd",
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0x5Df87aE415206707fd52aDa20a5Eac2Ec70e8dbb"
    },
    pairIndex: {
      1: '',
      3: '',
      4: '',
      56: '',
      97: ''
    }
  },
  BTC: {
    symbol: "BTC",
    Icon: TokenBTC,
    decimals: 18,
    addresses: {
      1: "0x0316EB71485b0Ab14103307bf65a021042c6d380",
      3: "",
      4: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B",
      56: "0x46893c30fBDF3A5818507309c0BDca62eB3e1E6b",
      97: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B"
    },
    pairIndex: {
      1: "0",
      3: "0",
      4: "0",
      56: '2',
      97: '2'
    },
    sigmaSQ: BigNumber.from('31708924900')
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      1: "",
      3: "",
      4: "0xE313F3f49B647fBEDDC5F2389Edb5c93CBf4EE25",
      56: "0xf43A71e4Da398e5731c9580D11014dE5e8fD0530",
      97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE"
    },
    pairIndex: {
      1: "",
      3: "",
      4: "",
      56: '',
      97: ''
    },
    sigmaSQ: BigNumber.from('0')
  },
};

export const PVMOptionContract: AddressesType = {
  1: "0x6C844d364c2836f2111891111F25C7a24da976A9",
  3: "0xa6948042D7B68b4c28907cE8B450DC0e5BBe30a5",
  4: "0x57dffD238fFe2b4cDEE9460D52F71b804E96AfA7",
  56: "0x284935F8C571d054Df98eDA8503ea13cde5fd8Cc",
  97: "0x8bBd5db40F61C628a8F62ba75752227b1BFbF6a8"
};

export const PVMLeverContract: AddressesType = {
  1: "0x622f1CB39AdE2131061C68E61334D41321033ab4",
  3: "0x48437856C4f6C3F60eA014110066BB440A4530D7",
  4: "0x56a07c76f6F91a97851013BF23ED8590070B656E",
  56: "0x8c5052f7747D8Ebc2F069286416b6aE8Ad3Cc149",
  97: "0xb8B5b3CDdC5DA7F4B75Bd4B408389b923962ee98"
};

export const NestPrice: AddressesType = {
  1: "0xE544cF993C7d477C7ef8E91D28aCA250D135aa03",
  3: "0x85723E83A7E7d88b0F3Ceb4C5bE7C853e3Ed8a82",
  4: "0xc08E6A853241B9a08225EECf93F3b279FA7A1bE7",
  56: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  97: "0xF2f9E62f52389EF223f5Fa8b9926e95386935277"
};

export const PVMWinContract : AddressesType = {
  1: "",
  3: "",
  4: "0xF53C8f2E5c3c4DfFD2793785f54B90C8D47c1B98",
  56: '0xf43A71e4Da398e5731c9580D11014dE5e8fD0530',
  97: '0x9AeE80A1df3cA0c5B859d94bCCf16d0440f1691d'
}

export const PVMPayBackContract : AddressesType = {
  1: "",
  3: "",
  4: "0x39F0889254Cb5a87075CB0147053cc2301061b9c",
  56: '0xf43A71e4Da398e5731c9580D11014dE5e8fD0530',
  97: '0x0F1cb2bB372edd39624bf1763FE4830DAFcf9139'
}

export const UniSwapV2Contract : AddressesType = {
  1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  3: '',
  4: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  56: '',
  97: '0xd99d1c33f9fc3444f8101754abc46c52416550d1'
}