import { parseUnits } from "ethers/lib/utils.js";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance, {
  useReadTokenAllowance,
} from "../contracts/Read/useReadTokenContract";
import useNEST from "./useNEST";
import useReadSwapAmountOut from "../contracts/Read/useReadSwapContract";
import { NESTRedeemContract, SwapContract } from "../contracts/contractAddress";
import useTokenApprove from "../contracts/useTokenContract";
import useSwapExactTokensForTokens, {
  useSwapNHBTCToNEST,
} from "../contracts/useSwapContract";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

interface SwapToken {
  src: string;
  dest: string;
}

const SWAP_UPDATE = 30;

function useSwap() {
  const { chainsData, account, setShowConnect } = useNEST();
  const swapTokenOfChain = useCallback(() => {
    if (chainsData.chainId === 1) {
      return {
        src: "NHBTC",
        dest: "NEST",
      };
    } else {
      return {
        src: "USDT",
        dest: "NEST",
      };
    }
  }, [chainsData.chainId]);
  const [swapToken, setSwapToken] = useState<SwapToken>(swapTokenOfChain());
  const [slippage, setSlippage] = useState<number>(0.1);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outAmount, setOutAmount] = useState<string>("");
  const [samePrice, setSamePrice] = useState<boolean>(true);
  const { isPendingType } = usePendingTransactions();
  const tokenArray = useMemo(() => {
    if (chainsData.chainId === 1 || chainsData.chainId === 5) {
      return ["NHBTC"];
    } else if (chainsData.chainId === 56 || chainsData.chainId === 97) {
      // TODO: delete NHBTC
      return ["USDT", "NEST", "NHBTC"];
    }
  }, [chainsData.chainId]);
  useEffect(() => {
    setSwapToken(swapTokenOfChain())
  }, [swapTokenOfChain])
  /**
   * swap contract
   */
  const swapContract = useMemo(() => {
    if (chainsData.chainId && swapToken.src === "NHBTC") {
      return NESTRedeemContract[chainsData.chainId];
    } else if (chainsData.chainId) {
      return SwapContract[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId, swapToken.src]);
  const swapPath = useMemo(() => {
    if (swapToken.src === "NHBTC") {
      return ["NHBTC", "NEST"];
    } else if (swapToken.src === "USDT") {
      return ["USDT", "NEST"];
    } else if (swapToken.src === "NEST") {
      return ["NEST", "USDT"];
    } else {
      return undefined;
    }
  }, [swapToken.src]);
  const swapPathAddress = useMemo(() => {
    if (swapPath && chainsData.chainId) {
      const pathAddress = swapPath.map((item) => {
        return item.getToken()!.address[chainsData.chainId!];
      });
      return pathAddress;
    } else {
      return undefined;
    }
  }, [chainsData.chainId, swapPath]);

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
  const { uniSwapAmountOut, uniSwapAmountOutRefetch } = useReadSwapAmountOut(
    (inputAmount === "" ? "1" : inputAmount).stringToBigNumber(scrDecimals),
    [scrAddress ?? String().zeroAddress, destAddress ?? String().zeroAddress]
  );
  const inputToBigNumber = useMemo(() => {
    if (inputAmount !== "" && scrDecimals) {
      return inputAmount.stringToBigNumber(scrDecimals);
    } else {
      return undefined;
    }
  }, [inputAmount, scrDecimals]);
  const amountOutMin = useMemo(() => {
    if (uniSwapAmountOut) {
      return uniSwapAmountOut[1].sub(
        uniSwapAmountOut[1]
          .mul(BigNumber.from((slippage * 10).toString()))
          .div(BigNumber.from("1000"))
      );
    } else {
      return MaxUint256;
    }
  }, [slippage, uniSwapAmountOut]);

  const showPrice = useMemo(() => {
    if (inputAmount === "") {
      const destToken = swapToken.src.getToken();
      if (swapToken.src === "NHBTC") {
        if (samePrice) {
          return `1 ${swapToken.src} = 0.5 ${swapToken.dest}`;
        } else {
          return `1 ${swapToken.dest} = 2 ${swapToken.src}`;
        }
      } else if (uniSwapAmountOut && destToken && destDecimals) {
        if (samePrice) {
          return `1 ${
            swapToken.src
          } = ${uniSwapAmountOut[1].bigNumberToShowString(destDecimals, 6)} ${
            swapToken.dest
          }`;
        } else {
          const out = parseUnits("1", destDecimals)
            .mul(parseUnits("1", 18))
            .div(uniSwapAmountOut[1]);
          return `1 ${swapToken.dest} = ${out.bigNumberToShowString(18, 6)} ${
            swapToken.src
          }`;
        }
      } else {
        return String().placeHolder;
      }
    } else {
      if (outAmount && inputAmount) {
        if (samePrice) {
          const out = parseFloat(outAmount) / parseFloat(inputAmount);
          return `1 ${swapToken.src} = ${parseFloat(out.toFixed(6))} ${
            swapToken.dest
          }`;
        } else {
          const out = parseFloat(inputAmount) / parseFloat(outAmount);
          return `1 ${swapToken.dest} = ${parseFloat(out.toFixed(6))} ${
            swapToken.src
          }`;
        }
      }
    }
  }, [
    destDecimals,
    inputAmount,
    outAmount,
    samePrice,
    swapToken.dest,
    swapToken.src,
    uniSwapAmountOut,
  ]);

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
   * allowance
   */
  const { allowance: srcAllowance, allowanceRefetch: srcRefetch } =
    useReadTokenAllowance(
      (scrAddress ?? String().zeroAddress) as `0x${string}`,
      account.address,
      swapContract
    );
  /**
   * max button
   */
  const maxCallBack = useCallback(() => {
    const token = swapToken.src.getToken();
    if (token && scrBalance && chainsData.chainId) {
      setInputAmount(
        scrBalance.bigNumberToShowString(token.decimals[chainsData.chainId], 18)
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
    return outAmount !== "" && inputAmount !== "" ? outAmount : "0.0";
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
  const hideSetting = useMemo(() => {
    return swapToken.src === "NHBTC";
  }, [swapToken.src]);
  /**
   * check
   */
  const checkAllowance = useMemo(() => {
    if (scrDecimals && srcAllowance) {
      const inputBigNumber = inputToBigNumber ?? BigNumber.from("0");
      return inputBigNumber.lte(srcAllowance);
    } else {
      return true;
    }
  }, [inputToBigNumber, scrDecimals, srcAllowance]);
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
  const { transaction: tokenApprove } = useTokenApprove(
    (scrAddress ?? String().zeroAddress) as `0x${string}`,
    swapContract,
    MaxUint256
  );
  const { transaction: swapTTT } = useSwapExactTokensForTokens(
    inputToBigNumber ?? BigNumber.from("0"),
    amountOutMin,
    swapPathAddress,
    account.address
  );
  const { transaction: swapNHBTC } = useSwapNHBTCToNEST(
    inputToBigNumber ?? BigNumber.from("0")
  );
  /**
   * show button title
   */
  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return "Connect Wallet";
    } else if (!checkBalance) {
      return `Insufficient ${swapToken.src} balance`;
    } else if (checkAllowance) {
      return "Swap";
    } else {
      return "Approve";
    }
  }, [account.address, checkAllowance, checkBalance, swapToken.src]);
  const pending = useMemo(() => {
    return (
      isPendingType(TransactionType.swap_uni) ||
      isPendingType(TransactionType.approve)
    );
  }, [isPendingType]);
  const mainButtonLoading = useMemo(() => {
    if (tokenApprove.isLoading || swapTTT.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [swapTTT.isLoading, pending, tokenApprove.isLoading]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    }
    return !checkBalance;
  }, [account.address, checkBalance]);
  const mainButtonAction = useCallback(() => {
    if (!account.address) {
      setShowConnect(true);
    } else if (mainButtonLoading || !checkBalance) {
      return;
    } else if (!checkAllowance) {
      tokenApprove.write?.();
    } else {
      if (swapToken.src === "NHBTC") {
        swapNHBTC.write?.();
      } else {
        swapTTT.write?.();
      }
    }
  }, [
    account.address,
    checkAllowance,
    checkBalance,
    mainButtonLoading,
    setShowConnect,
    swapNHBTC,
    swapTTT,
    swapToken.src,
    tokenApprove,
  ]);
  /**
   * exchange button
   */
  const exchangeButton = useCallback(() => {
    if (swapToken.src === "NHBTC") {
      return;
    }
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
  const selectToken = useCallback(
    (tokenName: string) => {
      if (tokenName === "USDT") {
        setSwapToken({ src: tokenName, dest: "NEST" });
      } else if (tokenName === "NEST") {
        setSwapToken({ src: tokenName, dest: "USDT" });
      } else if (tokenName === "NHBTC") {
        setSwapToken({ src: tokenName, dest: "NEST" });
      }
      setInputAmount("");
      setSamePrice(true);
      srcRefetch();
    },
    [srcRefetch]
  );

  const addNESTToWallet = useCallback(async () => {
    const token = "NEST".getToken();
    if (chainsData.chainId && token && account.connector) {
      const imageURL =
        "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenNest.svg";
      await account.connector.watchAsset?.({
        address: token.address[chainsData.chainId], // The address that the token is at.
        symbol: "NEST", // A ticker symbol or shorthand, up to 5 chars.
        decimals: 18, // The number of decimals in the token
        image: imageURL, // A string url of the token logo
      });
    }
  }, [account.connector, chainsData.chainId]);

  useEffect(() => {
    if (swapToken.src === "USDT" || swapToken.src === "NEST") {
      //  use swap amount
      if (uniSwapAmountOut && destDecimals) {
        setOutAmount(
          uniSwapAmountOut[1].bigNumberToShowString(destDecimals, 2)
        );
      }
    } else if (swapToken.src === "NHBTC" && destDecimals) {
      setOutAmount(`${parseFloat((parseFloat(inputAmount) / 2).toFixed(2))}`);
    }
  }, [destDecimals, inputAmount, swapToken.src, uniSwapAmountOut]);
  /**
   * update
   */
  useEffect(() => {
    const time = setInterval(() => {
      uniSwapAmountOutRefetch();
      srcBalanceRefetch();
      destBalanceRefetch();
      srcRefetch();
    }, SWAP_UPDATE * 1000);
    return () => {
      clearInterval(time);
    };
  }, [
    destBalanceRefetch,
    srcBalanceRefetch,
    srcRefetch,
    uniSwapAmountOutRefetch,
  ]);

  useEffect(() => {
    setTimeout(() => {
      srcRefetch();
      srcBalanceRefetch();
    }, 3000);
  }, [srcRefetch, pending, srcBalanceRefetch]);

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
    hideSetting,
    addNESTToWallet,
  };
}

export default useSwap;
