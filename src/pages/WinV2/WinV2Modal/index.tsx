import classNames from "classnames";
import moment from "moment";
import { FC, MouseEventHandler } from "react";
import { Chance, TokenNest, XIcon } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { useEtherscanBaseUrl } from "../../../libs/hooks/useEtherscanBaseUrl";
import { showEllipsisAddress } from "../../../libs/utils";
import { WinV2BetData } from "../RightCard";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  item: WinV2BetData;
};

const WinV2Modal: FC<Props> = ({ ...props }) => {
  const classPrefix = "WinV2Modal";
  const result = Number(props.item.profit) > 0 ? true : false;
  const hashBaseUrl = useEtherscanBaseUrl();
  const showInfo = (title: string, text: string) => {
    return (
      <div className={`${classPrefix}-card-mid-showInfo`}>
        <p>{title}</p>
        <div className={`${classPrefix}-card-mid-showInfo-bg`}>
          <p>{text}</p>
        </div>
      </div>
    );
  };
  const showInfo_nest = (title: string, text: string) => {
    return (
      <div className={`${classPrefix}-card-mid-showInfo`}>
        <p>{title}</p>
        <div className={`${classPrefix}-card-mid-showInfo-bg`}>
            <TokenNest/>
          <p className={`${classPrefix}-card-mid-showInfo-bg-nest`}>{text}</p>
        </div>
      </div>
    );
  };
  const url = hashBaseUrl + props.item.hash;
  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <div className={`${classPrefix}-card-top`}>
          <p className={`${classPrefix}-card-top-time`}>
            {moment(Number(props.item.time) * 1000).format("YYYY[-]MM[-]DD HH:mm:ss")}
          </p>
          <p
            className={classNames({
              [`${classPrefix}-card-top-result`]: true,
              [`result`]: result,
            })}
          >
            {result ? "WIN" : "LOSE"}
          </p>
          <div className={`${classPrefix}-card-top-random`}>
            <p
              className={classNames({
                [`${classPrefix}-card-top-random-num`]: true,
                [`result`]: result,
              })}
            >
              {props.item.multiplier} X
            </p>
            <Chance />
          </div>
        </div>
        <div className={`${classPrefix}-card-mid`}>
          {showInfo_nest("BET", props.item.bet)}
          {showInfo("WIN CHANCE", props.item.chance + "%")}
          {showInfo("PROFIT", props.item.profit)}
        </div>
        <p className={`${classPrefix}-card-hash`}>
          hash: <a href={url}>{showEllipsisAddress(props.item.hash)}</a>
        </p>
        <MainButton>Claim (remaining time <span>12:12</span>)</MainButton>
      </MainCard>
      <button className={`${classPrefix}-X`} onClick={props.onClose}><XIcon/></button>
    </div>
  );
};

export default WinV2Modal;
