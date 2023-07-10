import { parseEther, parseUnits } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance from "../contracts/Read/useReadTokenContract";
import useNEST from "./useNEST";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";
import { t } from "@lingui/macro";
import { getNESTAmountForAll, getPriceFromNESTLocal } from "../lib/NESTRequest";
import { useTokenTransfer } from "../contracts/useTokenContract";
import useNESTSnackBar from "./useNESTSnackBar";

interface SwapToken {
  src: string;
  dest: string;
}

const SWAP_UPDATE = 30;

function useSwap() {
  const { chainsData, account, setShowConnect, stopAll } = useNEST();
  const swapTokenOfChain = useCallback(() => {
    return {
      src: "USDT",
      dest: "NEST",
    };
  }, []);
  const [swapToken, setSwapToken] = useState<SwapToken>(swapTokenOfChain());
  const [slippage, setSlippage] = useState<number>(0.1);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outAmount, setOutAmount] = useState<string>("");
  const [samePrice, setSamePrice] = useState<boolean>(true);
  const [nestPrice, setNestPrice] = useState<BigNumber>();
  const [nestAmount, setNestAmount] = useState<BigNumber | undefined>();
  const { isPendingType } = usePendingTransactions();
  const { messageSnackBar } = useNESTSnackBar();
  const tokenArray = useMemo(() => {
    return ["USDT", "NEST"];
  }, []);
  useEffect(() => {
    setSwapToken(swapTokenOfChain());
  }, [swapTokenOfChain]);

  /**
   * swap token address
   */
  const scrAddress = useMemo(() => {
    const token = swapToken.src.getToken();
    if (token && chainsData.chainId) {
      return token.address[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData, swapToken.src]);
  const scrDecimals = useMemo(() => {
    const token = swapToken.src.getToken();
    if (token && chainsData.chainId) {
      return token.decimals[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData, swapToken.src]);
  const destAddress = useMemo(() => {
    const token = swapToken.dest.getToken();
    if (token && chainsData.chainId) {
      return token.address[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData, swapToken.dest]);
  const destDecimals = useMemo(() => {
    const token = swapToken.dest.getToken();
    if (token && chainsData.chainId) {
      return token.decimals[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData, swapToken.dest]);

  /**
   * uniswap out amount
   */
  const inputToBigNumber = useMemo(() => {
    if (inputAmount !== "" && scrDecimals) {
      return inputAmount.stringToBigNumber(scrDecimals);
    } else {
      return undefined;
    }
  }, [inputAmount, scrDecimals]);

  const showPrice = useMemo(() => {
    if (nestPrice) {
      const nest_usdt = nestPrice;
      const usdt_nest = parseEther("1").mul(parseUnits("1", 18)).div(nestPrice);
      if (swapToken.src === "USDT") {
        if (samePrice) {
          return `1 ${swapToken.dest} = ${nest_usdt.bigNumberToShowString(
            18,
            6
          )} ${swapToken.src}`;
        } else {
          return `1 ${swapToken.src} = ${usdt_nest.bigNumberToShowString(
            18,
            6
          )} ${swapToken.dest}`;
        }
      } else {
        if (samePrice) {
          return `1 ${swapToken.dest} = ${usdt_nest.bigNumberToShowString(
            18,
            6
          )} ${swapToken.src}`;
        } else {
          return `1 ${swapToken.src} = ${nest_usdt.bigNumberToShowString(
            18,
            6
          )} ${swapToken.dest}`;
        }
      }
    }
  }, [nestPrice, samePrice, swapToken.dest, swapToken.src]);

  /**
   * balance
   */
  const { balance: scrBalance, balanceOfRefetch: srcBalanceRefetch } =
    useReadTokenBalance(
      (scrAddress ?? String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
  const { balance: destBalance, balanceOfRefetch: destBalanceRefetch } =
    useReadTokenBalance(
      (destAddress ?? String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
  /**
   * max button
   */
  const maxCallBack = useCallback(() => {
    const token = swapToken.src.getToken();
    if (token && scrBalance && chainsData.chainId) {
      setInputAmount(
        scrBalance
          .bigNumberToShowString(token.decimals[chainsData.chainId], 18)
          .formatInputNum4()
      );
    }
  }, [chainsData.chainId, scrBalance, swapToken.src]);

  const exchangePrice = useCallback(() => {
    setSamePrice(!samePrice);
  }, [samePrice]);
  /**
   * show out amount
   */
  const showOutAmount = useMemo(() => {
    return outAmount !== "" &&
      inputAmount !== "" &&
      parseFloat(inputAmount) !== 0
      ? outAmount
      : "0.0";
  }, [outAmount, inputAmount]);
  /**
   * show balance
   */
  const showSrcBalance = useMemo(() => {
    const token = swapToken.src.getToken();
    if (token && scrBalance && chainsData.chainId) {
      return scrBalance.bigNumberToShowString(
        token.decimals[chainsData.chainId]
      );
    } else {
      return String().placeHolder;
    }
  }, [chainsData.chainId, scrBalance, swapToken.src]);
  const showDestBalance = useMemo(() => {
    const token = swapToken.dest.getToken();
    if (token && destBalance && chainsData.chainId) {
      return destBalance.bigNumberToShowString(
        token.decimals[chainsData.chainId]
      );
    } else {
      return String().placeHolder;
    }
  }, [destBalance, swapToken.dest, chainsData.chainId]);

  /**
   * check
   */
  const checkBalance = useMemo(() => {
    if (scrDecimals && scrBalance) {
      const inputBigNumber = inputToBigNumber ?? BigNumber.from("0");
      return inputBigNumber.lte(scrBalance);
    } else {
      return false;
    }
  }, [inputToBigNumber, scrBalance, scrDecimals]);
  /**
   * action
   */
  const inputAmountTransaction = useMemo(() => {
    if (inputToBigNumber && checkBalance) {
      return inputToBigNumber;
    } else {
      return BigNumber.from("0");
    }
  }, [checkBalance, inputToBigNumber]);

  const checkAllowNEST = useMemo(() => {
    if (nestAmount) {
      return inputAmountTransaction.lte(nestAmount);
    } else {
      return false;
    }
  }, [inputAmountTransaction, nestAmount]);

  const { transaction: swap } = useTokenTransfer(
    scrAddress as `0x${string}`,
    inputAmountTransaction
  );

  const showServiceFee = useMemo(() => {
    if (swapToken.src === "NEST") {
      return (
        inputAmountTransaction.mul(2).div(1000).bigNumberToShowString(18, 2) +
        " NEST"
      );
    } else {
      return ((parseFloat(outAmount) * 2) / 1000).toFixed(2) + " NEST";
    }
  }, [inputAmountTransaction, outAmount, swapToken.src]);

  /**
   * show button title
   */
  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return t`Connect Wallet`;
    } else if (!checkBalance) {
      return `${t`Insufficient`} ${swapToken.src} ${t`balance`}`;
    } else {
      return t`Swap`;
    }
  }, [account.address, checkBalance, swapToken.src]);
  const pending = useMemo(() => {
    return isPendingType(TransactionType.swap_uni);
  }, [isPendingType]);
  const mainButtonLoading = useMemo(() => {
    if (swap.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [pending, swap.isLoading]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    }
    return !checkBalance;
  }, [account.address, checkBalance]);
  const mainButtonAction = useCallback(() => {
    if (!account.address) {
      setShowConnect(true);
      return;
    } else if (mainButtonLoading || !checkBalance) {
      return;
    }
    if (stopAll) {
      messageSnackBar(t`待定文案`);
      return;
    } else if (swapToken.src === "NEST" && !checkAllowNEST) {
      messageSnackBar(
        t`Due to our new feature being in the trial phase, you are currently not on the whitelist or your transaction amount exceeds the limit. Please contact Admin in our official group chat(https://t.me/nest_chat), and they will assist you in raising the limit or adding you to the whitelist.`
      );
    } else if (swapToken.src === "USDT" && nestAmount === undefined) {
      messageSnackBar(
        t`Due to our new feature being in the trial phase, you are currently not on the whitelist or your transaction amount exceeds the limit. Please contact Admin in our official group chat(https://t.me/nest_chat), and they will assist you in raising the limit or adding you to the whitelist.`
      );
    } else {
      swap.write?.();
    }
  }, [
    account.address,
    checkAllowNEST,
    checkBalance,
    mainButtonLoading,
    messageSnackBar,
    nestAmount,
    setShowConnect,
    stopAll,
    swap,
    swapToken.src,
  ]);
  /**
   * exchange button
   */
  const exchangeButton = useCallback(() => {
    const newSwapToken = { ...swapToken };
    newSwapToken.src = swapToken.dest;
    newSwapToken.dest = swapToken.src;
    setSwapToken(newSwapToken);
    setInputAmount("");
    setSamePrice(true);
  }, [swapToken]);
  /**
   * select token
   */
  const selectToken = useCallback((tokenName: string) => {
    if (tokenName === "USDT") {
      setSwapToken({ src: tokenName, dest: "NEST" });
    } else if (tokenName === "NEST") {
      setSwapToken({ src: tokenName, dest: "USDT" });
    }
    setInputAmount("");
    setSamePrice(true);
  }, []);
  /**
   * update
   */
  useEffect(() => {
    const time = setInterval(() => {
      srcBalanceRefetch();
      destBalanceRefetch();
    }, SWAP_UPDATE * 1000);
    return () => {
      clearInterval(time);
    };
  }, [destBalanceRefetch, srcBalanceRefetch]);

  useEffect(() => {
    setTimeout(() => {
      srcBalanceRefetch();
      destBalanceRefetch();
    }, 3000);
  }, [srcBalanceRefetch, destBalanceRefetch]);

  useEffect(() => {
    var amount = "0";
    if (nestPrice && destDecimals) {
      if (swapToken.src === "NEST") {
        const out = inputAmountTransaction
          .div(parseEther("1"))
          .mul(nestPrice)
          .bigNumberToShowString(destDecimals, 2);
        amount = out;
      } else if (swapToken.src === "USDT") {
        const out = inputAmountTransaction
          .mul(parseEther("1"))
          .div(nestPrice)
          .bigNumberToShowString(destDecimals, 2);
        amount = out;
      }
    }
    setOutAmount(amount);
  }, [destDecimals, inputAmountTransaction, nestPrice, swapToken.src]);

  // get price
  useEffect(() => {
    const getPrice = async () => {
      const NESTPriceBase: { [key: string]: string } =
        await getPriceFromNESTLocal("nest");
      console.log(NESTPriceBase["value"].toString());
      const NESTPrice = NESTPriceBase
        ? NESTPriceBase["value"].toString().stringToBigNumber(18)
        : undefined;
      setNestPrice(NESTPrice);
    };
    getPrice();
    const time = setInterval(() => {
      getPrice();
    }, 15000);
    return () => {
      clearInterval(time);
    };
  }, []);

  useEffect(() => {
    const getNEST = async () => {
      if (account.address && chainsData.chainId) {
        const amountBase: string = await getNESTAmountForAll(
          account.address,
          chainsData.chainId
        );
        if (parseInt(amountBase) === -1 || parseInt(amountBase) === -2) {
          setNestAmount(undefined);
        } else {
          const amount = amountBase
            ? amountBase.toString().stringToBigNumber(18)
            : undefined;
          setNestAmount(amount);
        }
      }
    };
    getNEST();
    const time = setInterval(() => {
      getNEST();
    }, 15000);
    return () => {
      clearInterval(time);
    };
  }, [account.address, chainsData.chainId]);

  return {
    swapToken,
    exchangeButton,
    showSrcBalance,
    showDestBalance,
    slippage,
    setSlippage,
    maxCallBack,
    inputAmount,
    setInputAmount,
    showPrice,
    showOutAmount,
    setSamePrice,
    exchangePrice,
    mainButtonTitle,
    mainButtonAction,
    mainButtonDis,
    mainButtonLoading,
    tokenArray,
    selectToken,
    showServiceFee,
  };
}

export default useSwap;
