import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesPrice } from "../pages/Futures/Futures";
import useNEST from "./useNEST";
import { getQueryVariable } from "../lib/queryVaribale";
import { KOLTx, serviceOpen } from "../lib/NESTRequest";
import { t } from "@lingui/macro";
import useService from "../contracts/useService";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "./useTransactionReceipt";
import { SnackBarType } from "../components/SnackBar/NormalSnackBar";

export const MIN_NEST_BIG_NUMBER = BigNumber.from("500000");

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

export const INPUT_TOKENS = ["NEST"];

function addPricePoint(price: BigNumber, isLong: boolean) {
  const priceBigNumber = BigNumber.from(price.toString());
  if (isLong) {
    return priceBigNumber.add(priceBigNumber.mul(1).div(100));
  } else {
    return priceBigNumber.sub(priceBigNumber.mul(1).div(100));
  }
}

function useFuturesNewOrder(
  price: FuturesPrice | undefined,
  tokenPair: string,
  updateList: () => void
) {
  const { account, chainsData, setShowConnect, signature } = useNEST();
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
  const [tokenBalance, setTokenBalance] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(false);
  const { service_balance } = useService();
  const { addTransactionNotice } = usePendingTransactionsBase();
  const [showDeposit, setShowDeposit] = useState(false);
  // const nowToken = useMemo(() => {
  //   const token = inputToken.getToken();
  //   if (chainsData.chainId && token) {
  //     return token.address[chainsData.chainId];
  //   }
  // }, [chainsData.chainId, inputToken]);
  const openPriceBase = useMemo(() => {
    if (price) {
      const nowPrice = price[tokenPair];
      return nowPrice;
    } else {
      return undefined;
    }
  }, [price, tokenPair]);
  const openPrice = useMemo(() => {
    const nestBigNumber = nestAmount.stringToBigNumber(18);
    if (openPriceBase && nestBigNumber) {
      const nowPrice = openPriceBase;
      if (parseFloat(nestAmount) * lever >= 0) {
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
  }, [lever, longOrShort, nestAmount, openPriceBase]);
  /**
   * uniswap out amount
   */
  const allValue = useCallback(
    (value: BigNumber) => {
      const top = BigNumber.from("1000").mul(value);
      const bottom = (lever + 1000) * 1;
      const nestNum = top.div(BigNumber.from(bottom.toString()));
      return nestNum.sub("0.1".stringToBigNumber(18)!);
    },
    [lever]
  );
  useEffect(() => {
    setNestAmount(inputAmount);
  }, [inputAmount]);

  /**
   * futures modal
   */
  const checkShowTriggerNotice = useMemo(() => {
    const isShow = localStorage.getItem("TriggerRiskModal");
    return isShow === "1" ? false : true;
  }, []);
  const [showTriggerNotice, setShowTriggerNotice] = useState(false);
  const [showedTriggerNotice, setShowedTriggerNotice] = useState(false);
  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      const balance_bigNumber = result.toString().stringToBigNumber(18);
      setTokenBalance(balance_bigNumber ?? BigNumber.from("0"));
    });
  }, [service_balance]);

  const fee = useMemo(() => {
    if (nestAmount === "") {
      return BigNumber.from("0");
    }
    const baseFee = nestAmount
      .stringToBigNumber(18)!
      .mul(BigNumber.from(lever.toString()))
      .mul(BigNumber.from("5"))
      .div(BigNumber.from("10000"));
    return baseFee;
  }, [lever, nestAmount]);
  /**
   * check
   */
  const checkBalance = useMemo(() => {
    const inputAmountNumber =
      inputAmount === ""
        ? BigNumber.from("0")
        : inputAmount.stringToBigNumber(18)!;

    if (tokenBalance) {
      return fee.add(inputAmountNumber).lte(tokenBalance);
    } else {
      return false;
    }
  }, [fee, inputAmount, tokenBalance]);
  /**
   * action
   */
  const basePrice = useMemo(() => {
    if (openPriceBase) {
      if (tabsValue === 1) {
        return limitAmount.stringToBigNumber(18) ?? BigNumber.from("0");
      } else {
        const nowPrice = openPriceBase;
        return addPricePoint(nowPrice, longOrShort);
      }
    } else {
      return undefined;
    }
  }, [limitAmount, longOrShort, openPriceBase, tabsValue]);

  const open = useCallback(async () => {
    if (chainsData.chainId && account.address && basePrice && signature) {
      const orderPrice = basePrice.bigNumberToShowString(18, 5);
      const openBase: { [key: string]: any } = await serviceOpen(
        chainsData.chainId,
        account.address,
        longOrShort,
        lever,
        tabsValue === 1,
        Number(inputAmount),
        Number(orderPrice),
        `${tokenPair}/USDT`,
        Number(sl),
        Number(tp),
        { Authorization: signature.signature }
      );
      if (Number(openBase["errorCode"]) === 0) {
        getBalance();
        KOLTx({
          kolLink: window.location.href,
          hash: "",
          positionIndex: openBase["value"],
        });
        updateList();
      }
      addTransactionNotice({
        type: TransactionType.futures_buy,
        info: "",
        result:
          Number(openBase["errorCode"]) === 0
            ? SnackBarType.success
            : SnackBarType.fail,
      });
    }
    setLoading(false);
  }, [
    account.address,
    addTransactionNotice,
    basePrice,
    chainsData.chainId,
    getBalance,
    inputAmount,
    lever,
    longOrShort,
    signature,
    sl,
    tabsValue,
    tokenPair,
    tp,
    updateList,
  ]);
  const showTotalPay = useMemo(() => {
    if (nestAmount !== "") {
      return fee
        .add(nestAmount.stringToBigNumber(18)!)
        .bigNumberToShowString(18, 2);
    }
    return fee.bigNumberToShowString(18, 2);
  }, [fee, nestAmount]);
  /**
   * main button
   */
  const checkMinNEST = useMemo(() => {
    return (nestAmount.stringToBigNumber(4) ?? BigNumber.from("0")).lt(
      MIN_NEST_BIG_NUMBER
    );
  }, [nestAmount]);
  const tpError = useMemo(() => {
    if (
      tp !== "" &&
      !BigNumber.from("0").eq(tp.stringToBigNumber(18) ?? BigNumber.from("0"))
    ) {
      return longOrShort
        ? Number(tp) < Number(limitAmount)
        : Number(tp) > Number(limitAmount);
    }
    return false;
  }, [limitAmount, longOrShort, tp]);
  const slError = useMemo(() => {
    if (
      sl !== "" &&
      !BigNumber.from("0").eq(sl.stringToBigNumber(18) ?? BigNumber.from("0"))
    ) {
      return longOrShort
        ? Number(sl) > Number(limitAmount)
        : Number(sl) < Number(limitAmount);
    }
    return false;
  }, [limitAmount, longOrShort, sl]);
  const stopDis = useMemo(() => {
    return isStop && (tpError || slError);
  }, [isStop, slError, tpError]);
  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return t`Connect Wallet`;
    } else {
      return `${t`Open`} ${longOrShort ? t`Long` : t`Short`}`;
    }
  }, [account.address, longOrShort]);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    } else if (checkMinNEST) {
      return true;
    } else if (stopDis) {
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
    checkBalance,
    checkMinNEST,
    limitAmount,
    stopDis,
    tabsValue,
  ]);
  const baseAction = useCallback(() => {
    setLoading(true);
    open();
  }, [open]);
  const triggerNoticeCallback = useCallback(() => {
    setShowedTriggerNotice(true);
    baseAction();
  }, [baseAction]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonTitle === t`Connect Wallet`) {
      setShowConnect(true);
    } else if (mainButtonLoading || !checkBalance || stopDis) {
      return;
    } else {
      if (checkShowTriggerNotice && !showedTriggerNotice) {
        setShowTriggerNotice(true);
        return;
      }
      baseAction();
    }
  }, [
    baseAction,
    checkBalance,
    checkShowTriggerNotice,
    mainButtonLoading,
    mainButtonTitle,
    setShowConnect,
    showedTriggerNotice,
    stopDis,
  ]);
  const lastPriceButton = useCallback(() => {
    if (openPriceBase) {
      setLimitAmount(
        openPriceBase.bigNumberToShowString(
          18,
          tokenPair.getTokenPriceDecimals()
        )
      );
    }
  }, [openPriceBase, tokenPair]);

  /**
   * share order
   */
  const [isShareLink, setIsShareLink] = useState<boolean>(false);
  const [hasShowShareLink, setHadShowShareLink] = useState<boolean>(false);
  const tokenName_info = useMemo(() => {
    return getQueryVariable("pt");
  }, []);
  const orientation_info = useMemo(() => {
    return getQueryVariable("po") === "0" ? false : true;
  }, []);
  const lever_info = useMemo(() => {
    return getQueryVariable("pl");
  }, []);
  const basePrice_info = useMemo(() => {
    return getQueryVariable("pp");
  }, []);
  const tp_info = useMemo(() => {
    return getQueryVariable("pst");
  }, []);
  const sl_info = useMemo(() => {
    return getQueryVariable("psl");
  }, []);
  useEffect(() => {
    if (
      lever_info &&
      basePrice_info &&
      tp_info &&
      sl_info &&
      !hasShowShareLink
    ) {
      const tokenPriceDecimals = tokenPair.getTokenPriceDecimals();
      setTabsValue(1);
      setLongOrShort(orientation_info);
      setLever(parseInt(lever_info));
      setLimitAmount(
        (parseFloat(basePrice_info) / Math.pow(10, tokenPriceDecimals)).toFixed(
          tokenPriceDecimals
        )
      );
      if (parseInt(tp_info) > 0 || parseInt(sl_info) > 0) {
        setIsStop(true);
        if (parseInt(tp_info) > 0) {
          setTp(
            (parseFloat(tp_info) / Math.pow(10, tokenPriceDecimals)).toFixed(
              tokenPriceDecimals
            )
          );
        }
        if (parseInt(sl_info) > 0) {
          setSl(
            (parseFloat(sl_info) / Math.pow(10, tokenPriceDecimals)).toFixed(
              tokenPriceDecimals
            )
          );
        }
      }
      setIsShareLink(true);
      setHadShowShareLink(true);
    }
  }, [
    basePrice_info,
    hasShowShareLink,
    lever_info,
    orientation_info,
    sl_info,
    tokenPair,
    tp_info,
  ]);

  useEffect(() => {
    if (isShareLink) {
      if (chainsData.chainId !== 534353) {
        setInputToken("NEST");
        setInputAmount("10000");
      } else {
        setInputToken("NEST");
        setInputAmount("100");
      }
    }
  }, [chainsData.chainId, isShareLink]);
  /**
   * show
   */
  const showBalance = useMemo(() => {
    if (account.address && tokenBalance) {
      return tokenBalance.bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBalance]);
  const showOpenPrice = useMemo(() => {
    if (openPriceBase) {
      return openPriceBase.bigNumberToShowPrice(
        18,
        tokenPair.getTokenPriceDecimals()
      );
    } else {
      return String().placeHolder;
    }
  }, [openPriceBase, tokenPair]);
  const showFee = useMemo(() => {
    return fee.bigNumberToShowString(18, 2);
  }, [fee]);
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
    return (
      result.bigNumberToShowPrice(18, tokenPair.getTokenPriceDecimals()) ??
      String().placeHolder
    );
  }, [lever, longOrShort, nestAmount, openPrice, tokenPair]);
  const showFeeHoverText = useMemo(() => {
    if (tabsValue === 0 && !isStop) {
      return [t`Position fee = Position * 0.05%`];
    } else if (tabsValue === 1 && !isStop) {
      return [t`Position fee = Position * 0.05%`, t`Limit order fee = 15 NEST`];
    } else if (tabsValue === 0 && isStop) {
      return [t`Position fee = Position * 0.05%`];
    } else {
      return [t`Position fee = Position * 0.05%`, t`Limit order fee = 15 NEST`];
    }
  }, [isStop, tabsValue]);
  const showPositions = useMemo(() => {
    const nestAmountNumber = nestAmount.stringToBigNumber(18);
    if (nestAmountNumber && nestAmountNumber.gte(BigNumber.from("0"))) {
      return nestAmountNumber.mul(lever).bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [lever, nestAmount]);
  const showAmountError = useMemo(() => {
    if (checkMinNEST) {
      return t`Minimum 50 NEST`;
    } else if (!checkBalance) {
      return t`Insufficient NEST balance`;
    } else {
      return undefined;
    }
  }, [checkBalance, checkMinNEST]);

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

  const tpDefault = useMemo(() => {
    if (tabsValue === 0) {
      return longOrShort ? t`> MARKET PRICE` : t`< MARKET PRICE`;
    } else {
      return longOrShort ? t`> LIMIT PRICE` : t`< LIMIT PRICE`;
    }
  }, [longOrShort, tabsValue]);
  const slDefault = useMemo(() => {
    if (tabsValue === 0) {
      return longOrShort ? t`< MARKET PRICE` : t`> MARKET PRICE`;
    } else {
      return longOrShort ? t`< LIMIT PRICE` : t`> LIMIT PRICE`;
    }
  }, [longOrShort, tabsValue]);
  const stopErrorText = useMemo(() => {
    if (tabsValue === 0) {
      return t`TP and SL price you set will trigger immediately.`;
    } else {
      return t`After the limit order is executed, TP and SL price you set will trigger immediately.`;
    }
  }, [tabsValue]);

  /**
   * update
   */
  useEffect(() => {
    getBalance();
    const time = setInterval(() => {
      getBalance();
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getBalance]);

  const [hadSetLimit, setHadSetLimit] = useState(false);
  useEffect(() => {
    if (limitAmount === "" && !hadSetLimit && openPriceBase) {
      setLimitAmount(
        openPriceBase.bigNumberToShowString(
          18,
          tokenPair.getTokenPriceDecimals()
        )
      );
      setHadSetLimit(true);
    } else if (limitAmount !== "" && !hadSetLimit) {
      setHadSetLimit(true);
    }
  }, [hadSetLimit, limitAmount, openPriceBase, tokenPair]);
  const closeShareLink = useCallback(() => {
    if (isShareLink) {
      setIsShareLink(false);
    }
  }, [isShareLink]);
  useEffect(() => {
    if (tokenName_info !== tokenPair) {
      setLimitAmount("");
      setTp("");
      setSl("");
      closeShareLink();
      setHadSetLimit(false);
    }
  }, [closeShareLink, tokenName_info, tokenPair]);

  const changeTabs = useCallback((value: number) => {
    setTabsValue(value);
  }, []);

  return {
    longOrShort,
    setLongOrShort,
    tabsValue,
    changeTabs,
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
    checkMinNEST,
    showLiqPrice,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    inputToken,
    inputAmount,
    setInputAmount,
    showPositions,
    showAmountError,
    tpDefault,
    slDefault,
    tpError,
    slError,
    lastPriceButton,
    stopErrorText,
    isShareLink,
    closeShareLink,
    showDeposit,
    setShowDeposit,
  };
}

export default useFuturesNewOrder;
