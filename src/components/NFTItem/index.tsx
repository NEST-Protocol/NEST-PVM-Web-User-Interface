import { FC } from "react";
import { TokenNest } from "../Icon";
import NFTLeverIcon from "../NFTLeverIcon";
import "./styles";

export type NFTItemType = {
  width: number;
  src: string;
  name: string;
  lever: number;
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
            <div className="NFTItem-info-base-price"><TokenNest/><p>100.00</p></div>
        </div>
        <NFTLeverIcon lever={props.lever}/>
      </div>
    </div>
  );
};

export default NFTItem;
