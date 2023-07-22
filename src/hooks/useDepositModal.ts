import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance from "../contracts/Read/useReadTokenContract";
import useNEST from "./useNEST";
import { useBalance } from "wagmi";
import { getPriceFromNESTLocal } from "../lib/NESTRequest";
import { parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers/lib/ethers";
import { t } from "@lingui/macro";
import { useTokenTransfer } from "../contracts/useTokenContract";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

interface DepositModalPrice {
  BNB: BigNumber;
  NEST: BigNumber;
}

function useDepositModal() {
  const { isPendingType } = usePendingTransactions();
  const { chainsData, account } = useNEST();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [selectToken, setSelectToken] = useState<string>("NEST");
  const [selectButton, setSelectButton] = useState<number>();
  const [basePrice, setBasePrice] = useState<DepositModalPrice>();

  const MAX_Amount: {
    [key: string]: number;
  } = useMemo(() => {
    return { USDT: 10000, BNB: 10000 };
  }, []);
  const nowToken = useMemo(() => {
    const token = selectToken.getToken();
    if (chainsData.chainId && token) {
      return token.address[chainsData.chainId];
    }
  }, [chainsData.chainId, selectToken]);
  /**
   * get price
   */
  const getPrice = useCallback(async () => {
    const BNBPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "bnb"
    );
    const NESTPriceBase: { [key: string]: string } =
      await getPriceFromNESTLocal("nest");
    const BNBPrice = BNBPriceBase
      ? BNBPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const NESTPrice = NESTPriceBase
      ? NESTPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    if (BNBPrice && NESTPrice) {
      const newPrice: DepositModalPrice = {
        BNB: BNBPrice,
        NEST: NESTPrice,
      };
      return newPrice;
    } else {
      return undefined;
    }
  }, []);
  /**
   * balance
   */
  const { balance: tokenBalance, balanceOfRefetch: tokenBalanceRefetch } =
    useReadTokenBalance(
      (nowToken ?? String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
  const { data: ETHBalance } = useBalance({
    address: account.address,
  });

  /**
   * call back
   */
  const maxCallBack = useCallback(() => {
    if (selectToken !== "BNB" && tokenBalance) {
      setTokenAmount(
        tokenBalance.bigNumberToShowString(18, 2).formatInputNum4()
      );
    } else if (selectToken === "BNB" && ETHBalance) {
      setTokenAmount(ETHBalance.formatted);
    }
  }, [ETHBalance, selectToken, tokenBalance]);
  const selectButtonCallBack = useCallback(
    (num: number) => {
      setSelectButton(num);
      if (num !== 0) {
        if (tokenBalance && selectToken !== "BNB") {
          const oneBalance = tokenBalance.div(4);
          const nowAmount = oneBalance.mul(num);
          setTokenAmount(
            nowAmount.bigNumberToShowString(18, 2).formatInputNum4()
          );
        } else if (ETHBalance && selectToken === "BNB") {
          const ETHBigNumber = ETHBalance.formatted.stringToBigNumber(18);
          const oneBalance = ETHBigNumber
            ? ETHBigNumber.div(4)
            : BigNumber.from("0");
          const nowAmount = oneBalance.mul(num);
          setTokenAmount(
            nowAmount.bigNumberToShowString(18, 2).formatInputNum4()
          );
        }
      }
    },
    [ETHBalance, selectToken, tokenBalance]
  );
  /**
   * show
   */
  const showBalance = useMemo(() => {
    if (account.address && tokenBalance && selectToken !== "BNB") {
      return tokenBalance.bigNumberToShowString(18, 2);
    } else if (account.address && ETHBalance && selectToken === "BNB") {
      const ETHBigNumber = ETHBalance.formatted.stringToBigNumber(18);
      return ETHBigNumber
        ? ETHBigNumber.bigNumberToShowString(18, 2)
        : String().placeHolder;
    } else {
      return String().placeHolder;
    }
  }, [ETHBalance, account.address, selectToken, tokenBalance]);
  const showPrice = useMemo(() => {
    if (basePrice && selectToken === "USDT") {
      return parseEther("1")
        .mul(parseEther("1"))
        .div(basePrice.NEST)
        .bigNumberToShowPrice(18, 2);
    } else if (basePrice && selectToken === "BNB") {
      return basePrice.BNB.mul(parseEther("1"))
        .div(basePrice.NEST)
        .bigNumberToShowPrice(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [basePrice, selectToken]);
  const showGetNEST = useMemo(() => {
    if (showPrice !== String().placeHolder && tokenAmount !== "") {
      return (parseFloat(tokenAmount) * parseFloat(showPrice)).toFixed(2);
    } else {
      return String().placeHolder;
    }
  }, [showPrice, tokenAmount]);
  /**
   * check
   */
  const checkMax = useMemo(() => {
    if (selectToken !== "NEST") {
      if (parseFloat(tokenAmount) > MAX_Amount[selectToken]) {
        return true;
      }
    }
    return false;
  }, [MAX_Amount, selectToken, tokenAmount]);
  const checkBalance = useMemo(() => {
    if (selectToken !== "BNB" && tokenBalance) {
      return tokenAmount.stringToBigNumber(18)?.gt(tokenBalance);
    } else if (selectToken === "BNB" && ETHBalance) {
      const ETHBigNumber = ETHBalance.formatted.stringToBigNumber(18);
      if (ETHBigNumber) {
        return tokenAmount.stringToBigNumber(18)?.gt(ETHBigNumber);
      }
    }
    return false;
  }, [ETHBalance, selectToken, tokenAmount, tokenBalance]);
  const isError = useMemo(() => {
    return checkMax || (checkBalance ?? false);
  }, [checkBalance, checkMax]);

  const { transaction: tokenTransfer } = useTokenTransfer(
    (nowToken ?? String().zeroAddress) as `0x${string}`,
    tokenAmount.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingType(TransactionType.deposit);
  }, [isPendingType]);
  const mainButtonTitle = useMemo(() => {
    return t`Deposit`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (tokenTransfer.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [pending, tokenTransfer.isLoading]);
  const mainButtonDis = useMemo(() => {
    return checkBalance || checkMax;
  }, [checkBalance, checkMax]);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      tokenTransfer.write?.();
    }
  }, [mainButtonDis, mainButtonLoading, tokenTransfer]);
  /**
   * update
   */
  useEffect(() => {
    const time = setInterval(() => {
      tokenBalanceRefetch();
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [tokenBalanceRefetch]);
  useEffect(() => {
    const get = async () => {
      const newPrice = await getPrice();
      setBasePrice(newPrice);
    };
    const time = setInterval(() => {
      get();
    }, 10000);
    get();
    return () => {
      clearInterval(time);
    };
  }, [getPrice]);
  return {
    tokenAmount,
    setTokenAmount,
    selectToken,
    setSelectToken,
    selectButton,
    setSelectButton,
    maxCallBack,
    showBalance,
    showPrice,
    showGetNEST,
    selectButtonCallBack,
    isError,
    checkMax,
    checkBalance,
    MAX_Amount,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useDepositModal;
