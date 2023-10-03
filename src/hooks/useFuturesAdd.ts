import { useCallback, useEffect, useMemo, useState } from "react";

import { FuturesOrderService } from "../pages/Futures/OrderList";
import useNEST from "./useNEST";
import { BigNumber } from "ethers";
import { lipPrice } from "./useFuturesNewOrder";
import { FuturesPrice } from "../pages/Futures/Futures";
import { t } from "@lingui/macro";
import useService from "../contracts/useService";
import { serviceAdd } from "../lib/NESTRequest";

function useFuturesAdd(
  data: FuturesOrderService,
  price: FuturesPrice | undefined,
  onClose: (res?: boolean) => void
) {
  const { account, chainsData, signature } = useNEST();
  const [nestAmount, setNestAmount] = useState("");
  const { service_balance } = useService();
  const [tokenBalance, setTokenBalance] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(false);
  const tokenPair = useMemo(() => {
    return data.product.split("/")[0];
  }, [data.product]);
  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      const balance_bigNumber = result.toString().stringToBigNumber(18);
      setTokenBalance(balance_bigNumber ?? BigNumber.from("0"));
    });
  }, [service_balance]);
  /**
   * check
   */
  const checkBalance = useMemo(() => {
    if (tokenBalance) {
      const nestAmountNumber =
        nestAmount === ""
          ? BigNumber.from("0")
          : nestAmount.stringToBigNumber(18)!;
      return nestAmountNumber.lte(tokenBalance);
    } else {
      return false;
    }
  }, [nestAmount, tokenBalance]);
  /**
   * action
   */
  const add = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const addBase: { [key: string]: any } = await serviceAdd(
        nestAmount,
        chainsData.chainId,
        data.id.toString(),
        { Authorization: signature.signature }
      );
      if (Number(addBase["errorCode"]) === 0) {
        getBalance();
      }
      onClose(Number(addBase["errorCode"]) === 0);
    }
    setLoading(false);
  }, [chainsData.chainId, data.id, getBalance, nestAmount, onClose, signature]);

  const maxCallBack = useCallback(() => {
    if (tokenBalance) {
      setNestAmount(tokenBalance.bigNumberToShowString(18, 2));
    }
  }, [tokenBalance]);
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
    if (account.address) {
      if (tokenBalance) {
        return tokenBalance.bigNumberToShowString(18, 2);
      } else {
        return "0";
      }
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBalance]);
  const showPosition = useMemo(() => {
    const lever = data.leverage.toString();
    const longOrShort = data.direction ? t`Long` : t`Short`;
    const balance = data.balance.toFixed(2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.direction, data.leverage]);

  const showOpenPrice = useMemo(() => {
    return `${data.orderPrice.toFixed(tokenPair.getTokenPriceDecimals())} USDT`;
  }, [data.orderPrice, tokenPair]);

  const showLiqPrice = useMemo(() => {
    if (price) {
      const balance =
        data.margin.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const orderPrice =
        data.orderPrice.toString().stringToBigNumber(18) ?? BigNumber.from("0");
      const result = lipPrice(
        balance,
        nestAmount === ""
          ? BigNumber.from("0")
          : nestAmount.stringToBigNumber(4)!,
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
    data.margin,
    data.direction,
    data.leverage,
    data.orderPrice,
    nestAmount,
    price,
    tokenPair,
  ]);
  /**
   * main button
   */
  const mainButtonTitle = useMemo(() => {
    if (!checkBalance) {
      return t`Insufficient NEST balance`;
    } else {
      return t`Confirm`;
    }
  }, [checkBalance]);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    if (
      !account.address ||
      BigNumber.from("0").eq(
        nestAmount.stringToBigNumber(4) ?? BigNumber.from("0")
      )
    ) {
      return true;
    }
    return !checkBalance;
  }, [account.address, checkBalance, nestAmount]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading || !checkBalance || mainButtonDis) {
      return;
    } else {
      setLoading(true);
      add();
    }
  }, [add, checkBalance, mainButtonDis, mainButtonLoading]);
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
  return {
    checkBalance,
    showToSwap,
    showBalance,
    maxCallBack,
    nestAmount,
    setNestAmount,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useFuturesAdd;
