import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST from "./useNEST";
import { BigNumber } from "ethers/lib/ethers";
import useService from "../contracts/useService";
import { t } from "@lingui/macro";
import { serviceWithdraw } from "../lib/NESTRequest";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "./useTransactionReceipt";
import { SnackBarType } from "../components/SnackBar/NormalSnackBar";

function useWithDrawModal(onClose: (res?: boolean) => void) {
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [selectButton, setSelectButton] = useState<number>();
  const { chainsData, account, signature } = useNEST();
  const { service_balance } = useService();
  const [tokenBalance, setTokenBalance] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(false);
  const { addTransactionNotice } = usePendingTransactionsBase();

  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      const balance_bigNumber = result.toString().stringToBigNumber(18);
      setTokenBalance(balance_bigNumber ?? BigNumber.from("0"));
    });
  }, [service_balance]);

  const maxCallBack = useCallback(() => {
    if (tokenBalance) {
      setTokenAmount(
        tokenBalance.bigNumberToShowString(18, 2).formatInputNum4()
      );
    }
  }, [tokenBalance]);
  const selectButtonCallBack = useCallback(
    (num: number) => {
      setSelectButton(num);
      if (num !== 0 && tokenBalance) {
        const oneBalance = tokenBalance.div(4);
        const nowAmount = oneBalance.mul(num);
        setTokenAmount(
          nowAmount.bigNumberToShowString(18, 2).formatInputNum4()
        );
      }
    },
    [tokenBalance]
  );
  const checkBalance = useMemo(() => {
    if (tokenBalance) {
      return tokenAmount.stringToBigNumber(18)?.gt(tokenBalance);
    }
    return false;
  }, [tokenAmount, tokenBalance]);
  const isError = useMemo(() => {
    return checkBalance || parseFloat(tokenAmount) <= 15;
  }, [checkBalance, tokenAmount]);
  const errorLabel = useMemo(() => {
    if (checkBalance) {
      return t`Insufficient balance`;
    }
    if (parseFloat(tokenAmount) <= 15) {
      return t`The minimum withdrawal amount greater than 15NEST`;
    }
    return "";
  }, [checkBalance, tokenAmount]);
  /**
   * show
   */
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

  const showTotal = useMemo(() => {
    const total = parseFloat(tokenAmount) - 15;
    if (total > 0) {
      return total.floor(2);
    } else {
      return "0";
    }
  }, [tokenAmount]);

  const withdraw = useCallback(async () => {
    if (chainsData.chainId && account.address && signature) {
      const tokenAddress = "NEST".getTokenAddress(chainsData.chainId);
      if (tokenAddress) {
        const withDrawBase: { [key: string]: any } = await serviceWithdraw(
          Number(tokenAmount),
          chainsData.chainId,
          "NEST",
          tokenAddress,
          account.address,
          { Authorization: signature.signature }
        );
        addTransactionNotice({
          type: TransactionType.futures_add,
          info: "",
          result:
            Number(withDrawBase["errorCode"]) === 0
              ? SnackBarType.success
              : SnackBarType.fail,
        });

        if (Number(withDrawBase["errorCode"]) === 0) {
          getBalance();
        }
        onClose(Number(withDrawBase["errorCode"]) === 0);
      }
    }
    setLoading(false);
  }, [
    account.address,
    addTransactionNotice,
    chainsData.chainId,
    getBalance,
    onClose,
    signature,
    tokenAmount,
  ]);

  /**
   * main button
   */
  const mainButtonTitle = useMemo(() => {
    return t`Withdraw`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    if (
      !account.address ||
      parseFloat(tokenAmount) <= 15 ||
      tokenAmount === ""
    ) {
      return true;
    }
    return checkBalance;
  }, [account.address, checkBalance, tokenAmount]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading || mainButtonDis) {
      return;
    } else {
      setLoading(true);
      withdraw();
    }
  }, [mainButtonDis, mainButtonLoading, withdraw]);

  /**
   * update
   */
  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return {
    tokenAmount,
    setTokenAmount,
    selectButton,
    setSelectButton,
    showBalance,
    maxCallBack,
    selectButtonCallBack,
    isError,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    showTotal,
    errorLabel,
  };
}

export default useWithDrawModal;
