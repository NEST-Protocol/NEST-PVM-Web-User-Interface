import { BigNumber } from "ethers";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useNewSellRequest } from "../contracts/useFuturesBuyV2";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesClose(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
  const showPosition = useMemo(() => {
    const lever = data.lever.toString();
    const longOrShort = data.orientation ? "Long" : "Short";
    const balance = BigNumber.from(
      data.balance.toString()
    ).bigNumberToShowString(4, 2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.lever, data.orientation]);

  const closePrice = useMemo(() => {
    const nestBigNumber = BigNumber.from(data.balance.toString())
      .bigNumberToShowString(4)
      .stringToBigNumber(18);
    const token = priceToken[parseInt(data.channelIndex.toString())];
    if (price && nestBigNumber) {
      const nowPrice = price[token];
      if (nestBigNumber.gte("100000".stringToBigNumber(18)!)) {
        const cc_top = BigNumber.from("55560000")
          .mul(nestBigNumber)
          .mul(BigNumber.from(data.lever.toString()))
          .mul(nowPrice)
          .add(
            BigNumber.from("444400000000000")
              .mul(BigNumber.from("10").pow(18))
              .mul(data.basePrice)
          );
        const cc_long = BigNumber.from(data.basePrice.toString())
          .mul(nowPrice)
          .mul(BigNumber.from("10").pow(36))
          .div(
            BigNumber.from(data.basePrice.toString())
              .mul(BigNumber.from("10").pow(36))
              .add(cc_top)
          );
        const cc_Short = BigNumber.from(nowPrice)
          .mul(BigNumber.from(data.basePrice.toString()))
          .mul(BigNumber.from("10").pow(36))
          .add(cc_top.mul(nowPrice))
          .div(
            BigNumber.from(data.basePrice.toString()).mul(
              BigNumber.from("10").pow(36)
            )
          );
        return data.orientation ? cc_long : cc_Short;
      } else {
        return nowPrice;
      }
    } else {
      return undefined;
    }
  }, [
    data.balance,
    data.basePrice,
    data.channelIndex,
    data.lever,
    data.orientation,
    price,
  ]);
  const showClosePrice = useMemo(() => {
    if (!closePrice) {
      return String().placeHolder;
    }
    return BigNumber.from(closePrice.toString()).bigNumberToShowString(18, 2);
  }, [closePrice]);

  const showFee = useMemo(() => {
    if (!price) {
      return String().placeHolder;
    }
    const token = priceToken[parseInt(data.channelIndex.toString())];
    const fee = BigNumber.from("5")
      .mul(data.lever)
      .mul(data.balance)
      .mul(price[token])
      .div(BigNumber.from("10000").mul(data.basePrice));
    return fee.bigNumberToShowString(4, 2);
  }, [data.balance, data.basePrice, data.channelIndex, data.lever, price]);
  const feeTip = useMemo(() => {
    return "Position*0.05%";
  }, []);
  /**
   * action
   */
  const { transaction: sell } = useNewSellRequest(data.index);

  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_sell,
      parseInt(data.index.toString())
    );
  }, [data.index, isPendingOrder]);
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
    if (sell.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [sell.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonLoading) {
      sell.write?.();
    }
  }, [mainButtonLoading, sell]);
  return {
    showPosition,
    showClosePrice,
    showFee,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    feeTip,
  };
}

export default useFuturesClose;
