import { FC } from "react";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import "./styles";

const NFTAuctionView: FC = () => {
  const classPrefix = "NFTAuctionView";
  const auctionChoice = ["All", "Ending soon", "Recently start"];
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}choice-top`}>
          <NFTAuctionStatus data={auctionChoice} classString={"auction"} />
        </div>
      </div>
    </div>
  );
};

export default NFTAuctionView;
