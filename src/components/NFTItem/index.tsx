import classNames from "classnames";
import { FC } from "react";
import { TokenNest } from "../Icon";
import NFTLeverIcon from "../NFTLeverIcon";
import "./styles";

export type NFTItemType = {
  src: string;
  name: string;
  lever: number;
  value: string;
  isDig?: boolean;
  leftTime?: number;
};

const NFTItem: FC<NFTItemType> = ({ ...props }) => {
  const src = 'https://' + props.src.substring(7, props.src.length) + '.ipfs.w3s.link'
  return (
    <div className={classNames({
      [`NFTItem`]: true,
      [`auctionWidth`]: !props.isDig
    })}>
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
              <p className="NFTItem-info-base-name-time">12:33:56</p>
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
