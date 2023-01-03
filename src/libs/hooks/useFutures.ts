import { BigNumber, Contract } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PVMLeverContract, tokenList, TokenType } from "../constants/addresses";
import { BASE_2000ETH_AMOUNT, BASE_AMOUNT } from "../utils";
import { ERC20Contract, NestPriceContract, PVMLever } from "./useContract";
import useWeb3 from "./useWeb3";

const UPDATE_PRICE_TIME = 10;
const UPDATE_BALANCE_TIME = 60;
const TRIGGER_FEE = BigNumber.from("0");

export function useFutures() {
  const { chainId, account } = useWeb3();
  const [isLong, setIsLong] = useState(true);
  const [nestBalance, setNestBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [limit, setLimit] = useState(false);
  const [stop, setStop] = useState(false);
  const [isPositions, setIsPositions] = useState(true);
  const [nestInput, setNestInput] = useState<string>("");
  const [limitInput, setLimitInput] = useState<string>("");
  const [defaultLimit, setDefaultLimit] = useState<string>("");
  const [takeInput, setTakeInput] = useState<string>("");
  const [leverNum, setLeverNum] = useState<number>(1);
  const [tokenPair, setTokenPair] = useState<string>("ETH");
  const [kValue, setKValue] = useState<{ [key: string]: TokenType }>();
  const nestToken = ERC20Contract(tokenList["NEST"].addresses);

  const priceContract = NestPriceContract();
  const PVMLeverOJ = PVMLever(PVMLeverContract);

  const checkNESTBalance = () => {
    if (nestInput === "") {
      return false;
    }
    return parseUnits(nestInput, 18).gt(nestBalance || BigNumber.from("0"));
  };

  const getPriceAndK = async (
    contract: Contract,
    leverContract: Contract,
    token: TokenType,
    chainId: number
  ) => {
    const tokenNew = token;
    if (chainId === 56 || chainId === 97) {
      const basePriceList = await leverContract.listPrice(
        token.pairIndex[chainId],
        0,
        1,
        0
      );
      const baseK = parseUnits("0.002", 18);
      tokenNew.k = baseK;
      const priceValue = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(
        basePriceList[2]
      );
      tokenNew.nowPrice = priceValue;
    } else {
      const priceList = await contract.lastPriceList(
        0,
        token.pairIndex[chainId],
        2
      );
      const priceValue = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(priceList[1]);
      const k = await leverContract.calcRevisedK(
        token.sigmaSQ,
        BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(priceList[3]),
        priceList[2],
        priceValue,
        priceList[0]
      );
      tokenNew.k = k;
      tokenNew.nowPrice = priceValue;
    }
    return tokenNew;
  };
  const getPrice = useCallback(
    async (contract: Contract, leverContract: Contract, chainId: number) => {
      const ETH = await getPriceAndK(
        contract,
        leverContract,
        tokenList["ETH"],
        chainId
      );
      const BTC = await getPriceAndK(
        contract,
        leverContract,
        tokenList["BTC"],
        chainId
      );
      const tokenListNew = tokenList;
      tokenListNew["ETH"] = ETH;
      tokenListNew["BTC"] = BTC;
      setKValue(tokenListNew);
    },
    []
  );

  const tokenPrice = useMemo(() => {
    if (!kValue) {
      return {
        tokenName: tokenPair,
        leftIcon: tokenList[tokenPair].Icon,
        price: "---",
      };
    }

    return {
      tokenName: tokenPair,
      leftIcon: tokenList[tokenPair].Icon,
      price: parseFloat(
        formatUnits(kValue[tokenPair].nowPrice!, tokenList["USDT"].decimals)
      )
        .toFixed(2)
        .toString(),
    };
  }, [kValue, tokenPair]);

  const fee = useMemo(() => {
    if (nestInput === "") {
      return BigNumber.from("0");
    }
    const baseFee = parseUnits(nestInput, 18)
      .mul(BigNumber.from(leverNum.toString()))
      .mul(BigNumber.from("2"))
      .div(BigNumber.from("1000"));
    var limitFee = BigNumber.from("0");
    var triggerFee = BigNumber.from("0");
    if (limit) {
      limitFee = baseFee;
    }
    if (stop) {
      triggerFee = TRIGGER_FEE;
    }
    return baseFee.add(limitFee).add(triggerFee);
  }, [leverNum, limit, nestInput, stop]);

  const getBalance = useCallback(async () => {
    if (!nestToken) {
      return;
    }
    const balance = await nestToken.balanceOf(account);
    setNestBalance(balance);
  }, [account, nestToken]);

  // price
  useEffect(() => {
    if (!priceContract || !chainId || !PVMLeverOJ) {
      return;
    }
    getPrice(priceContract, PVMLeverOJ, chainId);
    const time = setInterval(() => {
      getPrice(priceContract, PVMLeverOJ, chainId);
    }, UPDATE_PRICE_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [chainId, priceContract, PVMLeverOJ, getPrice]);
  // balance
  useEffect(() => {
    getBalance();
    const time = setInterval(() => {
      getBalance();
    }, UPDATE_BALANCE_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getBalance]);
  // default limit
  useEffect(() => {
    setDefaultLimit(tokenPrice ? tokenPrice.price : "");
  }, [tokenPrice]);

  return {
    chainId,
    isLong,
    setIsLong,
    nestBalance,
    limit,
    setLimit,
    stop,
    setStop,
    isPositions,
    setIsPositions,
    nestInput,
    setNestInput,
    leverNum,
    setLeverNum,
    tokenPair,
    setTokenPair,
    limitInput,
    defaultLimit,
    setLimitInput,
    takeInput,
    setTakeInput,
    tokenPrice,
    checkNESTBalance,
    fee,
  };
}
