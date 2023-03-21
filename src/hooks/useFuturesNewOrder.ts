import {
  MIN_NEST_BIG_NUMBER,
  useFuturesBuyWithUSDT,
  useFuturesNewTrustOrderWithUSDT,
} from "./../contracts/useFuturesBuy";
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
import useFuturesBuy, {
  useFuturesBuyWithStopOrder,
  useFuturesNewTrustOrder,
} from "../contracts/useFuturesBuy";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";
import useReadSwapAmountOut from "../contracts/Read/useReadSwapContract";

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
    .mul(nowPrice)
    .div(BigNumber.from("100").mul(price))
    .add(BigNumber.from("150000"));
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
  /**
   * action
   */
  const { transaction: tokenApprove } = useTokenApprove(
    (nowToken ?? String().zeroAddress) as `0x${string}`,
    futureContract,
    MaxUint256
  );
  const { transaction: buyTransaction } = useFuturesBuy(
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    inputAmount.stringToBigNumber(4) ?? BigNumber.from("0")
  );
  const { transaction: buyWithStop } = useFuturesBuyWithStopOrder(
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    inputAmount.stringToBigNumber(4) ?? BigNumber.from("0"),
    tp.stringToBigNumber(18) ?? BigNumber.from("0"),
    sl.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const { transaction: newTrustOrder } = useFuturesNewTrustOrder(
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    inputAmount.stringToBigNumber(4) ?? BigNumber.from("0"),
    limitAmount.stringToBigNumber(18) ?? BigNumber.from("0"),
    tp.stringToBigNumber(18) ?? BigNumber.from("0"),
    sl.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const USDTAmount = useMemo(() => {
    if (inputToken !== "USDT" && !tokenDecimals) {
      return undefined;
    } else {
      return inputAmount.stringToBigNumber(tokenDecimals);
    }
  }, [inputAmount, inputToken, tokenDecimals]);
  const fee = useMemo(() => {
    if (nestAmount === "") {
      return BigNumber.from("0");
    }
    const baseFee = nestAmount
      .stringToBigNumber(18)!
      .mul(BigNumber.from(lever.toString()))
      .mul(BigNumber.from("1"))
      .div(BigNumber.from("1000"));
    var limitFee = BigNumber.from("0");
    if (tabsValue === 1) {
      limitFee = BASE_NEST_FEE.stringToBigNumber(18) ?? BigNumber.from("0");
    }
    return baseFee.add(limitFee);
  }, [lever, nestAmount, tabsValue]);
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
  const { transaction: buyWithUSDT } = useFuturesBuyWithUSDT(
    USDTAmount,
    USDTWithMinNEST,
    BigNumber.from(priceToken.indexOf(tokenPair).toString()),
    BigNumber.from(lever.toString()),
    longOrShort,
    tp.stringToBigNumber(18) ?? BigNumber.from("0"),
    sl.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const { transaction: newTrustOrderWithUSDT } =
    useFuturesNewTrustOrderWithUSDT(
      USDTAmount,
      USDTWithMinNEST,
      BigNumber.from(priceToken.indexOf(tokenPair).toString()),
      BigNumber.from(lever.toString()),
      longOrShort,
      limitAmount.stringToBigNumber(18) ?? BigNumber.from("0"),
      tp.stringToBigNumber(18) ?? BigNumber.from("0"),
      sl.stringToBigNumber(18) ?? BigNumber.from("0")
    );
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
   * main button
   */
  const pending = useMemo(() => {
    return (
      isPendingType(TransactionType.futures_buy) ||
      isPendingType(TransactionType.futures_buyWithStopOrder) ||
      isPendingType(TransactionType.futures_newTrustOrder) ||
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
      buyTransaction.isLoading ||
      buyWithStop.isLoading ||
      newTrustOrder.isLoading ||
      pending
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    buyTransaction.isLoading,
    buyWithStop.isLoading,
    newTrustOrder.isLoading,
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
      if (tabsValue === 1) {
        newTrustOrderWithUSDT.write?.();
      } else {
        buyWithUSDT.write?.();
      }
    } else {
      if (tabsValue === 1) {
        newTrustOrder.write?.();
      } else if (isStop) {
        buyWithStop.write?.();
      } else {
        buyTransaction.write?.();
      }
    }
  }, [
    buyTransaction,
    buyWithStop,
    buyWithUSDT,
    inputToken,
    isStop,
    newTrustOrder,
    newTrustOrderWithUSDT,
    tabsValue,
  ]);
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
    if (price) {
      return price[tokenPair].bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [price, tokenPair]);
  const showFee = useMemo(() => {
    if (tabsValue === 0 && isStop) {
      return fee
        .add(BASE_NEST_FEE.stringToBigNumber(18)!)
        .bigNumberToShowString(18, 2);
    }
    return fee.bigNumberToShowString(18, 2);
  }, [fee, isStop, tabsValue]);
  const showLiqPrice = useMemo(() => {
    if (!price || nestAmount === "" || nestAmount === "0") {
      return String().placeHolder;
    }
    const nowPrice = price[tokenPair];
    const result = lipPrice(
      nestAmount.stringToBigNumber(4) ?? BigNumber.from("0"),
      BigNumber.from("0"),
      BigNumber.from(lever.toString()),
      nowPrice,
      nowPrice,
      longOrShort
    );
    return result.bigNumberToShowString(18, 2) ?? String().placeHolder;
  }, [lever, longOrShort, nestAmount, price, tokenPair]);
  const showFeeHoverText = useMemo(() => {
    if (tabsValue === 0 && !isStop) {
      return ["Position fee = Position*0.1%"];
    } else if (tabsValue === 1 && !isStop) {
      return ["Position fee = Position*0.1%", "Limit order fee = 15 NEST"];
    } else if (tabsValue === 0 && isStop) {
      return [
        "Position fee = Position*0.1%",
        "Stop order fee(after execution) = 15 NEST",
      ];
    } else {
      return [
        "Position fee = Position*0.1%",
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
      );
    } else {
      if (tokenBalance) {
        setInputAmount(allValue(tokenBalance).bigNumberToShowString(18, 2));
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