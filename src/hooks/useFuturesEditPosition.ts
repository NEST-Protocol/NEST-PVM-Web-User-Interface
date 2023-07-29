import { useCallback, useMemo, useState } from "react";
import { FuturesOrderService } from "../pages/Futures/OrderList";

import { BigNumber } from "ethers";
import { lipPrice } from "./useFuturesNewOrder";
import { FuturesPrice } from "../pages/Futures/Futures";
import { t } from "@lingui/macro";
import { serviceUpdateStopPrice } from "../lib/NESTRequest";
import useNEST from "./useNEST";

function useFuturesEditPosition(
  data: FuturesOrderService,
  price: FuturesPrice | undefined,
  onClose: (res?: boolean) => void
) {
  const { chainsData, signature } = useNEST();
  const [loading, setLoading] = useState<boolean>(false);
  const tokenPair = useMemo(() => {
    return data.product.split("/")[0];
  }, [data.product]);
  /**
   * futures modal
   */
  const checkShowTriggerNotice = useMemo(() => {
    const isShow = localStorage.getItem("TriggerRiskModal");
    return isShow === "1" ? false : true;
  }, []);
  const [showTriggerNotice, setShowTriggerNotice] = useState(false);
  const [showedTriggerNotice, setShowedTriggerNotice] = useState(false);

  const defaultTP = useMemo(() => {
    if (data.takeProfitPrice !== 0) {
      const p = data.takeProfitPrice.floor(tokenPair.getTokenPriceDecimals());
      return p ?? "";
    }
    return "";
  }, [data.takeProfitPrice, tokenPair]);
  const defaultSL = useMemo(() => {
    if (data.stopLossPrice !== 0) {
      const p = data.stopLossPrice.floor(tokenPair.getTokenPriceDecimals());
      return p ?? "";
    }
    return "";
  }, [data.stopLossPrice, tokenPair]);
  const [stopProfitPriceInput, setStopProfitPriceInput] =
    useState<string>(defaultTP);
  const [stopLossPriceInput, setStopLossPriceInput] =
    useState<string>(defaultSL);
  const isEditTP = useMemo(() => {
    if (stopProfitPriceInput !== "") {
      return true;
    }
    return false;
  }, [stopProfitPriceInput]);
  const isEditSL = useMemo(() => {
    if (stopLossPriceInput !== "") {
      return true;
    }
    return false;
  }, [stopLossPriceInput]);
  const baseOpenPrice = useMemo(() => {
    return data.orderPrice.floor(tokenPair.getTokenPriceDecimals());
  }, [data.orderPrice, tokenPair]);
  const tpError = useMemo(() => {
    if (stopProfitPriceInput !== "" && parseFloat(stopProfitPriceInput) !== 0) {
      return data.direction
        ? Number(stopProfitPriceInput) < Number(baseOpenPrice)
        : Number(stopProfitPriceInput) > Number(baseOpenPrice);
    }
    return false;
  }, [baseOpenPrice, data.direction, stopProfitPriceInput]);
  const slError = useMemo(() => {
    if (stopLossPriceInput !== "" && parseFloat(stopLossPriceInput) !== 0) {
      return data.direction
        ? Number(stopLossPriceInput) > Number(baseOpenPrice)
        : Number(stopLossPriceInput) < Number(baseOpenPrice);
    }
    return false;
  }, [baseOpenPrice, data.direction, stopLossPriceInput]);

  /**
   * action
   */
  const update = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const updateBase: { [key: string]: any } = await serviceUpdateStopPrice(
        data.id.toString(),
        stopLossPriceInput === "" ? "0" : stopLossPriceInput,
        stopProfitPriceInput === "" ? "0" : stopProfitPriceInput,
        chainsData.chainId,
        { Authorization: signature.signature }
      );
      if (Number(updateBase["errorCode"]) === 0) {
      }
      onClose(Number(updateBase["errorCode"]) === 0);
    }
    setLoading(false);
  }, [
    chainsData.chainId,
    data.id,
    onClose,
    signature,
    stopLossPriceInput,
    stopProfitPriceInput,
  ]);
  /**
   * show
   */
  const placeHolder = useMemo(() => {
    return data.direction
      ? [t`> OPEN PRICE`, t`< OPEN PRICE`]
      : [t`< OPEN PRICE`, t`> OPEN PRICE`];
  }, [data.direction]);
  const showPosition = useMemo(() => {
    const lever = data.leverage.toString();
    const longOrShort = data.direction ? t`Long` : t`Short`;
    const balance = data.balance.floor(2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.leverage, data.direction]);
  const showOpenPrice = useMemo(() => {
    return `${baseOpenPrice} USDT`;
  }, [baseOpenPrice]);
  const showLiqPrice = useMemo(() => {
    if (price) {
      const balance =
        data.balance.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const orderPrice =
        data.orderPrice.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const append =
        data.append.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const result = lipPrice(
        balance,
        append,
        BigNumber.from(data.leverage.toString()),
        price[tokenPair],
        orderPrice,
        data.direction
      );
      return result.bigNumberToShowPrice(18, tokenPair.getTokenPriceDecimals());
    } else {
      return String().placeHolder;
    }
  }, [
    data.append,
    data.balance,
    data.direction,
    data.leverage,
    data.orderPrice,
    price,
    tokenPair,
  ]);

  /**
   * main button
   */
  const mainButtonTitle = useMemo(() => {
    return t`Confirm`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    if (stopProfitPriceInput === "" && stopLossPriceInput === "") {
      return true;
    } else if (tpError || slError) {
      return true;
    }
    return false;
  }, [slError, stopLossPriceInput, stopProfitPriceInput, tpError]);
  const triggerNoticeCallback = useCallback(() => {
    setShowedTriggerNotice(true);
    setLoading(true);
    update();
  }, [update]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading || tpError || slError) {
      return;
    } else {
      if (checkShowTriggerNotice && !showedTriggerNotice) {
        setShowTriggerNotice(true);
        return;
      }
      setLoading(true);
      update();
    }
  }, [
    checkShowTriggerNotice,
    mainButtonLoading,
    showedTriggerNotice,
    slError,
    tpError,
    update,
  ]);
  const closeTP = useCallback(() => {
    setStopProfitPriceInput("0");
  }, []);
  const closeSL = useCallback(() => {
    setStopLossPriceInput("0");
  }, []);
  return {
    stopProfitPriceInput,
    setStopProfitPriceInput,
    stopLossPriceInput,
    setStopLossPriceInput,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    placeHolder,
    isEditTP,
    isEditSL,
    closeTP,
    closeSL,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    tpError,
    slError,
  };
}

export default useFuturesEditPosition;
