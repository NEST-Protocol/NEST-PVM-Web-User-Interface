import { useCallback, useMemo, useState } from "react";
import { FuturesOrderService } from "./useFuturesOrderList";
import { t } from "@lingui/macro";
import useNEST from "./useNEST";
import { serviceUpdateLimitPrice } from "../lib/NESTRequest";

function useFuturesEditLimit(data: FuturesOrderService, onClose: () => void) {
  const { chainsData, signature } = useNEST();
  const [loading, setLoading] = useState<boolean>(false);
  const tokenPair = useMemo(() => {
    return data.product.split("/")[0];
  }, [data.product]);
  const defaultLimitPrice = useMemo(() => {
    const orderPrice = data.orderPrice.toString().stringToBigNumber(18);
    if (orderPrice) {
      return data.orderPrice !== 0
        ? data.orderPrice.floor(tokenPair.getTokenPriceDecimals())
        : "";
    } else {
      return "";
    }
  }, [data.orderPrice, tokenPair]);
  const [limitPrice, setLimitPrice] = useState(defaultLimitPrice);
  /**
   * action
   */
  const update = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const updateBase: { [key: string]: any } = await serviceUpdateLimitPrice(
        data.id.toString(),
        limitPrice,
        { Authorization: signature.signature }
      );
      if (Number(updateBase["errorCode"]) === 0) {
        onClose();
      }
    }
    setLoading(false);
  }, [chainsData.chainId, data.id, limitPrice, onClose, signature]);

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
    if (mainButtonLoading) {
      return;
    } else {
      setLoading(true);
      update();
    }
  }, [mainButtonLoading, update]);
  return {
    limitPrice,
    setLimitPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useFuturesEditLimit;
