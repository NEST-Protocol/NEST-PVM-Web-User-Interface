import { FC, useState } from "react";
import "./styles";
import MainCard from "../../../components/MainCard";
import { Chance, HowToPlay, Provably } from "../../../components/Icon";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import { SingleTokenShow } from "../../../components/TokenShow";

const WinV2LeftCard: FC = () => {
  const classPrefix = "winV2-leftCard";
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
        <SingleTokenShow tokenNameOne={'NEST'} isBold />
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
  const choice = (title: string) => {
    return <button>{title}</button>;
  };

  // mainView
  const mainView = () => {
    if (tabNum === 1) {
      return (
        <div className={`${classPrefix}-mainView-play`}>
          <div className={`${classPrefix}-mainView-play-top`}>
            <p className={`${classPrefix}-mainView-play-top-limit`}>
              Limitation: 1.1-100
            </p>
            <div className={`${classPrefix}-mainView-play-top-input`}></div>
            <div className={`${classPrefix}-mainView-play-top-random`}>
              <p className={`${classPrefix}-mainView-play-top-random-text`}>
                RANDOM
              </p>
              <Chance />
            </div>
          </div>
          <div className={`${classPrefix}-mainView-play-mid1`}>
            {bet()}
            {show("WIN CHANCE", "1.71%")}
            {show("WIN", "1.001")}
          </div>
          <div className={`${classPrefix}-mainView-play-mid2`}>
            <div className={`${classPrefix}-mainView-play-mid2-left`}>
              <div
                className={`${classPrefix}-mainView-play-mid2-left-buttonView`}
              >
                {choice("min")}
                {choice("1/2")}
                {choice("2X")}
                {choice("max")}
              </div>
              <p className={`${classPrefix}-mainView-play-mid2-left-limit`}>
                Limitation: 1-1000
              </p>
            </div>
          </div>
          <MainButton className={`${classPrefix}-mainView-play-mainButton`}>
            Roll
          </MainButton>
          <div className={`${classPrefix}-mainView-play-otherInfo`}>
            <p className={`${classPrefix}-mainView-play-otherInfo-left`}>Rolling Fee: 0.01 NEST</p>
            <p className={`${classPrefix}-mainView-play-otherInfo-right`}>Balance: 10.00 NEST</p>
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
