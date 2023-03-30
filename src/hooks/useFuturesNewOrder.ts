import {
  MIN_NEST_BIG_NUMBER,
  useNewBuyRequest,
  useNewBuyRequestWithUSDT,
} from "./../contracts/useFuturesBuyV2";
import { FuturesV2Contract } from "./../contracts/contractAddress";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance, {
  useReadTokenAllowance,
} from "../contracts/Read/useReadTokenContract";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import useNEST from "./useNEST";
import useTokenApprove from "../contracts/useTokenContract";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";
import useReadSwapAmountOut from "../contracts/Read/useReadSwapContract";
import { getQueryVariable } from "../lib/queryVaribale";
import { KOLTx } from "../lib/NESTRequest";

export const lipPrice = (
  balance: BigNumber,
  appends: BigNumber,
  lever: BigNumber,
  nowPrice: BigNumber,
  price: BigNumber,
  orientation: boolean
) => {
  if (
    BigNumber.from("0").eq(BigNumber.from(balance.toString())) ||
    BigNumber.from("0").eq(lever)
  ) {
    return BigNumber.from("0");
  }
  const i = BigNumber.from("1")
    .mul(balance)
    .mul(lever)
    .div(BigNumber.from("100"));
  const top = BigNumber.from(balance.toString()).add(appends).sub(i).mul(price);
  const bottom = BigNumber.from(balance.toString()).mul(lever);
  const subPrice = top.div(bottom);
  const result = orientation ? price.sub(subPrice) : price.add(subPrice);
  return BigNumber.from("0").gt(result) ? BigNumber.from("0") : result;
};

export const BASE_NEST_FEE = "15";
const NEW_ORDER_UPDATE = 30;
export const INPUT_TOKENS = ["NEST", "USDT"];

function useFuturesNewOrder(
  price: FuturesPrice | undefined,
  tokenPair: string
) {
  const { isPendingType } = usePendingTransactions();
  const { account, chainsData, setShowConnect } = useNEST();
  const [longOrShort, setLongOrShort] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [nestAmount, setNestAmount] = useState("");
  const [lever, setLever] = useState(1);
  const [limitAmount, setLimitAmount] = useState("");
  const [isStop, setIsStop] = useState(false);
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [inputToken, setInputToken] = useState<string>("NEST");
  const [inputAmount, setInputAmount] = useState("");

  const nowToken = useMemo(() => {
    const token = inputToken.getToken();
    if (chainsData.chainId && token) {
      return token.address[chainsData.chainId];
    }
  }, [chainsData.chainId, inputToken]);
  const tokenDecimals = useMemo(() => {
    const token = inputToken.getToken();
    if (token && chainsData.chainId) {
      return token.decimals[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId, inputToken]);
  const openPrice = useMemo(() => {
    const nestBigNumber = nestAmount.stringToBigNumber(18);
    if (price && nestBigNumber) {
      const nowPrice = price[tokenPair];
      if (parseFloat(nestAmount) >= 100000) {
        const c0_top = BigNumber.from("55560000")
          .mul(nestBigNumber)
          .mul(BigNumber.from(lever.toString()))
          .add(
            BigNumber.from("444400000000000").mul(BigNumber.from("10").pow(18))
          );
        const c0_long = BigNumber.from("10")
          .pow(36)
          .add(c0_top)
          .mul(nowPrice)
          .div(BigNumber.from("10").pow(36));
        const c0_Short = nowPrice
          .mul(BigNumber.from("10").pow(36))
          .div(c0_top.add(BigNumber.from("10").pow(36)));
        return longOrShort ? c0_long : c0_Short;
      } else {
        return nowPrice;
      }
    } else {
      return undefined;
    }
  }, [lever, longOrShort, nestAmount, price, tokenPair]);
  /**
   * uniswap out amount
   */
  const { uniSwapAmountOut } = useReadSwapAmountOut(
    (inputAmount === "" ? "1" : inputAmount).stringToBigNumber(tokenDecimals),
    [
      "USDT".getToken()!.address[chainsData.chainId ?? 56],
      "NEST".getToken()!.address[chainsData.chainId ?? 56],
    ]
  );
  const allValue = useCallback(
    (value: BigNumber) => {
      const top = BigNumber.from("1000").mul(
        value.sub(
          tabsValue === 1
            ? BASE_NEST_FEE.stringToBigNumber(18)!
            : BigNumber.from("0")
        )
      );
      const bottom = (lever + 1000) * 1;
      const nestNum = top.div(BigNumber.from(bottom.toString()));
      return nestNum.sub("0.1".stringToBigNumber(18)!);
    },
    [lever, tabsValue]
  );
  useEffect(() => {
    if (inputToken === "NEST") {
      setNestAmount(inputAmount);
    } else {
      if (inputAmount !== "" && uniSwapAmountOut) {
        setNestAmount(
          allValue(uniSwapAmountOut[1]).bigNumberToShowString(18, 4)
        );
      } else {
        setNestAmount("");
      }
    }
  }, [allValue, inputAmount, inputToken, uniSwapAmountOut]);

  /**
   * futures modal
   */
  const checkShowNotice = useMemo(() => {
    const isShow = localStorage.getItem("PerpetualsFirst");
    return isShow === "1" ? false : true;
  }, []);
  const [showProtocol, setShowProtocol] = useState(false);
  const [showedProtocol, setShowedProtocol] = useState(false);
  const checkShowTriggerNotice = useMemo(() => {
    const isShow = localStorage.getItem("TriggerRiskModal");
    return isShow === "1" ? false : true;
  }, []);
  const [showTriggerNotice, setShowTriggerNotice] = useState(false);
  const [showedTriggerNotice, setShowedTriggerNotice] = useState(false);
  /**
   * futures contract
   */
  const futureContract = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId];
    }
  }, [chainsData.chainId]);
  /**
   * allowance
   */
  const { allowance: tokenAllowance, allowanceRefetch: tokenAllowanceRefetch } =
    useReadTokenAllowance(
      (nowToken ?? String().zeroAddress) as `0x${string}`,
      account.address ?? "",
      futureContract
    );
  /**
   * balance
   */
  const { balance: tokenBalance, balanceOfRefetch: tokenBalanceRefetch } =
    useReadTokenBalance(
      (nowToken ?? String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );

  const fee = useMemo(() => {
    if (nestAmount === "") {
      return BigNumber.from("0");
    }
    const baseFee = nestAmount
      .stringToBigNumber(18)!
      .mul(BigNumber.from(lever.toString()))
      .mul(BigNumber.from("5"))
      .div(BigNumber.from("10000"));
    var limitFee = BigNumber.from("0");
    if (tabsValue === 1) {
      limitFee = BASE_NEST_FEE.stringToBigNumber(18) ?? BigNumber.from("0");
    }
    return baseFee.add(limitFee);
  }, [lever, nestAmount, tabsValue]);
  /**
   * check
   */
  const checkAllowance = useMemo(() => {
    const inputAmountNumber =
      inputAmount === ""
        ? BigNumber.from("0")
        : inputAmount.stringToBigNumber(18)!;
    if (tokenAllowance) {
      if (inputToken !== "NEST") {
        return inputAmountNumber.lte(tokenAllowance);
      } else {
        return fee.add(inputAmountNumber).lte(tokenAllowance);
      }
    } else {
      return true;
    }
  }, [fee, inputAmount, inputToken, tokenAllowance]);
  const checkBalance = useMemo(() => {
    const inputAmountNumber =
      inputAmount === ""
        ? BigNumber.from("0")
        : inputAmount.stringToBigNumber(18)!;

    if (tokenBalance) {
      if (inputToken !== "NEST") {
        return inputAmountNumber.lte(tokenBalance);
      } else {
        return fee.add(inputAmountNumber).lte(tokenBalance);
      }
    } else {
      return false;
    }
  }, [fee, inputAmount, inputToken, tokenBalance]);
  /**
   * action
   */
  const inputNESTTransaction = useMemo(() => {
    const amount = inputAmount.stringToBigNumber(4);
    if (checkAllowance && checkBalance && amount) {
      return amount;
    } else {
      return BigNumber.from("0");
    }
  }, [checkAllowance, checkBalance, inputAmount]);
  const basePrice = useMemo(() => {
    if (price) {
      if (tabsValue === 1) {
        return limitAmount.stringToBigNumber(18) ?? BigNumber.from("0");
      } else {
        const nowPrice = price[tokenPair];
        return nowPrice;
      }
    } else {
      return undefined;
    }
  }, [limitAmount, price, tabsValue, tokenPair]);
  const { transaction: tokenApprove } = useTokenApprove(
    (nowToken ?? String().zeroAddress) as `0x${string}`,
    futureContract,
    MaxUint256
  );
  const { transaction: newOrder } = useNewBuyRequest(
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    inputNESTTransaction,
    basePrice,
    tabsValue === 1,
    tp.stringToBigNumber(18) ?? BigNumber.from("0"),
    sl.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const USDTAmount = useMemo(() => {
    if (
      inputToken !== "USDT" ||
      !tokenDecimals ||
      !checkAllowance ||
      !checkBalance
    ) {
      return undefined;
    } else {
      return inputAmount.stringToBigNumber(tokenDecimals);
    }
  }, [checkAllowance, checkBalance, inputAmount, inputToken, tokenDecimals]);
  const showTotalPay = useMemo(() => {
    if (nestAmount !== "") {
      return fee
        .add(nestAmount.stringToBigNumber(18)!)
        .bigNumberToShowString(18, 2);
    }
    return fee.bigNumberToShowString(18, 2);
  }, [fee, nestAmount]);
  const USDTWithMinNEST = useMemo(() => {
    const NESTToBigNumber = showTotalPay.stringToBigNumber(18);
    return NESTToBigNumber
      ? NESTToBigNumber.sub(NESTToBigNumber.mul(1).div(1000))
      : undefined;
  }, [showTotalPay]);
  const { transaction: newOrderWithUSDT } = useNewBuyRequestWithUSDT(
    USDTAmount,
    USDTWithMinNEST,
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    basePrice,
    tabsValue === 1,
    tp.stringToBigNumber(18) ?? BigNumber.from("0"),
    sl.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  // count KOL Link with address
  useEffect(() => {
    let code = getQueryVariable("pt");
    if (
      code &&
      account.address &&
      chainsData.chainId !== 97 &&
      tabsValue === 1 &&
      (newOrder.data?.hash || newOrderWithUSDT.data?.hash)
    ) {
      if (newOrder.isSuccess || newOrderWithUSDT.isSuccess) {
        const hash = newOrder.data?.hash
          ? newOrder.data!.hash
          : newOrderWithUSDT.data!.hash;
        KOLTx({ kolLink: window.location.href, hash: hash });
      }
    }
  }, [
    account.address,
    chainsData.chainId,
    newOrder.data,
    newOrder.isSuccess,
    newOrderWithUSDT.data,
    newOrderWithUSDT.isSuccess,
    tabsValue,
  ]);
  /**
   * main button
   */
  const pending = useMemo(() => {
    return (
      isPendingType(TransactionType.futures_buy) ||
      isPendingType(TransactionType.approve)
    );
  }, [isPendingType]);

  const checkMinNEST = useMemo(() => {
    return (nestAmount.stringToBigNumber(4) ?? BigNumber.from("0")).lt(
      MIN_NEST_BIG_NUMBER
    );
  }, [nestAmount]);
  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return "Connect Wallet";
    } else if (!checkBalance) {
      return `Insufficient NEST balance`;
    } else if (checkAllowance) {
      if (nestAmount !== "" && checkMinNEST) {
        return "Minimum 50 NEST";
      } else {
        return `Open ${longOrShort ? "Long" : "Short"}`;
      }
    } else {
      return "Approve";
    }
  }, [
    account.address,
    checkAllowance,
    checkBalance,
    checkMinNEST,
    longOrShort,
    nestAmount,
  ]);
  const mainButtonLoading = useMemo(() => {
    if (
      tokenApprove.isLoading ||
      newOrder.isLoading ||
      newOrderWithUSDT.isLoading ||
      pending
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    newOrder.isLoading,
    newOrderWithUSDT.isLoading,
    pending,
    tokenApprove.isLoading,
  ]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    } else if (checkAllowance && checkMinNEST) {
      return true;
    } else if (
      tabsValue === 1 &&
      (checkMinNEST ||
        (limitAmount.stringToBigNumber(18) ?? BigNumber.from("0")).eq(
          BigNumber.from("0")
        ))
    ) {
      return true;
    }
    return !checkBalance;
  }, [
    account.address,
    checkAllowance,
    checkBalance,
    checkMinNEST,
    limitAmount,
    tabsValue,
  ]);
  const protocolCallBack = useCallback(() => {
    setShowedProtocol(true);
    tokenApprove.write?.();
  }, [tokenApprove]);
  const baseAction = useCallback(() => {
    if (inputToken === "USDT") {
      newOrderWithUSDT.write?.();
    } else {
      newOrder.write?.();
    }
  }, [inputToken, newOrder, newOrderWithUSDT]);
  const triggerNoticeCallback = useCallback(() => {
    setShowedTriggerNotice(true);
    baseAction();
  }, [baseAction]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonTitle === "Connect Wallet") {
      setShowConnect(true);
    } else if (mainButtonLoading || !checkBalance) {
      return;
    } else if (!checkAllowance) {
      if (checkShowNotice && !showedProtocol) {
        setShowProtocol(true);
        return;
      }
      tokenApprove.write?.();
    } else {
      if (tabsValue === 1 || isStop) {
        if (checkShowTriggerNotice && !showedTriggerNotice) {
          setShowTriggerNotice(true);
          return;
        }
      }
      baseAction();
    }
  }, [
    baseAction,
    checkAllowance,
    checkBalance,
    checkShowNotice,
    checkShowTriggerNotice,
    isStop,
    mainButtonLoading,
    mainButtonTitle,
    setShowConnect,
    showedProtocol,
    showedTriggerNotice,
    tabsValue,
    tokenApprove,
  ]);
  /**
   * show
   */
  const showToSwap = useMemo(() => {
    if (account.address && tokenBalance) {
      return BigNumber.from("0").eq(tokenBalance) ? true : false;
    } else {
      return false;
    }
  }, [account.address, tokenBalance]);
  const showBalance = useMemo(() => {
    if (account.address && tokenBalance) {
      return tokenBalance.bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBalance]);
  const showOpenPrice = useMemo(() => {
    if (openPrice) {
      return openPrice.bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [openPrice]);
  const showFee = useMemo(() => {
    if (tabsValue === 0 && isStop) {
      return fee
        .add(BASE_NEST_FEE.stringToBigNumber(18)!)
        .bigNumberToShowString(18, 2);
    }
    return fee.bigNumberToShowString(18, 2);
  }, [fee, isStop, tabsValue]);
  const showLiqPrice = useMemo(() => {
    if (!openPrice || nestAmount === "" || nestAmount === "0") {
      return String().placeHolder;
    }
    const nowPrice = openPrice;
    const result = lipPrice(
      nestAmount.stringToBigNumber(4) ?? BigNumber.from("0"),
      BigNumber.from("0"),
      BigNumber.from(lever.toString()),
      nowPrice,
      nowPrice,
      longOrShort
    );
    return result.bigNumberToShowString(18, 2) ?? String().placeHolder;
  }, [lever, longOrShort, nestAmount, openPrice]);
  const showFeeHoverText = useMemo(() => {
    if (tabsValue === 0 && !isStop) {
      return ["Position fee = Position*0.05%"];
    } else if (tabsValue === 1 && !isStop) {
      return ["Position fee = Position*0.05%", "Limit order fee = 15 NEST"];
    } else if (tabsValue === 0 && isStop) {
      return [
        "Position fee = Position*0.05%",
        "Stop order fee(after execution) = 15 NEST",
      ];
    } else {
      return [
        "Position fee = Position*0.05%",
        "Limit order fee = 15 NEST",
        "Stop order fee(after execution) = 15 NEST",
      ];
    }
  }, [isStop, tabsValue]);
  const showNESTPrice = useMemo(() => {
    const outAmount = uniSwapAmountOut
      ? uniSwapAmountOut[1].bigNumberToShowString(18, 2)
      : String().placeHolder;
    return `${inputAmount === "" ? "1" : inputAmount} USDT = ${
      nestAmount === "" ? outAmount : showTotalPay
    } NEST`;
  }, [inputAmount, nestAmount, showTotalPay, uniSwapAmountOut]);
  const showPositions = useMemo(() => {
    const nestAmountNumber = nestAmount.stringToBigNumber(18);
    if (nestAmountNumber && nestAmountNumber.gte(BigNumber.from("0"))) {
      return nestAmountNumber.mul(lever).bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [lever, nestAmount]);

  const maxCallBack = useCallback(() => {
    if (inputToken === "USDT" && tokenBalance) {
      setInputAmount(
        tokenBalance
          .sub("0.1".stringToBigNumber(18)!)
          .bigNumberToShowString(18, 2)
          .formatInputNum4()
      );
    } else {
      if (tokenBalance) {
        setInputAmount(
          allValue(tokenBalance).bigNumberToShowString(18, 2).formatInputNum4()
        );
      }
    }
  }, [inputToken, tokenBalance, allValue]);

  /**
   * update
   */
  useEffect(() => {
    const time = setInterval(() => {
      tokenAllowanceRefetch();
      tokenBalanceRefetch();
    }, NEW_ORDER_UPDATE * 1000);
    return () => {
      clearInterval(time);
    };
  }, [tokenAllowanceRefetch, tokenBalanceRefetch]);
  useEffect(() => {
    setTimeout(() => {
      tokenAllowanceRefetch();
      tokenBalanceRefetch();
    }, 3000);
  }, [tokenAllowanceRefetch, tokenBalanceRefetch, pending]);

  return {
    longOrShort,
    setLongOrShort,
    tabsValue,
    setTabsValue,
    showToSwap,
    lever,
    setLever,
    limitAmount,
    setLimitAmount,
    isStop,
    setIsStop,
    tp,
    setTp,
    sl,
    setSl,
    showBalance,
    maxCallBack,
    showFeeHoverText,
    showOpenPrice,
    showFee,
    showTotalPay,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    checkBalance,
    showLiqPrice,
    showProtocol,
    setShowProtocol,
    protocolCallBack,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    inputToken,
    setInputToken,
    inputAmount,
    setInputAmount,
    showNESTPrice,
    showPositions,
    tokenAllowance,
    tokenApprove,
  };
}

export default useFuturesNewOrder;
