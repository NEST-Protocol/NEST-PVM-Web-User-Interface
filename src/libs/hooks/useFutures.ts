import {
  PVMFuturesContract,
  PVMFuturesProxyContract,
} from "./../constants/addresses";
import { BigNumber, Contract } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import { usePVMFuturesBuy2 } from "../../contracts/hooks/usePVMFutures";
import { usePVMFuturesProxyNew } from "../../contracts/hooks/usePVMFuturesProxy";
import { tokenList, TokenType } from "../constants/addresses";
import { BASE_2000ETH_AMOUNT, BASE_AMOUNT, ZERO_ADDRESS } from "../utils";
import {
  ERC20Contract,
  NestPriceContract,
  PVMFutures,
  PVMFuturesProxy,
} from "./useContract";
import { MaxUint256 } from "@ethersproject/constants";
import useWeb3 from "./useWeb3";
import useTransactionListCon, { TransactionType } from "./useTransactionInfo";

export type OrderView = {
  index: BigNumber;
  owner: string;
  balance: BigNumber;
  tokenIndex: BigNumber;
  baseBlock: BigNumber;
  lever: BigNumber;
  orientation: boolean;
  basePrice: BigNumber;
  stopPrice: BigNumber;
};
export type LimitOrderView = {
  index: BigNumber;
  owner: string;
  tokenIndex: BigNumber;
  lever: BigNumber;
  orientation: boolean;
  limitPrice: BigNumber;
  stopPrice: BigNumber;
  balance: BigNumber;
  fee: BigNumber;
  stopFee: BigNumber;
  status: BigNumber;
};

const UPDATE_PRICE_TIME = 10;
const UPDATE_LIST_TIME = 60;
const UPDATE_BALANCE_TIME = 60;
const TRIGGER_FEE = BigNumber.from("0");

export function useFutures() {
  const { chainId, account } = useWeb3();
  const [isLong, setIsLong] = useState(true);
  const [nestBalance, setNestBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [nestAllowance, setNestAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [nestAllowance2, setNestAllowance2] = useState<BigNumber>(
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
  const [orderList, setOrderList] = useState<Array<OrderView>>([]);
  const [limitOrderList, setLimitOrderList] = useState<Array<LimitOrderView>>(
    []
  );
  const { pendingList, txList } = useTransactionListCon();
  const nestToken = ERC20Contract(tokenList["NEST"].addresses);

  const priceContract = NestPriceContract();
  const PVMFuturesOJ = PVMFutures();
  const PVMFuturesProxyOJ = PVMFuturesProxy();

  const checkNESTBalance = () => {
    if (nestInput === "") {
      return true;
    }
    return parseUnits(nestInput, 18)
      .add(fee)
      .lte(nestBalance || BigNumber.from("0"));
  };
  const checkAllowance = () => {
    if (!nestInput) {
      return true;
    }
    if (limit) {
      return parseUnits(nestInput, 18).add(fee).lte(nestAllowance2);
    } else {
      return parseUnits(nestInput, 18).add(fee).lte(nestAllowance);
    }
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
  const getOrderList = useCallback(async () => {
    if (!PVMFuturesOJ || !account) {
      return;
    }
    const list: Array<OrderView> = await PVMFuturesOJ.find2("0", "500", "500", account);
    const result = list.filter((item) => {
      return item.owner.toLocaleLowerCase() !== ZERO_ADDRESS
    })
    setOrderList(result);
  }, [PVMFuturesOJ, account]);
  const getLimitOrderList = useCallback(async () => {
    if (!PVMFuturesProxyOJ || !account) {
      return;
    }
    const list: Array<LimitOrderView> = await PVMFuturesProxyOJ.find("0", "500", "500", account);
    const result = list.filter((item) => {
      return item.owner.toLocaleLowerCase() !== ZERO_ADDRESS
    })
    setLimitOrderList(result);
  }, [PVMFuturesProxyOJ, account]);

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
  const getAllowance = useCallback(async () => {
    if (!nestToken || !chainId) {
      return;
    }
    const allowance1 = await nestToken.allowance(
      account,
      PVMFuturesContract[chainId]
    );
    const allowance2 = await nestToken.allowance(
      account,
      PVMFuturesProxyContract[chainId]
    );
    setNestAllowance(allowance1);
    setNestAllowance2(allowance2);
  }, [account, chainId, nestToken]);

  // price
  useEffect(() => {
    if (!priceContract || !chainId || !PVMFuturesOJ) {
      return;
    }
    getPrice(priceContract, PVMFuturesOJ, chainId);
    const time = setInterval(() => {
      getPrice(priceContract, PVMFuturesOJ, chainId);
    }, UPDATE_PRICE_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [chainId, priceContract, PVMFuturesOJ, getPrice, txList]);
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
  // approve
  useEffect(() => {
    getAllowance();
  }, [getAllowance, txList]);
  // default limit
  useEffect(() => {
    if (tokenPrice && tokenPrice.price === "---") {
      return;
    }
    setDefaultLimit(tokenPrice.price);
  }, [tokenPrice, txList]);
  // list
  useEffect(() => {
    getOrderList();
    getLimitOrderList();
    const time = setInterval(() => {
      getOrderList();
      getLimitOrderList();
    }, UPDATE_LIST_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getLimitOrderList, getOrderList]);

  // action
  const buy1 = usePVMFuturesBuy2(
    tokenList[tokenPair],
    BigNumber.from(leverNum.toString()),
    isLong,
    parseUnits(nestInput === "" ? "0" : nestInput, 4),
    parseUnits(takeInput === "" ? "0" : takeInput, 18)
  );
  const buy2 = usePVMFuturesProxyNew(
    tokenList[tokenPair],
    BigNumber.from(leverNum.toString()),
    isLong,
    parseUnits(nestInput === "" ? "0" : nestInput, 4),
    parseUnits(
      limitInput === ""
        ? defaultLimit === ""
          ? "0"
          : defaultLimit
        : limitInput,
      18
    ),
    parseUnits(takeInput === "" ? "0" : takeInput, 18)
  );
  const approveToPVMFutures = useERC20Approve(
    "NEST",
    MaxUint256,
    chainId ? PVMFuturesContract[chainId] : undefined
  );
  const approveToPVMFuturesProxy = useERC20Approve(
    "NEST",
    MaxUint256,
    chainId ? PVMFuturesProxyContract[chainId] : undefined
  );

  // mainButton
  const mainButtonTitle = () => {
    const longOrShort = isLong ? "Long" : "Short";
    return checkAllowance() ? `Open ${longOrShort}` : "Approve";
  };
  const mainButtonDis = () => {
    if (mainButtonLoading()) {
      return true;
    }
    if (!checkAllowance()) {
      return false;
    }
    if (nestInput === "") {
      return true;
    }
  };
  const mainButtonAction = () => {
    if (mainButtonDis()) {
      return;
    }
    if (!checkAllowance()) {
      if (limit) {
        approveToPVMFuturesProxy();
      } else {
        approveToPVMFutures();
      }
      return;
    }
    if (limit) {
      buy2();
    } else {
      buy1();
    }
  };
  const mainButtonLoading = () => {
    const pendingTransaction = pendingList.filter(
      (item) =>
        item.type === TransactionType.buyLever ||
        item.type === TransactionType.approve ||
        item.type === TransactionType.PVMFuturesProxyNew
    );
    return pendingTransaction.length > 0 ? true : false;
  };

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
    mainButtonTitle,
    mainButtonDis,
    mainButtonAction,
    mainButtonLoading,
    orderList,
    limitOrderList, 
    kValue,
  };
}

export function useFuturesOrderList(order: OrderView, kValue?: { [key: string]: TokenType }) {
  const { chainId } = useWeb3();
  const [marginAssets, setMarginAssets] = useState<BigNumber>();

  const PVMFuturesOJ = PVMFutures();

  const tokenName = useCallback(() => {
    if (!chainId) {return}
    const tokenArray = [tokenList["ETH"], tokenList["BTC"]]
    const thisToken = tokenArray.filter((item) => {
        return item.pairIndex[chainId] === order.tokenIndex.toString()
    })
    if (thisToken[0].addresses[chainId] === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [chainId, order.tokenIndex]);
  const orderValue = useCallback(async() => {
    if (!tokenName() || !kValue || !PVMFuturesOJ) {return}
    const price = kValue[tokenName()!].nowPrice
    const value = await PVMFuturesOJ.valueOf2(
      order.index,
      price
    );
    setMarginAssets(value);
  }, [PVMFuturesOJ, kValue, order.index, tokenName])

  const showMarginAssets = () => {
    return marginAssets ? parseFloat(formatUnits(marginAssets, 18)).toFixed(2).toString() : "---"
  }
  const showBalance = () => {
    return parseFloat(formatUnits(order.balance, 4)).toFixed(2).toString()
  }
  const showBasePrice = () => {
    return parseFloat(formatUnits(order.basePrice, 18)).toFixed(2).toString()
  }
  const TokenOneSvg = tokenList[tokenName() ?? "ETH"].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;

  useEffect(() => {
    orderValue()
  }, [orderValue])

  return {TokenOneSvg, TokenTwoSvg, showBalance, showBasePrice, showMarginAssets}
}

export function useFuturesLimitOrderList(order: LimitOrderView) {
  const { chainId } = useWeb3();
  const tokenName = useCallback(() => {
    if (!chainId) {return}
    const tokenArray = [tokenList["ETH"], tokenList["BTC"]]
    const thisToken = tokenArray.filter((item) => {
        return item.pairIndex[chainId] === order.tokenIndex.toString()
    })
    if (thisToken[0].addresses[chainId] === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [chainId, order.tokenIndex]);
  const showBalance = () => {
    return parseFloat(formatUnits(order.balance, 4)).toFixed(2).toString()
  }
  const showLimitPrice = () => {
    return parseFloat(formatUnits(order.limitPrice, 18)).toFixed(2).toString()
  }
  const TokenOneSvg = tokenList[tokenName() ?? "ETH"].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;

  return {TokenOneSvg, TokenTwoSvg, showBalance, showLimitPrice}
}
