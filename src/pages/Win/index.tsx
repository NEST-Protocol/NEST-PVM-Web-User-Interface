import { Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import classNames from "classnames";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AddIcon, AddTokenIcon, Chance, SubIcon } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { SingleTokenShow } from "../../components/TokenShow";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import { usePVMWinRoll } from "../../contracts/hooks/usePVMWinTransation";
import { PVMWinContract, tokenList } from "../../libs/constants/addresses";
import {
  PVMWin,
  getERC20Contract,
} from "../../libs/hooks/useContract";
import { useEtherscanAddressBaseUrl } from "../../libs/hooks/useEtherscanBaseUrl";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatPVMWinInputNum,
  normalToBigNumber,
  showEllipsisAddress2,
  WIN_GET_STRING,
  ZERO_ADDRESS,
} from "../../libs/utils";
import "./styles";
import WinOrderList from "./WinOrderList";

export type WinListType = {
  gained: BigNumber;
  index: BigNumber;
  m: BigNumber;
  n: BigNumber;
  openBlock: BigNumber;
  open_block: BigNumber;
  owner: string;
};

const Win: FC = () => {
  const classPrefix = "win";
  const { chainId, account, library } = useWeb3();
  const [chance, setChance] = useState<String>("1.10");
  const [nestNum, setNESTNum] = useState<String>("1.00");
  const [winPendingList, setWinPendingList] = useState<Array<WinListType>>([]);
  const [historyList, setHistoryList] = useState<Array<WinListType>>([]);
  const [allBetsData, setAllBetsData] = useState<Array<WinListType>>([]);
  const [allBetsShow, setAllBetsShow] = useState<Array<WinListType>>([]);
  const [allBetsShowCount, setAllBetsShowCount] = useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<Array<WinListType>>([]);
  const [nowBlock, setNowBlock] = useState<number>(0);
  const [NESTBalance, setNESTBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const PVMWinOJ = PVMWin(PVMWinContract);
  const { pendingList, txList } = useTransactionListCon();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [nestAllowance, setNestAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );

  const addressBaseUrl = useEtherscanAddressBaseUrl();

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

  useEffect(() => {
    getBalance();
  }, [getBalance, txList]);

  const getList = useCallback(async () => {
    if (!PVMWinOJ || !chainId) {
      return;
    }

    const latest = await library?.getBlockNumber();
    if (!latest) {
      return;
    }
    const allBets_get = await fetch("https://api.hedge.red/api/" + WIN_GET_STRING[chainId] + "/list/0/10");
    const allBets_data = await allBets_get.json();
    const allBets_data_modol = allBets_data.value.filter(
      (item: WinListType) => item.owner !== ZERO_ADDRESS
    );
    const weekly_get = await fetch("https://api.hedge.red/api/" + WIN_GET_STRING[chainId] + "/weekList/10");
    const weekly_data = await weekly_get.json();
    const weekly_data_modol = weekly_data.value.filter(
      (item: WinListType) => item.owner !== ZERO_ADDRESS
    );
    const myBetsUrl = "https://api.hedge.red/api/" + WIN_GET_STRING[chainId] + `/userList/${account}/200`;
    const myBets_get = await fetch(myBetsUrl);
    const myBets_data = await myBets_get.json();
    const myBets_data_modol = myBets_data.value.filter(
      (item: WinListType) => item.owner !== ZERO_ADDRESS
    );

    const listResult = await PVMWinOJ.find44("0", "200", "200", account);
    const result = listResult.filter(
      (item: WinListType) => item.owner !== ZERO_ADDRESS
    );
    var history = myBets_data_modol;
    const pending = result.filter(
      (item: WinListType) =>
        BigNumber.from(item.n.toString()).gt(BigNumber.from("0")) &&
        BigNumber.from(item.openBlock.toString())
          .add(BigNumber.from(256))
          .gt(latest) &&
        BigNumber.from(item.gained.toString()).gt(BigNumber.from("0"))
    );

    for (var i = 0; i < pending.length; i++) {
      for (var j = 0; j < myBets_data_modol.length; j++) {
        if (
          pending[i].owner.toLowerCase() ===
            myBets_data_modol[j].owner.toLowerCase() &&
          pending[i].index.toString() === myBets_data_modol[j].index.toString()
        ) {
          history.splice(j, 1);
        }
      }
    }

    setHistoryList(history);
    setWinPendingList(pending.reverse());
    setNowBlock(latest);
    setAllBetsData(allBets_data_modol.reverse());
    setWeeklyData(weekly_data_modol);
  }, [PVMWinOJ, chainId, library, account]);

  useEffect(() => {
    const time = setTimeout(() => {
      if (allBetsData.length > 0) {
        if (allBetsData.length === 1) {
          setAllBetsShow([
            allBetsData[0]
          ]);
          setAllBetsShowCount(0);
        } else {
          setAllBetsShow([
            allBetsData[allBetsShowCount],
            allBetsData[allBetsShowCount + 1],
          ]);
          setAllBetsShowCount(allBetsShowCount + 1);
        }
        
      }
    }, 1500);
    return () => {
      clearTimeout(time);
      if (allBetsShowCount === allBetsData.length - 2) {
        setAllBetsShowCount(0);
      }
    };
  }, [allBetsData, allBetsShowCount]);

  useEffect(() => {
    getList();
    if (
      txList.length !== 0 &&
      (!txList ||
        (txList[txList.length - 1].type !== TransactionType.roll &&
          txList[txList.length - 1].type !== TransactionType.winClaim) ||
        txList[txList.length - 1].txState !== 1)
    ) {
      return;
    }
    const id = setInterval(() => {
      getList();
    }, 10 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getList, chainId, txList]);

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
  const { ethereum } = window;
  const addToken = async () => {
    if (!chainId) {
      return;
    }

    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenList["NEST"].addresses[chainId], // The address that the token is at.
          symbol: "NEST", // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image:
            "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenNest.svg", // A string url of the token logo
        },
      },
    });
  };

  const weekly_li = weeklyData.map((item) => {
    const url = addressBaseUrl + item.owner;
    return (
      <li key={item.owner + "weekly"}>
        <p>
          <a href={url} target="view_window">
            {showEllipsisAddress2(item.owner)}
          </a>
        </p>
        <p>{item.gained} NEST</p>
      </li>
    );
  });

  const weeklyRanks = () => {
    return (
      <div className={`${classPrefix}-otherList-weekly`}>
        <p className={`${classPrefix}-otherList-weekly-title`}>Weekly Ranks</p>
        <ul>{weekly_li}</ul>
      </div>
    );
  };

  const allBets_li = allBetsShow.map((item) => {
    const url = addressBaseUrl + item.owner;
    return (
      <li key={item.owner + item.index.toString() + "all"}>
        <p>{item.open_block}</p>
        <p>
          <a href={url} target="view_window">
            {showEllipsisAddress2(item.owner)}
          </a>
        </p>
        <p>{item.gained} NEST</p>
      </li>
    );
  });

  const allBets = () => {
    return (
      <div className={`${classPrefix}-otherList-allBets`}>
        <p className={`${classPrefix}-otherList-allBets-title`}>Live Claim</p>
        <ul>{allBets_li}</ul>
      </div>
    );
  };

  const confirm = usePVMWinRoll(
    normalToBigNumber(nestNum.valueOf(), 4),
    normalToBigNumber(chance.valueOf(), 4)
  );
  const approve = useERC20Approve(
    'NEST',
    MaxUint256,
    chainId ? PVMWinContract[chainId] : undefined
  );

  const mainButtonPending = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.roll
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const winChance = (100 / parseFloat(chance.toString())).toFixed(2);
  const payout = (
    parseFloat(chance.toString()) * parseFloat(nestNum.toString())
  ).toFixed(2);
  const changePayout = (num: number) => {
    const result =
      parseFloat(nestNum.valueOf() === "" ? "1" : nestNum.valueOf()) * num;
    const resultString = formatPVMWinInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 1000) {
      setNESTNum("1000.00");
    } else if (parseFloat(resultString) < 1) {
      setNESTNum("1.00");
    } else {
      setNESTNum(resultString);
    }
  };
  const checkChance = () => {
    const result = parseFloat(chance.valueOf());
    const resultString = formatPVMWinInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 100 || parseFloat(resultString) < 1.1) {
      return false;
    } else {
      return true;
    }
  };
  const checkWinNum = () => {
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
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-left`}>
        <MainCard classNames={`${classPrefix}-card`}>
          <p className={`${classPrefix}-card-title`}>Win NEST</p>
          <InfoShow
            topLeftText={"Multiplier"}
            topRightText={"Limitation: 1.1-100"}
            topRightRed={!checkChance()}
            bottomRightText={`Win Chance: ${
              winChance === "NaN" ? "---" : winChance
            } %`}
            popText={"Win Chance = 1 / Multiplier"}
          >
            <input
              type="text"
              placeholder={"Input"}
              className={"input-left"}
              value={chance.valueOf()}
              maxLength={6}
              onChange={(e) => {
                const resultString = formatPVMWinInputNum(e.target.value);
                setChance(resultString);
              }}
            />
            <p className={`${classPrefix}-card-x`}>X</p>
            <button
              onClick={() => {
                const result = Math.floor(Math.random() * 9890 + 110);
                const resultString = formatPVMWinInputNum(
                  (parseFloat(result.toString()) / 100).toFixed(2).toString()
                );
                setChance(resultString);
              }}
            >
              <Chance />
            </button>
          </InfoShow>
          <InfoShow
            topLeftText={"Bet Amount"}
            bottomRightText={`${"Reward"}: ${
              payout === "NaN" ? "---" : payout
            } NEST`}
            bottomLeftText={`Rolling Fee: ${bigNumberToNormal(normalToBigNumber(nestNum.valueOf(), 18).div(100), 18, 6)} NEST`}
            topRightText={"Limitation: 1-1000"}
            topRightRed={!checkWinNum()}
            popText={"Reward = Multiplier * Bet Amount"}
          >
            <SingleTokenShow tokenNameOne={"NEST"} isBold />
            <input
              type="text"
              placeholder={`Input`}
              className={"input-middle"}
              value={nestNum.valueOf()}
              maxLength={7}
              onChange={(e) => {
                const resultString = formatPVMWinInputNum(e.target.value);
                setNESTNum(resultString);
              }}
            />
            <button className={"sub-button"} onClick={() => changePayout(0.5)}>
              <SubIcon />
            </button>
            <button className={"add-button"} onClick={() => changePayout(2)}>
              <AddIcon />
            </button>
          </InfoShow>
          <MainButton
            className={`${classPrefix}-card-button`}
            onClick={() => {
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
            loading={mainButtonPending()}
          >
            {checkAllowance() ? (<Trans>Roll</Trans>) : ('Approve')}
          </MainButton>
          <div className={`${classPrefix}-card-bottom`}>
            <p className={`${classPrefix}-card-fairness`}>
              <Tooltip
                placement="bottom"
                color={"#ffffff"}
                title={
                  <div>
                    <p>{`1) Combining the HASH of the first block after the 'roll' with the index number assigned to the 'roll', the protocol computes the corresponding HASH and transforms it to an integer with a length of 32 bytes.`}</p>
                    <p>{`2) Divide this integer by the product of 10000 and the chosen multiplier. The winner should have the remainder smaller than 10000.`}</p>
                  </div>
                }
              >
                <span>Fairness</span>
              </Tooltip>
            </p>
            <p
              className={classNames({
                [`${classPrefix}-card-balance`]: true,
                [`${classPrefix}-card-balance-red`]: !checkBalance(),
              })}
            >
              <Tooltip
                placement="right"
                color={"#ffffff"}
                title={
                  <button
                    className={`${classPrefix}-card-balance-add`}
                    onClick={() => addToken()}
                  >
                    <AddTokenIcon />
                    <p>Add NEST to your wallet</p>
                  </button>
                }
              >
                <span>
                  Balance: {bigNumberToNormal(NESTBalance, 18, 6)} NEST
                </span>
              </Tooltip>
            </p>
          </div>
        </MainCard>
        <WinOrderList
          historyList={historyList}
          pendingList={winPendingList}
          nowBlock={nowBlock}
        />
      </div>
      <div className={`${classPrefix}-right`}>
        <MainCard classNames={`${classPrefix}-otherList`}>
          {weeklyRanks()}
          <p className={`${classPrefix}-otherList-line`}></p>
          {allBets()}
        </MainCard>
      </div>
    </div>
  );
};

export default Win;
