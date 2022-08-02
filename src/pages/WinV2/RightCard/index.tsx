import { FC, useEffect, useMemo, useRef, useState } from "react";
import "./styles";
import MainCard from "../../../components/MainCard";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import PendingClock from "../../../components/WinPendingItem/PendingClock";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  BLOCK_TIME,
  showEllipsisAddress,
  WINV2_GET_STRING,
  ZERO_ADDRESS,
} from "../../../libs/utils";
import { BigNumber } from "ethers";
import {
  useEtherscanAddressBaseUrl,
  useEtherscanBaseUrl,
} from "../../../libs/hooks/useEtherscanBaseUrl";
import Popup from "reactjs-popup";
import WinV2Modal from "../WinV2Modal";
import moment from "moment";
import { WinOKIcon, WinXIcon } from "../../../components/Icon";
import { usePVMWinClaim } from "../../../contracts/hooks/usePVMWinTransation";
import useTransactionListCon, {
  TransactionType,
} from "../../../libs/hooks/useTransactionInfo";

export type WinV2WeeklyData = {
  owner: string;
  gained: string;
  count: string;
};

export type WinV2BetData = {
  bet: string;
  chance: string;
  multiplier: string;
  index: string;
  claim: string;
  time: string;
  openBlock: string;
  profit: string;
  hash: string;
};

const WinV2RightCard: FC = () => {
  const classPrefix = "winV2-rightCard";
  const { chainId, account, library } = useWeb3();
  const [tabNum, setTabNum] = useState<Number>(1);
  const [weeklyData, setWeeklyData] = useState<Array<WinV2WeeklyData>>([]);
  const [allBetData, setAllBetData] = useState<Array<WinV2BetData>>([]);
  const [myBetData, setMyBetData] = useState<Array<WinV2BetData>>([]);
  const [latestBlock, setLatestBlock] = useState<number>();
  const chainArray = useMemo(() => {
    return [1, 4, 56, 97];
  }, []);
  const addressBaseUrl = useEtherscanAddressBaseUrl();
  const hashBaseUrl = useEtherscanBaseUrl();

  // week data
  useEffect(() => {
    const chain_id =
      (chainArray.indexOf(chainId ?? 56) > -1 ? chainId : 56) ?? 56;
    const getList = async () => {
      const weekly_get = await fetch(
        "https://api.hedge.red/api/" +
          WINV2_GET_STRING[chain_id] +
          "/weekList/50"
      );
      const weekly_data = await weekly_get.json();
      const weekly_data_model = weekly_data.value.filter(
        (item: WinV2WeeklyData) => item.owner !== ZERO_ADDRESS
      );
      setWeeklyData(weekly_data_model);
      const latest = await library?.getBlockNumber();
      setLatestBlock(latest ?? 0);
    };

    getList();
    const time = setInterval(() => {
      getList();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [chainArray, chainId, library]);

  // my bet
  useEffect(() => {
    const chain_id =
      (chainArray.indexOf(chainId ?? 56) > -1 ? chainId : 56) ?? 56;
    const getList = async () => {
      const myBet_get = await fetch(
        "https://api.hedge.red/api/" +
          WINV2_GET_STRING[chain_id] +
          "/mybet/" +
          account +
          "/200"
      );
      const myBet_data = await myBet_get.json();

      setMyBetData(myBet_data.value);
    };
    getList();
    const time = setInterval(() => {
      getList();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [account, chainArray, chainId]);

  // all bet
  useEffect(() => {
    const chain_id =
      (chainArray.indexOf(chainId ?? 56) > -1 ? chainId : 56) ?? 56;

    const getList = async () => {
      const allBet_get = await fetch(
        "https://api.hedge.red/api/" +
          WINV2_GET_STRING[chain_id] +
          "/allBet/200"
      );
      const allBet_data = await allBet_get.json();
      setAllBetData(allBet_data.value);
    };
    getList();
    const time = setInterval(() => {
      getList();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [chainArray, chainId]);

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
          <span>MY BET</span>
        </li>
        <li
          className={classNames({
            [`selected`]: tabNum === 2,
          })}
          onClick={() => setTabNum(2)}
        >
          <span>ALL BET</span>
        </li>
        <li
          className={classNames({
            [`selected`]: tabNum === 3,
          })}
          onClick={() => setTabNum(3)}
        >
          <span>WEEKLY RANK</span>
        </li>
      </ul>
    );
  };

  // mainView
  const mainView = () => {
    const trMyBet = () => {
      if (myBetData.length === 0) {
        return <></>;
      }
      return myBetData.map((item, index) => {
        return (
          <WinV2BetList
            key={`trMyBet${index}`}
            item={item}
            index={index}
            latestBlock={latestBlock ?? 0}
          />
        );
      });
    };
    const trAllBet = () => {
      return allBetData.map((item, index) => {
        const url = hashBaseUrl + item.hash;
        const profit = Number(item.profit) > 0 ? true : false;
        return (
          <tr key={`trAllBet${index}`}>
            <td className="tdHash">
              <a href={url} target="view_window">
                {showEllipsisAddress(item.hash)}
              </a>
            </td>
            <td>{item.bet}</td>
            <td>{item.multiplier} X</td>
            <td>{item.chance}%</td>
            <td>{moment(Number(item.time) * 1000).format("MM[-]DD HH:mm")}</td>
            <td
              className={classNames({ [`tdProfit`]: true, [`profit`]: profit })}
            >
              {item.profit}
            </td>
          </tr>
        );
      });
    };
    const trWeekly = () => {
      return weeklyData.map((item, index) => {
        const url = addressBaseUrl + item.owner;
        const cup = () => {
          if (index === 0) {
            return <img src="/Gold_icon.png" alt="gold" />;
          } else if (index === 1) {
            return <img src="/Silver_icon.png" alt="silver" />;
          } else if (index === 2) {
            return <img src="/Bronze_icon.png" alt="bronze" />;
          } else {
            return <></>;
          }
        };
        return (
          <tr key={`trWeekly${item.owner}`}>
            <td className={`weeklyFirst`}>
              <p>{index + 1}</p>
              {cup()}
            </td>
            <td>
              <a href={url} target="view_window">
                {showEllipsisAddress(item.owner)}
              </a>
            </td>
            <td>{item.gained}</td>
          </tr>
        );
      });
    };
    if (tabNum === 1) {
      return (
        <div className={`${classPrefix}-mainView-myBet`}>
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Bet</th>
                <th>Multiplier</th>
                <th>Chance</th>
                <th>Time</th>
                <th>Profit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{trMyBet()}</tbody>
            <tfoot></tfoot>
          </table>
        </div>
      );
    } else if (tabNum === 2) {
      return (
        <div className={`${classPrefix}-mainView-allBet`}>
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Bet</th>
                <th>Multiplier</th>
                <th>Chance</th>
                <th>Time</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>{trAllBet()}</tbody>
            <tfoot></tfoot>
          </table>
        </div>
      );
    } else if (tabNum === 3) {
      return (
        <div className={`${classPrefix}-mainView-week`}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Address</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody>{trWeekly()}</tbody>
            <tfoot></tfoot>
          </table>
        </div>
      );
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

export default WinV2RightCard;

export type WinV2BetListData = {
  item: WinV2BetData;
  index: number;
  latestBlock: number;
  key: string;
};

export const WinV2BetList: FC<WinV2BetListData> = ({ ...props }) => {
  const { chainId } = useWeb3();
  const modal = useRef<any>();
  const [showModal, setShowModal] = useState<WinV2BetData>();
  const hashBaseUrl = useEtherscanBaseUrl();
  const { pendingList } = useTransactionListCon();
  const url = hashBaseUrl + props.item.hash;
  const profit = Number(props.item.profit) > 0 ? true : false;
  const claimBool = props.item.claim === "true" ? true : false;
  const claim = usePVMWinClaim(BigNumber.from(props.item.index));
  const loadingButton = () => {
    const claimTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.winClaim
    );
    return claimTx.length > 0 ? true : false;
  };
  const buttonState = () => {
    if (props.item.claim === 'true' || loadingButton()) {
      return true;
    }
    return false;
  };
  const lastTr = () => {
    if (!profit) {
      return <td></td>;
    }
    if (profit && claimBool) {
      return (
        <td className={`ok`}>
          <WinOKIcon />
        </td>
      );
    }
    if (
      profit &&
      !claimBool &&
      Number(props.item.openBlock) + 256 > (props.latestBlock ?? 0)
    ) {
      const leftTime =
        Number(props.item.openBlock) + 256 - (props.latestBlock ?? 0) > 0
          ? ((Number(props.item.openBlock) + 256 - (props.latestBlock ?? 0)) *
              BLOCK_TIME[chainId ?? 56]) /
            1000
          : 0;
      return (
        <td className={`claim`}>
          <PendingClock
            allTime={(256 * BLOCK_TIME[chainId ?? 56]) / 1000}
            leftTime={leftTime}
            index={props.index}
          />
          <MainButton
            onClick={() => {
              if (buttonState() || loadingButton()) {
                return;
              }
              claim();
            }}
            disable={buttonState()}
            loading={loadingButton()}
          >
            Claim
          </MainButton>
        </td>
      );
    } else {
      return (
        <td className={`x`}>
          <WinXIcon />
        </td>
      );
    }
  };
  return (
    <tr key={`trMyBet${props.index}`}>
      {showModal ? (
        <Popup
          ref={modal}
          open
          onClose={() => {
            setShowModal(undefined);
          }}
        >
          <WinV2Modal onClose={() => modal.current.close()} item={showModal} />
        </Popup>
      ) : null}
      <td className="tdHash">
        {props.item.hash === undefined ? (
          "---"
        ) : (
          <a href={url} target="view_window">
            {showEllipsisAddress(props.item.hash)}
          </a>
        )}
      </td>
      <td onClick={() => setShowModal(props.item)}>{props.item.bet}</td>
      <td onClick={() => setShowModal(props.item)}>{props.item.multiplier} X</td>
      <td onClick={() => setShowModal(props.item)}>{props.item.chance}%</td>
      <td onClick={() => setShowModal(props.item)}>
        {moment(Number(props.item.time) * 1000).format("MM[-]DD HH:mm:ss")}
      </td>
      <td className={classNames({ [`tdProfit`]: true, [`profit`]: profit })} onClick={() => setShowModal(props.item)}>
        {props.item.profit}
      </td>
      {lastTr()}
    </tr>
  );
};
