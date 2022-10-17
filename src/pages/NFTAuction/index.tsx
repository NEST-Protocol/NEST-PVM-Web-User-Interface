import { FC, useRef, useState } from "react";
import Popup from "reactjs-popup";
import {
  NFTAuctionIcon,
  NFTBuy,
  NFTHow,
  NFTMyAuction,
  NFTMyDig,
  NFTMyMint,
  NFTProbability,
} from "../../components/Icon";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import NFTItem from "../../components/NFTItem";
import NFTLeverIcon from "../../components/NFTLeverIcon";
import TabItem from "../../components/TabItem";
import { checkWidth } from "../../libs/utils";
import NFTAuctionView from "./NFTAuctionView";
import { NFTDigModal } from "./NFTModal";
import NFTOfferView from "./NFTOfferView";
import NFTReceived from "./NFTReceived";
import "./styles";
import { MyDig } from "./testDaata";

const NFTAuction: FC = () => {
  const classPrefix = "NFTAuction";
  const [digTabSelected, setDigTabSelected] = useState(0);
  const [auctionTabSelected, setAuctionTabSelected] = useState(0);
  const modal = useRef<any>();
  const dataArray = (num: number) => {
    var result = [];
    for (var i = 0; i < MyDig.length; i += num) {
      result.push(MyDig.slice(i, i + num));
    }
    return result;
  };
  const testLiData = dataArray(checkWidth() ? 3 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <Popup
          modal
          ref={modal}
          trigger={
            <li key={`${NFTAuction}+li+${index}+${indexData}`}>
              <NFTItem
                src={itemData.img}
                name={itemData.name}
                lever={itemData.lever}
                isDig={true}
              />
            </li>
          }
        >
          <NFTDigModal title={'Dig Up / Auctioned'}/>
        </Popup>
      );
    });
    return (
      <li key={`${NFTAuction}+li+${index}`}>
        <ul>{ul}</ul>
      </li>
    );
  });

  // dig tab item data
  const digTabItemArray = [
    { icon: <NFTBuy />, text: "Buy" },
    { icon: <NFTHow />, text: "How To Play" },
    { icon: <NFTProbability />, text: "Probability" },
  ];
  const digTabNum = (index: number) => {
    setDigTabSelected(index);
  };
  // auction tab item data
  const auctionTabItemArray = [
    { icon: <NFTAuctionIcon />, text: "Auction" },
    { icon: <NFTMyAuction />, text: "Offers Made" },
    { icon: <NFTMyDig />, text: "My Received" },
  ];
  const auctionTabNum = (index: number) => {
    setAuctionTabSelected(index);
  };
  // top left view
  const topLeftView = () => {
    const topLeftViewClass = `${classPrefix}-top-left-main`;
    if (digTabSelected === 0) {
      return (
        <div className={`${topLeftViewClass}-buy`}>
          <div className={`${topLeftViewClass}-buy-image`}>
            <img src={MyDig[0].img} alt="img" />
            <div className={`${topLeftViewClass}-buy-image-lever`}>
              <NFTLeverIcon lever={2} />
            </div>
          </div>
          <MainButton>Dig</MainButton>
          <p className={`${topLeftViewClass}-buy-balance`}>
            Balance: 10.00 NEST
          </p>
        </div>
      );
    } else if (digTabSelected === 1) {
      return <div className={`${topLeftViewClass}-how`}>how</div>;
    } else {
      return (
        <div className={`${topLeftViewClass}-probability`}>probability</div>
      );
    }
  };
  // bottom main view
  const bottomMainView = () => {
    if (auctionTabSelected === 0) {
      return <NFTAuctionView />;
    } else if (auctionTabSelected === 1) {
      return <NFTOfferView />;
    } else {
      return <NFTReceived />;
    }
  };
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-top`}>
        <MainCard classNames={`${classPrefix}-top-left`}>
          <TabItem data={digTabItemArray} selectedVoid={digTabNum} />
          <div className={`${classPrefix}-top-left-main`}>{topLeftView()}</div>
        </MainCard>
        <MainCard classNames={`${classPrefix}-top-right`}>
          <div className={`${classPrefix}-top-right-title`}>
            <NFTMyMint />
            <p>My Dig</p>
          </div>
          <ul className="line">{testLiData}</ul>
        </MainCard>
      </div>
      <div className={`${classPrefix}-bottom`}>
        <MainCard classNames={`${classPrefix}-bottom-main`}>
          <TabItem data={auctionTabItemArray} selectedVoid={auctionTabNum} />
          {bottomMainView()}
        </MainCard>
      </div>
    </div>
  );
};

export default NFTAuction;
