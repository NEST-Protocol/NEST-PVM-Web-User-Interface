import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FuturesPrice } from "../pages/Futures/Futures";
import { FuturesOrderService } from "./useFuturesOrderList";
import { t } from "@lingui/macro";
import { serviceClose } from "../lib/NESTRequest";
import useNEST from "./useNEST";

function useFuturesClose(
  data: FuturesOrderService,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const [loading, setLoading] = useState<boolean>(false);
  const { chainsData, signature } = useNEST();
  const showPosition = useMemo(() => {
    const lever = data.leverage.toString();
    const longOrShort = data.direction ? t`Long` : t`Short`;
    const balance = data.balance.floor(2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.direction, data.leverage]);
  const tokenPair = useMemo(() => {
    return data.product.split("/")[0];
  }, [data.product]);

  const closePrice = useMemo(() => {
    const nestBigNumber = data.balance.toString().stringToBigNumber(18);
    const orderPrice = data.orderPrice.toString().stringToBigNumber(18);
    const token = tokenPair;
    if (price && nestBigNumber && orderPrice) {
      const nowPrice = price[token];
      if (nestBigNumber.gte("100000".stringToBigNumber(18)!)) {
        const cc_top = BigNumber.from("55560000")
          .mul(nestBigNumber)
          .mul(BigNumber.from(data.leverage.toString()))
          .mul(nowPrice)
          .add(
            BigNumber.from("444400000000000")
              .mul(BigNumber.from("10").pow(18))
              .mul(orderPrice)
          );
        const cc_long = BigNumber.from(orderPrice.toString())
          .mul(nowPrice)
          .mul(BigNumber.from("10").pow(36))
          .div(
            BigNumber.from(orderPrice.toString())
              .mul(BigNumber.from("10").pow(36))
              .add(cc_top)
          );
        const cc_Short = BigNumber.from(nowPrice)
          .mul(BigNumber.from(orderPrice.toString()))
          .mul(BigNumber.from("10").pow(36))
          .add(cc_top.mul(nowPrice))
          .div(
            BigNumber.from(orderPrice.toString()).mul(
              BigNumber.from("10").pow(36)
            )
          );
        return data.direction ? cc_long : cc_Short;
      } else {
        return nowPrice;
      }
    } else {
      return undefined;
    }
  }, [
    data.balance,
    data.direction,
    data.leverage,
    data.orderPrice,
    price,
    tokenPair,
  ]);
  const showClosePrice = useMemo(() => {
    if (!closePrice) {
      return String().placeHolder;
    }
    return BigNumber.from(closePrice.toString()).bigNumberToShowPrice(
      18,
      tokenPair.getTokenPriceDecimals()
    );
  }, [closePrice, tokenPair]);

  const showFee = useMemo(() => {
    if (!price) {
      return String().placeHolder;
    }
    const token = tokenPair;
    const nowPrice = parseFloat(
      price[token].bigNumberToShowPrice(18, token.getTokenPriceDecimals())
    );
    const fee =
      (((data.leverage * data.balance * 5) / 10000) * nowPrice) /
      data.orderPrice;
    return fee.floor(2);
  }, [data.balance, data.leverage, data.orderPrice, price, tokenPair]);
  const feeTip = useMemo(() => {
    return t`Position*0.05%`;
  }, []);
  /**
   * action
   */
  const close = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const closeBase: { [key: string]: any } = await serviceClose(
        data.id.toString(),
        { Authorization: signature.signature }
      );
      if (Number(closeBase["errorCode"]) === 0) {
        onClose()
      }
    }
    setLoading(false);
  }, [chainsData.chainId, data.id, onClose, signature]);

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
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonLoading) {
      setLoading(true);
      close();
    }
  }, [close, mainButtonLoading]);
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
