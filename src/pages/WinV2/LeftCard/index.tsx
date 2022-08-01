import { FC, useCallback, useEffect, useState } from "react";
import "./styles";
import { MaxUint256 } from "@ethersproject/constants";
import MainCard from "../../../components/MainCard";
import { Chance, HowToPlay, Provably } from "../../../components/Icon";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import { SingleTokenShow } from "../../../components/TokenShow";
import { bigNumberToNormal, formatPVMWinInputNum, normalToBigNumber } from "../../../libs/utils";
import { usePVMWinRoll } from "../../../contracts/hooks/usePVMWinTransation";
import { getERC20Contract } from "../../../libs/hooks/useContract";
import { PVMWinContract, tokenList } from "../../../libs/constants/addresses";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { BigNumber } from "ethers";
import useTransactionListCon, { TransactionType } from "../../../libs/hooks/useTransactionInfo";
import { useERC20Approve } from "../../../contracts/hooks/useERC20Approve";

const WinV2LeftCard: FC = () => {
  const classPrefix = "winV2-leftCard";
  const { chainId, account, library } = useWeb3();
  const [chance, setChance] = useState<String>("1.10");
  const [nestNum, setNESTNum] = useState<String>("1.00");
  const [tabNum, setTabNum] = useState<Number>(1);
  const [NESTBalance, setNESTBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [nestAllowance, setNestAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const { pendingList, txList } = useTransactionListCon();
  
  

  const confirm = usePVMWinRoll(
    normalToBigNumber(nestNum.valueOf(), 4),
    normalToBigNumber(chance.valueOf(), 4)
  );
  const approve = useERC20Approve(
    'NEST',
    MaxUint256,
    chainId ? PVMWinContract[chainId] : undefined
  );
  // balance
  const getBalance = useCallback(async () => {
    if (!chainId || !account || !library) {
      return;
    }
    const NESTBalance = await getERC20Contract(
      tokenList["NEST"].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    setNESTBalance(NESTBalance);
  }, [account, chainId, library]);
  // approve
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    const nestToken = getERC20Contract(
      tokenList["NEST"].addresses[chainId],
      library,
      account
    );
    if (!nestToken) {
      setNestAllowance(BigNumber.from("0"));
      return;
    }
    (async () => {
      const allowance = await nestToken.allowance(account, PVMWinContract[chainId]);
      setNestAllowance(allowance);
    })();
  }, [account, chainId, library, txList]);

  useEffect(() => {
    getBalance();
  }, [getBalance, txList]);
  
  const winChance = (100 / parseFloat(chance.toString())).toFixed(2);
  const payout = (
    parseFloat(chance.toString()) * parseFloat(nestNum.toString())
  ).toFixed(2);
  const checkChance = () => {
    if (chance.valueOf() === "") {
      return false;
    }
    const result = parseFloat(chance.valueOf());
    const resultString = formatPVMWinInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 100 || parseFloat(resultString) < 1.1) {
      return false;
    } else {
      return true;
    }
  };
  const checkWinNum = () => {
    if (nestNum.valueOf() === "") {
      return false;
    }
    const result = parseFloat(nestNum.valueOf());
    const resultString = formatPVMWinInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 1000 || parseFloat(resultString) < 1) {
      return false;
    } else {
      return true;
    }
  };
  const checkBalance = () => {
    if (NESTBalance.gte(normalToBigNumber(nestNum.valueOf(), 18).mul(101).div(100))) {
      return true;
    } else {
      return false;
    }
  };
  const mainButtonPending = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.roll
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const checkMainButton = () => {
    if (!checkAllowance()) {
      return true;
    }
    if (
      !checkChance() ||
      !checkWinNum() ||
      mainButtonPending() ||
      !checkBalance()
    ) {
      return false;
    }
    return true;
  };
  const checkAllowance = () => {
    if (nestNum === '') {
      return true;
    }
    if (nestAllowance.lt(normalToBigNumber(nestNum.valueOf(), 18).mul(101).div(100))) {
      return false;
    }
    return true;
  };
  // top tab
  const topTab = () => {
    return (
      <ul className={`${classPrefix}-topTab`}>
        <li
          className={classNames({
            [`selected`]: tabNum === 1,
          })}
          onClick={() => setTabNum(1)}
        >
          <span>PLAY</span>
        </li>
        <li
          className={classNames({
            [`selected`]: tabNum === 2,
          })}
          onClick={() => setTabNum(2)}
        >
          <span>HOW TO PLAY</span>
          <HowToPlay />
        </li>
        <li
          className={classNames({
            [`selected`]: tabNum === 3,
          })}
          onClick={() => setTabNum(3)}
        >
          <span>PROVABLY</span>
          <Provably />
        </li>
      </ul>
    );
  };

  // bet
  const bet = () => {
    return (
      <div className={`${classPrefix}-mainView-play-mid1-bet`}>
        <p className={`${classPrefix}-mainView-play-mid1-bet-text`}>BET</p>
        <div className={`${classPrefix}-mainView-play-mid1-bet-input`}>
          <SingleTokenShow tokenNameOne={"NEST"} isBold />
          <input
            type="text"
            placeholder={`Input`}
            value={nestNum.valueOf()}
            maxLength={7}
            onChange={(e) => {
              const resultString = formatPVMWinInputNum(e.target.value);
              setNESTNum(resultString);
            }}
          />
        </div>
      </div>
    );
  };

  // show
  const show = (title: string, text: string) => {
    return (
      <div className={`${classPrefix}-mainView-play-mid1-show`}>
        <p className={`${classPrefix}-mainView-play-mid1-show-text`}>{title}</p>
        <p className={`${classPrefix}-mainView-play-mid1-show-num`}>{text}</p>
      </div>
    );
  };

  // choice
  const choice = (title: string, click: () => void) => {
    return <button onClick={click}>{title}</button>;
  };

  // mainView
  const mainView = () => {
    if (tabNum === 1) {
      return (
        <div className={`${classPrefix}-mainView-play`}>
          <div className={`${classPrefix}-mainView-play-top`}>
            <p
              className={classNames({
                [`${classPrefix}-mainView-play-top-limit`]: true,
                [`red`]: !checkChance(),
              })}
            >
              Limitation: 1.1-100
            </p>
            <div className={`${classPrefix}-mainView-play-top-input`}>
              <input
                type="text"
                placeholder={"Input"}
                value={chance.valueOf()}
                maxLength={6}
                onChange={(e) => {
                  const resultString = formatPVMWinInputNum(e.target.value);
                  setChance(resultString);
                }}
              />
              <p>X</p>
            </div>
            <div
              className={`${classPrefix}-mainView-play-top-random`}
              onClick={() => {
                const result = Math.floor(Math.random() * 9890 + 110);
                const resultString = formatPVMWinInputNum(
                  (parseFloat(result.toString()) / 100).toFixed(2).toString()
                );
                setChance(resultString);
              }}
            >
              <p className={`${classPrefix}-mainView-play-top-random-text`}>
                RANDOM
              </p>
              <Chance />
            </div>
          </div>
          <div className={`${classPrefix}-mainView-play-mid1`}>
            {bet()}
            {show("WIN CHANCE", `${winChance === "NaN" ? "---" : winChance} %`)}
            {show("WIN", `${payout === "NaN" ? "---" : payout}`)}
          </div>
          <div className={`${classPrefix}-mainView-play-mid2`}>
            <div className={`${classPrefix}-mainView-play-mid2-left`}>
              <div
                className={`${classPrefix}-mainView-play-mid2-left-buttonView`}
              >
                {choice("min", () => {
                  setNESTNum("1.00");
                })}
                {choice("1/2", () => {
                  const result = parseFloat(nestNum.valueOf()) / 2;
                  const resultString = formatPVMWinInputNum(result.toFixed(2));
                  setNESTNum(resultString);
                })}
                {choice("2X", () => {
                  const result = parseFloat(nestNum.valueOf()) * 2;
                  const resultString = formatPVMWinInputNum(result.toFixed(2));
                  setNESTNum(resultString);
                })}
                {choice("max", () => {
                  setNESTNum("1000.00");
                })}
              </div>
              <p
                className={classNames({
                  [`${classPrefix}-mainView-play-mid2-left-limit`]: true,
                  [`red`]: !checkWinNum(),
                })}
              >
                Limitation: 1-1000
              </p>
            </div>
          </div>
          <MainButton className={`${classPrefix}-mainView-play-mainButton`} onClick={() => {
              if (!checkMainButton()) {
                return;
              }
              if (checkAllowance()) {
                confirm();
              } else {
                approve();
              }
            }}
            disable={!checkMainButton()}
            loading={mainButtonPending()}>
          {checkAllowance() ? ('Roll') : ('Approve')}
          </MainButton>
          <div className={`${classPrefix}-mainView-play-otherInfo`}>
            <p className={`${classPrefix}-mainView-play-otherInfo-left`}>
              {`Rolling Fee: ${bigNumberToNormal(normalToBigNumber(nestNum.valueOf(), 18).div(100), 18, 6)} NEST`}
            </p>
            <p className={classNames({
              [`${classPrefix}-mainView-play-otherInfo-right`]: true,
              [`red`]: !checkBalance()
            })}>
              Balance: {bigNumberToNormal(NESTBalance, 18, 6)} NEST
            </p>
          </div>
        </div>
      );
    } else if (tabNum === 2) {
      return <div className={`${classPrefix}-mainView`}></div>;
    } else if (tabNum === 3) {
      return <div className={`${classPrefix}-mainView`}></div>;
    }
    return <div className={`${classPrefix}-mainView`}></div>;
  };

  return (
    <MainCard classNames={classPrefix}>
      {topTab()}
      {mainView()}
    </MainCard>
  );
};

export default WinV2LeftCard;
