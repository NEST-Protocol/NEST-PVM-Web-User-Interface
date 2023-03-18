import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import { BigNumber } from "ethers";
import { BASE_NEST_FEE, lipPrice } from "./useFuturesNewOrder";
import {
  useFuturesEditPosition as useFuturesEditPositionTransaction,
  useFuturesNewStopOrder,
} from "../contracts/useFuturesBuy";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesEditPosition(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
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
    if (
      data.trustOrder &&
      !BigNumber.from("0").eq(data.trustOrder.stopProfitPrice)
    ) {
      const p = data.trustOrder.stopProfitPrice.bigNumberToShowString(18, 2);
      return p ?? "";
    }
    return "";
  }, [data.trustOrder]);
  const defaultSL = useMemo(() => {
    if (
      data.trustOrder &&
      !BigNumber.from("0").eq(data.trustOrder.stopLossPrice)
    ) {
      const p = data.trustOrder.stopLossPrice.bigNumberToShowString(18, 2);
      return p ?? "";
    }
    return "";
  }, [data.trustOrder]);
  const [stopProfitPriceInput, setStopProfitPriceInput] =
    useState<string>(defaultTP);
  const [stopLossPriceInput, setStopLossPriceInput] =
    useState<string>(defaultSL);
  const trustOrderIndex = useMemo(() => {
    return data.trustOrder ? data.trustOrder.index : undefined;
  }, [data.trustOrder]);
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
  const isEdit = useMemo(() => {
    return data.trustOrder !== undefined;
  }, [data.trustOrder]);

  /**
   * action
   */
  const { transaction: edit } = useFuturesEditPositionTransaction(
    trustOrderIndex,
    stopProfitPriceInput.stringToBigNumber(18) ?? BigNumber.from("0"),
    stopLossPriceInput.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const { transaction: newStop } = useFuturesNewStopOrder(
    data.index,
    stopProfitPriceInput.stringToBigNumber(18) ?? BigNumber.from("0"),
    stopLossPriceInput.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  /**
   * show
   */
  const placeHolder = useMemo(() => {
    if (price) {
      const nowPrice = price[
        priceToken[parseInt(data.channelIndex.toString())]
      ].bigNumberToShowString(18, 2);
      return [`>${nowPrice}`, `<${nowPrice}`];
    }
    return ["", ""];
  }, [data.channelIndex, price]);
  const showPosition = useMemo(() => {
    const lever = data.lever.toString();
    const longOrShort = data.orientation ? "Long" : "Short";
    const balance = BigNumber.from(
      data.balance.toString()
    ).bigNumberToShowString(4, 2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.lever, data.orientation]);
  const showOpenPrice = useMemo(() => {
    return `${BigNumber.from(data.basePrice.toString()).bigNumberToShowString(
      18,
      2
    )} USDT`;
  }, [data.basePrice]);
  const showLiqPrice = useMemo(() => {
    const result = lipPrice(
      data.balance,
      data.appends,
      data.lever,
      price
        ? price[priceToken[parseInt(data.channelIndex.toString())]]
        : data.basePrice,
      data.basePrice,
      data.orientation
    );
    return result.bigNumberToShowString(18, 2);
  }, [
    data.balance,
    data.appends,
    data.lever,
    data.channelIndex,
    data.basePrice,
    data.orientation,
    price,
  ]);
  const showTriggerFee = useMemo(() => {
    const fee = BigNumber.from("1")
      .mul(data.lever)
      .mul(data.balance)
      .div(BigNumber.from("1000"))
      .add(BASE_NEST_FEE.stringToBigNumber(4)!);
    return BigNumber.from(fee.toString()).bigNumberToShowString(4, 2);
  }, [data.balance, data.lever]);
  const feeTip = useMemo(() => {
    return [
      "Position fee =Position*0.1%",
      "Stop order fee(after execution) = 15 NEST",
    ];
  }, []);
  /**
   * main button
   */
  const pending = useMemo(() => {
    if (data.trustOrder) {
      return isPendingOrder(
        TransactionType.futures_editPosition,
        parseInt(data.trustOrder.index.toString())
      );
    } else {
      return isPendingOrder(
        TransactionType.futures_editPosition2,
        parseInt(data.index.toString())
      );
    }
  }, [data.index, data.trustOrder, isPendingOrder]);
  useEffect(() => {
    if (send && !pending) {
      onClose();
    } else if (!send && pending) {
      setSend(true);
    }
  }, [onClose, pending, send]);
  const mainButtonTitle = useMemo(() => {
    return "Confirm";
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (edit.isLoading || pending || newStop.isLoading) {
      return true;
    } else {
      return false;
    }
  }, [edit.isLoading, pending, newStop.isLoading]);
  const mainButtonDis = useMemo(() => {
    if (stopProfitPriceInput === "" && stopLossPriceInput === "") {
      return true;
    }
    return false;
  }, [stopLossPriceInput, stopProfitPriceInput]);
  const triggerNoticeCallback = useCallback(() => {
    setShowedTriggerNotice(true);
    isEdit ? edit.write?.() : newStop.write?.();
  }, [edit, isEdit, newStop]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading) {
      return;
    } else {
      if (checkShowTriggerNotice && !showedTriggerNotice) {
        setShowTriggerNotice(true);
        return;
      }
      isEdit ? edit.write?.() : newStop.write?.();
    }
  }, [
    checkShowTriggerNotice,
    edit,
    isEdit,
    mainButtonLoading,
    newStop,
    showedTriggerNotice,
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
    showTriggerFee,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    placeHolder,
    isEditTP,
    isEditSL,
    isEdit,
    closeTP,
    closeSL,
    feeTip,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
  };
}

export default useFuturesEditPosition;
