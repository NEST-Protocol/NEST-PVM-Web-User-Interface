import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST from "../../../hooks/useNEST";
import { copyFollow } from "../../../lib/NESTRequest";
import { t } from "@lingui/macro";
import useService from "../../../contracts/useService";

function useCopySettingModal(
  address: string | undefined,
  add: boolean,
  onClose: () => void
) {
  const { chainsData, signature } = useNEST();
  const { service_balance } = useService();
  const [tokenBalance, setTokenBalance] = useState<number>();
  const [copyAccountBalance, setCopyAccountBalance] = useState<string>("");
  const [followingValue, setFollowingValue] = useState<string>("");
  const [selectButton, setSelectButton] = useState<number>();
  const [agree, setAgree] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const follow = useCallback(async () => {
    if (
      chainsData.chainId &&
      signature &&
      address &&
      copyAccountBalance !== "" &&
      followingValue !== ""
    ) {
      const req = await copyFollow(
        chainsData.chainId,
        {
          Authorization: signature.signature,
        },
        {
          chainId: chainsData.chainId.toString(),
          copyAccountBalance: copyAccountBalance,
          copyKolAddress: address,
          follow: "true",
          followingMethod: "FIEXD",
          followingValue: followingValue,
        }
      );
      if (Number(req["errorCode"]) === 0) {
        onClose();
      } else {
        setIsLoading(false);
      }
    }
  }, [
    address,
    chainsData.chainId,
    copyAccountBalance,
    followingValue,
    onClose,
    signature,
  ]);
  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      setTokenBalance(result);
    });
  }, [service_balance]);

  const checkBalance = useMemo(() => {
    if (tokenBalance) {
      const copyAccountBalanceNumber =
        copyAccountBalance === "" ? 0 : parseFloat(copyAccountBalance);
      return copyAccountBalanceNumber <= tokenBalance;
    }
    return false;
  }, [copyAccountBalance, tokenBalance]);

  const checkLimit = useMemo(() => {
    const copyAccountBalanceNumber =
      copyAccountBalance === "" ? 0 : parseFloat(copyAccountBalance);
    if (copyAccountBalanceNumber >= 50) {
      return true;
    }
    return false;
  }, [copyAccountBalance]);

  const mainButtonTitle = useMemo(() => {
    if (!checkBalance) {
      return t`Insufficient NEST balance`;
    } else if (!checkLimit) {
      return t`Minimum 50 NEST`;
    } else {
      return add ? t`Save` : t`Copy Now`;
    }
  }, [add, checkBalance, checkLimit]);

  const mainButtonLoading = useMemo(() => {
    return isLoading;
  }, [isLoading]);
  const mainButtonDis = useMemo(() => {
    return !checkBalance || !checkLimit || !agree;
  }, [agree, checkBalance, checkLimit]);

  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      setIsLoading(true);
      follow();
    }
  }, [follow, mainButtonDis, mainButtonLoading]);

  const maxCallBack = useCallback(() => {
    if (tokenBalance) {
      setCopyAccountBalance(tokenBalance.floor(2));
    }
  }, [tokenBalance]);
  const selectButtonCallBack = useCallback(
    (num: number) => {
      setSelectButton(num);
      if (num !== 0) {
        if (tokenBalance) {
          const oneBalance = tokenBalance / 4;
          const nowAmount = oneBalance * num;
          setCopyAccountBalance(nowAmount.floor(2));
        }
      }
    },
    [tokenBalance]
  );

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
    copyAccountBalance,
    setCopyAccountBalance,
    followingValue,
    setFollowingValue,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    maxCallBack,
    tokenBalance,
    checkBalance,
    checkLimit,
    selectButton,
    setSelectButton,
    selectButtonCallBack,
    agree,
    setAgree,
  };
}

export default useCopySettingModal;
