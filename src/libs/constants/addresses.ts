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
      5: ZERO_ADDRESS,
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS
    },
    pairIndex: {
      1: '1',
      3: '1',
      4: '1',
      5: '0',
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
      5: '0x5cbb73B367FD69807381d06BC2041BEc86d8487d',
      56: "0x55d398326f99059ff775485246999027b3197955",
      97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc"
    },
    pairIndex: {
      1: '',
      3: '',
      4: '',
      5: '',
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
      5: "0x2E5963e4385Fc85B81B81A7146adC58236AF3f33",
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0x5Df87aE415206707fd52aDa20a5Eac2Ec70e8dbb"
    },
    pairIndex: {
      1: '',
      3: '',
      4: '',
      5: '',
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
      5: "0x48e5c876074549cD4Bb7be0800154450b59b1eB6",
      56: "0x46893c30fBDF3A5818507309c0BDca62eB3e1E6b",
      97: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B"
    },
    pairIndex: {
      1: "0",
      3: "0",
      4: "0",
      5: '1',
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
      1: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
      3: "",
      4: "0xE313F3f49B647fBEDDC5F2389Edb5c93CBf4EE25",
      5: "0xE2975bf674617bbCE57D2c72dCfC926716D8AC1F",
      56: "0x98f8669F6481EbB341B522fCD3663f79A3d1A6A7",
      97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE"
    },
    pairIndex: {
      1: "",
      3: "",
      4: "",
      5: '',
      56: '',
      97: ''
    },
    sigmaSQ: BigNumber.from('0')
  },
};

export const PVMOptionContract: AddressesType = {
  1: "0x10F7f08A278e495CBCa66388A2400fF0deFe3122",
  3: "",
  4: "0x57dffD238fFe2b4cDEE9460D52F71b804E96AfA7",
  5: "0xc4513DE545d02DC8F61D742530620CcFd0E977D8",
  56: "0x12858F7f24AA830EeAdab2437480277E92B0723a",
  97: "0x8bBd5db40F61C628a8F62ba75752227b1BFbF6a8"
};

export const PVMLeverContract: AddressesType = {
  1: "0x0E48e068958b3E683a664FB81697F7046f83C3A8",
  3: "0x48437856C4f6C3F60eA014110066BB440A4530D7",
  4: "0x56a07c76f6F91a97851013BF23ED8590070B656E",
  5: "0x3713Ac1FF40a191905D568E4Db65cb392474BCEC",
  56: "0x8e32C33814271bD64D5138bE9d47Cd55025074CD",
  97: "0xb8B5b3CDdC5DA7F4B75Bd4B408389b923962ee98"
};

export const NestPrice: AddressesType = {
  1: "0xE544cF993C7d477C7ef8E91D28aCA250D135aa03",
  3: "0x85723E83A7E7d88b0F3Ceb4C5bE7C853e3Ed8a82",
  4: "0xc08E6A853241B9a08225EECf93F3b279FA7A1bE7",
  5: "0x3948F9ec377110327dE3Fb8176C8Ed46296d76bA",
  56: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  97: "0xF2f9E62f52389EF223f5Fa8b9926e95386935277"
};

export const PVMWinContract : AddressesType = {
  1: "0x0ef5A21Aa062BA49c9c429b256d618d68FD2e008",
  3: "",
  4: "0xF53C8f2E5c3c4DfFD2793785f54B90C8D47c1B98",
  5: "0x6E9c56E319feb8050e6dB2E597eEaBE529fa84A2",
  56: '0xCA52f25f37d213CeD3dDE81a539e64464dEa8f3C',
  97: '0x9AeE80A1df3cA0c5B859d94bCCf16d0440f1691d'
}

export const PVMPayBackContract : AddressesType = {
  1: "0x7b65629A811eBB0d6CC99bDc4d1d606f8F707125",
  3: "",
  4: "0x39F0889254Cb5a87075CB0147053cc2301061b9c",
  5: "0xdA83DF38F34Cd4E8756827C185f7826C98Db97f0",
  56: '0x8AA36CF9CD7e88b63F32c53C66BFaDd409367B2f',
  97: '0xB82c97436C3ae453cd21Ef68Ec6900D2e0380Bcd'
}

export const UniSwapV2Contract : AddressesType = {
  1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  3: '',
  4: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  5: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  56: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  97: '0xd99d1c33f9fc3444f8101754abc46c52416550d1'
}

export const NESTNFTContract : AddressesType = {
  1: '',
  3: '',
  4: '',
  5: '',
  56: '',
  97: '0xc926b1dc291507A96c2919a3662Cc8EAC1141700'
}

export const NESTNFTAuctionContract : AddressesType = {
  1: '',
  3: '',
  4: '',
  5: '',
  56: '',
  97: '0xFe864063e10e5f7D99803765f28d2676A582A816'
}