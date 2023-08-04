import { NESTService, WBNBToken } from "./../contracts/contractAddress";
import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance, {
  useReadTokenAllowance,
} from "../contracts/Read/useReadTokenContract";
import useNEST from "./useNEST";
import { useBalance } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers/lib/ethers";
import { t } from "@lingui/macro";
import useTokenApprove, {
  useTokenTransfer,
} from "../contracts/useTokenContract";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";
import {
  NESTToken,
  SwapContract,
  USDTToken,
} from "../contracts/contractAddress";
import { MaxUint256 } from "@ethersproject/constants";
import useSwapExactTokensForTokens, {
  useSwapExactETHForTokens,
} from "../contracts/useSwapContract";
import useReadSwapAmountOut from "../contracts/Read/useReadSwapContract";

function useDepositModal(onClose: () => void) {
  const { isPendingType } = usePendingTransactions();
  const { chainsData, account } = useNEST();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [selectToken, setSelectToken] = useState<string>("NEST");
  const [selectButton, setSelectButton] = useState<number>();
  const [send, setSend] = useState(false);

  const nowToken = useMemo(() => {
    const token = selectToken.getToken();
    if (chainsData.chainId && token) {
      return token.address[chainsData.chainId];
    }
  }, [chainsData.chainId, selectToken]);
  /**
   * balance
   */
  const { balance: tokenBalance, balanceOfRefetch: tokenBalanceRefetch } =
    useReadTokenBalance(
      (nowToken ?? String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
  const { data: ETHBalance, refetch: ETHrefetch } = useBalance({
    address: account.address,
  });
  /**
   * allowance
   */
  const USDT = useMemo(() => {
    if (chainsData.chainId) {
      return USDTToken[chainsData.chainId];
    } else {
      return String().zeroAddress;
    }
  }, [chainsData.chainId]);
  const NEST = useMemo(() => {
    if (chainsData.chainId) {
      return NESTToken[chainsData.chainId];
    } else {
      return String().zeroAddress;
    }
  }, [chainsData.chainId]);
  const WBNB = useMemo(() => {
    if (chainsData.chainId) {
      return WBNBToken[chainsData.chainId];
    } else {
      return String().zeroAddress;
    }
  }, [chainsData.chainId]);
  const NEST_Service = useMemo(() => {
    if (chainsData.chainId) {
      return NESTService[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId]);
  const swapContract = useMemo(() => {
    if (chainsData.chainId) {
      return SwapContract[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId]);
  const { allowance: USDTAllowance, allowanceRefetch: USDTAllowanceRefetch } =
    useReadTokenAllowance(USDT as `0x${string}`, account.address, swapContract);

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
  const tokenAmountToBigNumber = useMemo(() => {
    if (tokenAmount !== "") {
      return tokenAmount.stringToBigNumber(18);
    } else {
      return undefined;
    }
  }, [tokenAmount]);
  const defaultInput = useMemo(() => {
    if (
      tokenAmountToBigNumber &&
      !tokenAmountToBigNumber.eq(BigNumber.from("0"))
    ) {
      return tokenAmountToBigNumber;
    } else {
      return "1".stringToBigNumber(18)!;
    }
  }, [tokenAmountToBigNumber]);
  const swapPathAddress = useMemo(() => {
    if (selectToken === "USDT" && USDT && NEST) {
      return [USDT, NEST];
    } else if (selectToken === "BNB" && WBNB && USDT && NEST) {
      return [WBNB, USDT, NEST];
    } else {
      return undefined;
    }
  }, [NEST, USDT, WBNB, selectToken]);
  const { uniSwapAmountOut, uniSwapAmountOutRefetch } = useReadSwapAmountOut(
    defaultInput,
    swapPathAddress
  );
  const showPrice = useMemo(() => {
    if (uniSwapAmountOut && selectToken !== "NEST") {
      console.log(uniSwapAmountOut);
      return parseEther("1")
        .mul(uniSwapAmountOut[uniSwapAmountOut.length - 1])
        .div(defaultInput)
        .bigNumberToShowPrice(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [selectToken, defaultInput, uniSwapAmountOut]);
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
  const MAX_Amount: {
    [key: string]: number;
  } = useMemo(() => {
    return { USDT: 10000, NEST: 1000000, BNB: 30 };
  }, []);
  const checkMax = useMemo(() => {
    if (parseFloat(tokenAmount) > MAX_Amount[selectToken]) {
      return true;
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

  const checkAllowance = useMemo(() => {
    if (USDTAllowance) {
      const inputBigNumber = tokenAmountToBigNumber ?? BigNumber.from("0");
      return inputBigNumber.lte(USDTAllowance);
    } else {
      return true;
    }
  }, [USDTAllowance, tokenAmountToBigNumber]);
  const isError = useMemo(() => {
    return checkMax || (checkBalance ?? false);
  }, [checkBalance, checkMax]);

  const { transaction: tokenTransfer } = useTokenTransfer(
    (nowToken ?? String().zeroAddress) as `0x${string}`,
    tokenAmount.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  const { transaction: tokenApprove } = useTokenApprove(
    USDT as `0x${string}`,
    swapContract,
    MaxUint256
  );

  const amountOutMin = useMemo(() => {
    if (uniSwapAmountOut) {
      return uniSwapAmountOut[1].sub(
        uniSwapAmountOut[1].mul(BigNumber.from("1")).div(BigNumber.from("1000"))
      );
    } else {
      return MaxUint256;
    }
  }, [uniSwapAmountOut]);
  const { transaction: swapTTT } = useSwapExactTokensForTokens(
    tokenAmountToBigNumber ?? BigNumber.from("0"),
    amountOutMin,
    selectToken === "USDT" && checkAllowance ? swapPathAddress : undefined,
    NEST_Service,
    TransactionType.deposit
  );
  const { transaction: swapETT } = useSwapExactETHForTokens(
    tokenAmountToBigNumber ?? BigNumber.from("0"),
    amountOutMin,
    selectToken === "BNB" ? swapPathAddress : undefined,
    NEST_Service,
    TransactionType.deposit
  );

  /**
   * main button
   */
  const pending = useMemo(() => {
    return (
      isPendingType(TransactionType.deposit) ||
      isPendingType(TransactionType.approve)
    );
  }, [isPendingType]);
  useEffect(() => {
    if (send && !pending) {
      setSend(false);
      onClose();
    } else if (!send && pending && !isPendingType(TransactionType.approve)) {
      setSend(true);
    }
  }, [isPendingType, onClose, pending, send]);

  const mainButtonTitle = useMemo(() => {
    if (selectToken === "USDT") {
      if (checkAllowance) {
        return t`Deposit`;
      } else {
        return t`Approve`;
      }
    } else {
      return t`Deposit`;
    }
  }, [checkAllowance, selectToken]);
  const mainButtonLoading = useMemo(() => {
    if (
      tokenTransfer.isLoading ||
      tokenApprove.isLoading ||
      swapTTT.isLoading ||
      swapETT.isLoading ||
      pending
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    pending,
    swapETT.isLoading,
    swapTTT.isLoading,
    tokenApprove.isLoading,
    tokenTransfer.isLoading,
  ]);
  const mainButtonDis = useMemo(() => {
    return (
      checkBalance ||
      checkMax ||
      tokenAmount === "" ||
      parseFloat(tokenAmount) === 0
    );
  }, [checkBalance, checkMax, tokenAmount]);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      if (selectToken === "USDT") {
        if (!checkAllowance) {
          tokenApprove.write?.();
        } else {
          swapTTT.reset();
          swapTTT.write?.();
        }
      } else if (selectToken === "BNB") {
        swapETT.reset();
        swapETT.write?.();
      } else {
        tokenTransfer.reset();
        tokenTransfer.write?.();
      }
    }
  }, [
    checkAllowance,
    mainButtonDis,
    mainButtonLoading,
    selectToken,
    swapETT,
    swapTTT,
    tokenApprove,
    tokenTransfer,
  ]);
  /**
   * update
   */
  useEffect(() => {
    const time = setInterval(() => {
      if (selectToken !== "NEST") {
        USDTAllowanceRefetch();
        uniSwapAmountOutRefetch();
        if (selectToken === "BNB") {
          ETHrefetch();
        } else {
          tokenBalanceRefetch();
        }
      }
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [
    ETHrefetch,
    USDTAllowanceRefetch,
    selectToken,
    tokenBalanceRefetch,
    uniSwapAmountOutRefetch,
  ]);
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
