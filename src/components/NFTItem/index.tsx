import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { TokenNest } from "../Icon";
import NFTLeverIcon from "../NFTLeverIcon";
import "./styles";
import { downTime } from "../../libs/utils";

export type NFTItemType = {
  src: string;
  name: string;
  lever: number;
  value: string;
  isDig?: boolean;
  endTime?: string;
};

const NFTItem: FC<NFTItemType> = ({ ...props }) => {
  const src =
  (props.src && props.src.length > 7)
      ? "https://" + props.src.substring(7, props.src.length) + ".ipfs.w3s.link"
      : "";
  const [timeString, setTimeString] = useState<string>();
  // time
  useEffect(() => {
    const getTime = () => {
      if (!props.isDig && props.endTime) {
        const nowTime = Date.now() / 1000;
        const endTime = parseInt(props.endTime);
        if (nowTime > endTime) {
          // end
          setTimeString("");
        } else {
          // show
          setTimeString(downTime(endTime - nowTime));
        }
      }
    };
    getTime();
    const time = setInterval(() => {
      getTime();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [props.endTime, props.isDig]);
  return (
    <div
      className={classNames({
        [`NFTItem`]: true,
        [`auctionWidth`]: !props.isDig,
      })}
    >
      <div className="NFTItem-image">
        <img src={src} alt="NEST NFT" />
      </div>
      <div className="NFTItem-info">
        <div className="NFTItem-info-base">
          <div className="NFTItem-info-base-name">
            <p className="NFTItem-info-base-name-name">{props.name}</p>
            {props.isDig ? (
              <></>
            ) : (
              <p className="NFTItem-info-base-name-time">{timeString}</p>
            )}
          </div>

          <NFTLeverIcon lever={props.lever} />
        </div>
        <div className="NFTItem-info-price">
          <TokenNest />
          <p>{props.value}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTItem;
