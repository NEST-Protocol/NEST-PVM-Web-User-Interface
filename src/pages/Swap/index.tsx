import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { t, Trans } from "@lingui/macro";
import Popover from "@mui/material/Popover";
import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import {
  ExchangeIcon,
  PutDownIcon,
  SwapLimitIcon,
} from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { SingleTokenShow } from "../../components/TokenShow";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import { useNESTRedeemRedeem } from "../../contracts/hooks/useNESTRedeem";
import { usePVMPayBack } from "../../contracts/hooks/usePVMPayBackTransaction";
import { useUniSwapV2Swap } from "../../contracts/hooks/useUniSwapV2Transaction";
import {
  NESTRedeemContract,
  PVMPayBackContract,
  tokenList,
  TokenType,
  UniSwapV2Contract,
} from "../../libs/constants/addresses";
import { getERC20Contract, UniSwapV2 } from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  BASE_AMOUNT,
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
} from "../../libs/utils";
import { LightTooltip } from "../../styles/MUI";
import "./styles";
import SwapLimitModal from "./SwapLimitModal";

type SwapTokenType = {
  src: string;
  dest: string;
};

type SwapTokenBalanceType = {
  src: BigNumber;
  dest: BigNumber;
};

const Swap: FC = () => {
  const classPrefix = "swap";
  const { chainId, account, library } = useWeb3();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [priceValue, setPriceValue] = useState<BigNumber>();
  const [swapToken, setSwapToken] = useState<SwapTokenType>({
    src: "USDT",
    dest: "NEST",
  });
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [limitOut, setLimitOut] = useState<number>(5);
  const [swapTokenBalance, setSwapTokenBalance] =
    useState<SwapTokenBalanceType>();
  const [destValue, setDestValue] = useState<BigNumber>();
  const { pendingList, txList } = useTransactionListCon();
  const uniSwapV2OJ = UniSwapV2(UniSwapV2Contract);
  const modal = useRef<any>();

  const exchangeSwapTokens = () => {
    if (swapToken.src === "DCU" || swapToken.src === "NHBTC") {
      return;
    }
    setSwapToken({ src: swapToken.dest, dest: swapToken.src });
    setInputValue("");
  };
  const approveAddress = useCallback(() => {
    if (!chainId) {
      return "";
    }
    if (swapToken.src === "DCU") {
      return PVMPayBackContract[chainId];
    } else if (swapToken.src === "NHBTC") {
      return NESTRedeemContract[chainId];
    } else {
      return UniSwapV2Contract[chainId];
    }
  }, [chainId, swapToken.src]);
  // balance
  const getBalance = useCallback(async () => {
    if (!chainId || !account || !library) {
      return;
    }
    const srcTokenBalance = await getERC20Contract(
      tokenList[swapToken.src].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    const destTokenBalance = await getERC20Contract(
      tokenList[swapToken.dest].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    setSwapTokenBalance({ src: srcTokenBalance, dest: destTokenBalance });
  }, [account, chainId, library, swapToken]);

  useEffect(() => {
    getBalance();
  }, [account, chainId, getBalance, library, swapToken]);

  useEffect(() => {
    if (!txList || txList.length === 0) {
      return;
    }
    const latestTx = txList[txList.length - 1];
    if (
      latestTx.txState === 1 &&
      (latestTx.type === 4 || latestTx.type === 9)
    ) {
      setTimeout(() => {
        getBalance();
      }, 4000);
    }
  }, [getBalance, txList]);
  // approve
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    const srcToken = getERC20Contract(
      tokenList[swapToken.src].addresses[chainId],
      library,
      account
    );
    if (!srcToken) {
      setSrcAllowance(BigNumber.from("0"));
      return;
    }
    (async () => {
      const allowance = await srcToken.allowance(account, approveAddress());
      setSrcAllowance(allowance);
    })();
  }, [account, approveAddress, chainId, library, swapToken, txList]);

  const path = useCallback(() => {
    if (swapToken.src === "DCU") {
      return ["DCU", "NEST"];
    } else if (swapToken.src === "NEST") {
      return ["NEST", "USDT"];
    } else if (swapToken.src === "USDT") {
      return ["USDT", "NEST"];
    } else if (swapToken.src === "NHBTC") {
      return ["NHBTC", "NEST"];
    }
    return [swapToken.src, swapToken.dest];
  }, [swapToken]);
  const checkUSDT = useCallback(
    (token: string) => {
      if (!chainId) {
        return;
      }
      if ((chainId === 1 || chainId === 5) && token === "USDT") {
        return 6;
      } else {
        return 18;
      }
    },
    [chainId]
  );

  useEffect(() => {
    if (!chainId || !library || !account) {
      return;
    }

    const swapHBTCToNEST = (amountIn: BigNumber) => {
      return amountIn.div(BigNumber.from("2"));
    };

    const swapDCUToNEST = async (amountIn: BigNumber) => {
      return amountIn
        .mul(BigNumber.from("7768161615"))
        .div(BigNumber.from("1000000000"));
    };

    const swapUniSwapV2 = async (amountIn: BigNumber, path: Array<string>) => {
      const pathAddress = path.map((item) => {
        return tokenList[item].addresses[chainId];
      });
      const amountOut = await uniSwapV2OJ?.getAmountsOut(amountIn, pathAddress);
      return amountOut[1];
    };

    (async () => {
      const usePath = path();
      const checkInputValue =
        inputValue &&
        normalToBigNumber(inputValue, checkUSDT(swapToken.src)).gt(
          BigNumber.from("0")
        );
      const baseAmount = () => {
        if ((chainId === 1 || chainId === 5) && swapToken.src === "USDT") {
          return BigNumber.from("1000000");
        } else {
          return BASE_AMOUNT;
        }
      };
      var amount = checkInputValue
        ? normalToBigNumber(inputValue!, checkUSDT(swapToken.src))
        : baseAmount();
      for (let index = 0; index < usePath.length - 1; index++) {
        if (usePath[index] === "USDT" || usePath[index] === "NEST") {
          amount = await swapUniSwapV2(amount, [
            usePath[index],
            usePath[index + 1],
          ]);
        } else if (usePath[index] === "DCU" && usePath[index + 1] === "NEST") {
          amount = await swapDCUToNEST(amount);
        } else if (
          usePath[index] === "NHBTC" &&
          usePath[index + 1] === "NEST"
        ) {
          amount = swapHBTCToNEST(amount);
        }
      }
      setDestValue(checkInputValue ? amount : undefined);
      const priceValue = () => {
        if ((chainId === 1 || chainId === 5) && swapToken.src === "USDT") {
          return checkInputValue
            ? amount
                .mul(BASE_AMOUNT)
                .div(
                  inputValue
                    ? normalToBigNumber(inputValue, checkUSDT(swapToken.src))
                    : BASE_AMOUNT
                )
                .div(BigNumber.from("1000000000000"))
            : amount;
        } else {
          return checkInputValue
            ? amount
                .mul(BASE_AMOUNT)
                .div(
                  inputValue
                    ? normalToBigNumber(inputValue, checkUSDT(swapToken.src))
                    : BASE_AMOUNT
                )
            : amount;
        }
      };
      setPriceValue(priceValue());
    })();
  }, [
    account,
    chainId,
    library,
    swapToken,
    inputValue,
    path,
    uniSwapV2OJ,
    checkUSDT,
  ]);

  const getSelectedSrcToken = (token: TokenType) => {
    if (token.symbol === "DCU") {
      setSwapToken({ src: token.symbol, dest: "NEST" });
    } else if (token.symbol === "NEST") {
      setSwapToken({ src: token.symbol, dest: "USDT" });
    } else if (token.symbol === "USDT") {
      setSwapToken({ src: token.symbol, dest: "NEST" });
    } else if (token.symbol === "NHBTC") {
      setSwapToken({ src: token.symbol, dest: "NEST" });
    }
  };

  const tokenListShow = (top: boolean) => {
    const allToken =
      chainId === 56
        ? ["NEST", "USDT"]
        : ["DCU", "NEST", "USDT", "NHBTC"];
    if (top) {
      const leftToken = allToken.filter(
        (item: string) => [swapToken.src].indexOf(item) === -1
      );
      const tokenName = leftToken;
      return tokenName.map((item) => {
        return tokenList[item];
      });
    }
  };

  const checkBalance = () => {
    if (!swapTokenBalance) {
      return false;
    }
    if (!inputValue) {
      return true;
    }
    if (
      normalToBigNumber(inputValue, checkUSDT(swapToken.src)).gt(
        swapTokenBalance.src
      )
    ) {
      return false;
    }
    return true;
  };
  const checkAllowance = () => {
    if (!inputValue) {
      return true;
    }
    if (
      srcAllowance.lt(normalToBigNumber(inputValue, checkUSDT(swapToken.src)))
    ) {
      return false;
    }
    return true;
  };
  const checkButton = () => {
    if (!checkAllowance()) {
      return true;
    }
    if (
      !inputValue ||
      !destValue ||
      normalToBigNumber(inputValue, checkUSDT(swapToken.src)).eq(
        BigNumber.from("0")
      )
    ) {
      return false;
    }
    if (checkBalance()) {
      return true;
    }
    return false;
  };
  const approve = useERC20Approve(swapToken.src, MaxUint256, approveAddress());
  const amountOutMin = destValue
    ? destValue.sub(destValue.mul(limitOut).div(1000))
    : MaxUint256;
  const addressPath = () => {
    if (!chainId) {
      return [];
    }
    return path().map((item) => tokenList[item].addresses[chainId]);
  };

  const swap = usePVMPayBack(normalToBigNumber(inputValue ? inputValue : ""));
  const uniswapV2Swap = useUniSwapV2Swap(
    normalToBigNumber(inputValue ? inputValue : "", checkUSDT(swapToken.src)),
    amountOutMin,
    addressPath(),
    account ? account : ""
  );
  const redeem = useNESTRedeemRedeem(
    normalToBigNumber(inputValue ? inputValue : "")
  );
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.swap
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const hideSlippage = () => {
    if (swapToken.src === "DCU" || swapToken.src === "NHBTC") {
      return true;
    }
    return false;
  };

  const selectTokenLi = (tokenList: TokenType[]) => {
    return tokenList.map((item, index) => {
      const TokenIcon = item.Icon;
      return (
        <li
          onClick={() => {
            getSelectedSrcToken(item);
            setAnchorEl(null);
          }}
          key={`selectTokenLi+${index}`}
        >
          <TokenIcon />
          <p>{`${item.symbol}`}</p>
        </li>
      );
    });
  };

  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <InfoShow
          topLeftText={t`From`}
          bottomRightText={
            t`Balance` +
            `:${
              swapTokenBalance
                ? bigNumberToNormal(
                    swapTokenBalance.src,
                    checkUSDT(swapToken.src),
                    6
                  )
                : "---"
            } ${swapToken.src}`
          }
          tokenSelect={false}
          tokenList={tokenListShow(true)}
          getSelectedToken={getSelectedSrcToken}
          balanceRed={!checkBalance()}
        >
          <div
            className={`${classPrefix}-card-selected`}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <SingleTokenShow tokenNameOne={swapToken.src} isBold />
            <p>{<PutDownIcon />}</p>
          </div>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            className={`${classPrefix}-card-selectToken`}
          >
            <ul>{selectTokenLi(tokenListShow(true) ?? [])}</ul>
          </Popover>

          <input
            placeholder={t`Input`}
            className={"input-middle"}
            value={inputValue}
            maxLength={32}
            onChange={(e) => setInputValue(formatInputNum(e.target.value))}
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setInputValue(
                bigNumberToNormal(
                  swapTokenBalance?.src || BigNumber.from("0"),
                  checkUSDT(swapToken.src),
                  18
                )
              )
            }
          >
            MAX
          </button>
        </InfoShow>
        <button
          className={classNames({
            [`${classPrefix}-card-exchange`]: true,
            [`disable`]:
              swapToken.src === "DCU" || swapToken.src === "NHBTC"
                ? true
                : false,
          })}
          onClick={() => {
            exchangeSwapTokens();
          }}
        >
          <ExchangeIcon />
        </button>
        <InfoShow
          topLeftText={t`To(Estimated)`}
          bottomRightText={
            t`Balance` +
            `:${
              swapTokenBalance
                ? bigNumberToNormal(
                    swapTokenBalance.dest,
                    checkUSDT(swapToken.dest),
                    6
                  )
                : "---"
            } ${swapToken.dest}`
          }
          tokenSelect={false}
          tokenList={tokenListShow(false)}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.dest} isBold />
          </div>
          <p className={"showValue"}>
            {destValue
              ? bigNumberToNormal(destValue, checkUSDT(swapToken.dest), 6)
              : undefined}
          </p>
        </InfoShow>
        {hideSlippage() ? (
          <></>
        ) : (
          <div className={`${classPrefix}-card-limit`}>
            <div>
              <LightTooltip
                placement="bottom-start"
                title={
                  "Setting a high slippage tolerance can help transactions succeed ,but you may not get such a good price .use with caution"
                }
                arrow
              >
                <span>
                  <Trans>Slippage Tolerance</Trans>
                </span>
              </LightTooltip>
              <Popup
                modal
                ref={modal}
                nested
                trigger={
                  <button>
                    <SwapLimitIcon />
                  </button>
                }
              >
                <SwapLimitModal
                  selected={limitOut}
                  callBack={(value: number) => {
                    setLimitOut(value);
                  }}
                />
              </Popup>
            </div>

            {/* <p>{`${(limitOut / 10).toFixed(1)} %`}</p> */}
            <p>{''}</p>
          </div>
        )}

        <div className={`${classPrefix}-card-trading`}>
          <span>
            <Trans>Trading Price</Trans>
          </span>
          <p>{`1 ${swapToken.src} = ${
            priceValue
              ? bigNumberToNormal(priceValue, checkUSDT(swapToken.dest), 10)
              : "---"
          } ${swapToken.dest}`}</p>
        </div>
        <MainButton
          disable={!checkButton() || mainButtonState()}
          onClick={() => {
            if (!checkButton() || mainButtonState()) {
              return;
            }
            if (checkAllowance()) {
              if (!chainId) {
                return;
              }
              if (swapToken.src === "DCU") {
                swap();
              } else if (swapToken.src === "NHBTC") {
                redeem();
              } else {
                uniswapV2Swap();
              }
            } else {
              approve();
            }
          }}
          loading={mainButtonState()}
        >
          {checkAllowance() ? <Trans>Swap</Trans> : <Trans>Approve</Trans>}
        </MainButton>
      </MainCard>
    </div>
  );
};

export default Swap;
