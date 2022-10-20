import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import { checkWidth } from "../../../libs/utils";
import { NFTAuctionModal } from "../NFTModal";
import { MyDig } from "../testDaata";
import "./styles";

const NFTOfferView: FC = () => {
  const classPrefix = "NFTOfferView";
  const modal = useRef<any>();
  const auctionChoice = ["All", "Bid made", "No auction", "Closed"];
  const dataArray = (num: number) => {
    var result = [];
    for (var i = 0; i < MyDig.length; i += num) {
      result.push(MyDig.slice(i, i + num));
    }
    return result;
  };
  const testLiData = dataArray(checkWidth() ? 5 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <Popup
          modal
          ref={modal}
          trigger={
            <li key={`${classPrefix}+li+${index}+${indexData}`}>
              <NFTItem
                src={itemData.img}
                name={itemData.name}
                lever={itemData.lever}
                leftTime={itemData.leftTime}
              />
            </li>
          }
        >
          <NFTAuctionModal title={"In Auction"} />
        </Popup>
      );
    });
    return (
      <li key={`${classPrefix}+li+${index}`}>
        <ul>{ul}</ul>
      </li>
    );
  });
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <NFTAuctionStatus data={auctionChoice} classString={"auction"} />
        </div>
      </div>
      <ul className="line">
        {testLiData}
      </ul>
    </div>
  );
};

export default NFTOfferView;
