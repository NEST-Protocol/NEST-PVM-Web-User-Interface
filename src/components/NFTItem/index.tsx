import { FC } from "react";
import { TokenNest } from "../Icon";
import NFTLeverIcon from "../NFTLeverIcon";
import "./styles";

export type NFTItemType = {
  width: number;
  src: string;
  name: string;
  lever: number;
  leftTime?: number;
};

const NFTItem: FC<NFTItemType> = ({ ...props }) => {
  return (
    <div className="NFTItem" style={{ width: `${props.width}px` }}>
      <div className="NFTItem-image" style={{ width: `${props.width}px` }}>
        <img src={props.src} alt="NEST NFT" />
      </div>
      <div className="NFTItem-info">
        <div className="NFTItem-info-base">
          <p>{props.name}</p>
          <NFTLeverIcon lever={props.lever} />
        </div>
        <div className="NFTItem-info-price">
          <TokenNest />
          <p>100.00</p>
        </div>
      </div>
    </div>
  );
};

export type NFTAuctionItemType = {
  width: number;
  src: string;
  name: string;
  lever: number;
  leftTime: number;
};

export const NFTAuctionItem: FC<NFTAuctionItemType> = ({ ...props }) => {
  return (
    <div className="NFTAuctionItem" style={{ width: `${props.width}px` }}>
      <div
        className="NFTAuctionItem-image"
        style={{ width: `${props.width}px` }}
      >
        <img src={props.src} alt="NEST NFT" />
      </div>
      <div className="NFTAuctionItem-info">
        <div className="NFTAuctionItem-info-base">
          <p>{props.name}</p>
          <NFTLeverIcon lever={props.lever} />
        </div>
        <div className="NFTAuctionItem-info-price">
          <TokenNest />
          <p>100.00</p>
        </div>
        <div className="NFTAuctionItem-info-time">{props.leftTime}</div>
      </div>
    </div>
  );
};

export default NFTItem;
