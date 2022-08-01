import { FC, useEffect, useMemo, useRef, useState } from "react";
import "./styles";
import MainCard from "../../../components/MainCard";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import PendingClock from "../../../components/WinPendingItem/PendingClock";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
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
  claim: boolean;
  time: string;
  openBlock: string;
  profit: string;
  hash: string;
};

const WinV2RightCard: FC = () => {
  const classPrefix = "winV2-rightCard";
  const { chainId, account, library } = useWeb3();
  const modal = useRef<any>();
  const [tabNum, setTabNum] = useState<Number>(1);
  const [weeklyData, setWeeklyData] = useState<Array<WinV2WeeklyData>>([]);
  const [allBetData, setAllBetData] = useState<Array<WinV2BetData>>([]);
  const [myBetData, setMyBetData] = useState<Array<WinV2BetData>>([]);
  const [showModal, setShowModal] = useState<WinV2BetData>();
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
      console.log(weekly_data);
      setWeeklyData(weekly_data_model);
    };
    getList();
    const time = setTimeout(() => {
      getList();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [chainArray, chainId]);

  // my bet
  useEffect(() => {
    const chain_id =
      (chainArray.indexOf(chainId ?? 56) > -1 ? chainId : 56) ?? 56;
    const getList = async () => {
      const myBet_get = await fetch(
        "https://api.hedge.red/api/" +
          WINV2_GET_STRING[chain_id] +
          "/mybet/0x7b7ff8e7eaa4f0fee1535e1734f6228f970f8252/200"
      );
      const myBet_data = await myBet_get.json();
      setMyBetData(myBet_data.value);
    };
    getList();
    const time = setTimeout(() => {
      getList();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [chainArray, chainId]);

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
    const time = setTimeout(() => {
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
      return myBetData.map((item, index) => {
        const url = hashBaseUrl + item.hash;
        const profit = Number(item.profit) > 0 ? true : false;
        return (
          <tr key={`trMyBet${index}`} onClick={() => setShowModal(item)}>
            <td className="tdHash">
              <a href={url} target="view_window">
                {showEllipsisAddress(item.hash)}
              </a>
            </td>
            <td>{item.bet}</td>
            <td>{item.multiplier} X</td>
            <td>{item.chance}%</td>
            <td>{moment(Number(item.time)).format("MM[-]DD HH:mm:ss")}</td>
            <td
              className={classNames({ [`tdProfit`]: true, [`profit`]: profit })}
            >
              {item.profit}
            </td>
            <td className={`claim`}>
              <PendingClock allTime={0} leftTime={0} index={0} />
              <MainButton>Claim</MainButton>
            </td>
          </tr>
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
            <td>{moment(item.time).format("MM[-]DD HH:mm")}</td>
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
            <tr>
              <th>Hash</th>
              <th>Bet</th>
              <th>Multiplier</th>
              <th>Chance</th>
              <th>Time</th>
              <th>Profit</th>
              <th></th>
            </tr>
            {trMyBet()}
          </table>
        </div>
      );
    } else if (tabNum === 2) {
      return (
        <div className={`${classPrefix}-mainView-allBet`}>
          <table>
            <tr>
              <th>Hash</th>
              <th>Bet</th>
              <th>Multiplier</th>
              <th>Chance</th>
              <th>Time</th>
              <th>Profit</th>
            </tr>
            {trAllBet()}
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
      {showModal ? (
        <Popup
          ref={modal}
          open
          onClose={() => {
            setShowModal(undefined);
          }}
        >
          <WinV2Modal onClose={() => modal.current.close()}
            item={showModal}/>
        </Popup>
      ) : null}
      {topTab()}
      {mainView()}
    </MainCard>
  );
};

export default WinV2RightCard;
