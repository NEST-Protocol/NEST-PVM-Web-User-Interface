import { FC, useState } from "react";
import "./styles";
import MainCard from "../../../components/MainCard";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import PendingClock from "../../../components/WinPendingItem/PendingClock";

const WinV2RightCard: FC = () => {
  const classPrefix = "winV2-rightCard";
  const [tabNum, setTabNum] = useState<Number>(1);

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
    const trTest1 = () => {
      return [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ].map(() => {
        return (
          <tr>
            <td>0xwe3423</td>
            <td>99.99</td>
            <td>85.63 X</td>
            <td>1.17%</td>
            <td>12.12 12:12:12</td>
            <td>99.8</td>
            <td className={`claim`}><PendingClock allTime={0} leftTime={0} index={0}/><MainButton>Claim</MainButton></td>
          </tr>
        );
      });
    };
    const trTest2 = () => {
        return [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1,
        ].map(() => {
          return (
            <tr>
              <td>0xwe3423</td>
              <td>99.99</td>
              <td>85.63 X</td>
              <td>1.17%</td>
              <td>12.12 12:12:12</td>
              <td>99.8</td>
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
            {trTest1()}
          </table>
        </div>
      );
    } else if (tabNum === 2) {
      return <div className={`${classPrefix}-mainView-allBet`}>
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
            {trTest2()}
          </table>
      </div>;
    } else if (tabNum === 3) {
      return <div className={`${classPrefix}-mainView-week`}></div>;
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
