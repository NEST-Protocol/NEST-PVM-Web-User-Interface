import { FC, useState } from "react";
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
import NFTAuctionStatus from "../../components/NFTAuctionStatus";
import NFTItem from "../../components/NFTItem";
import NFTLeverIcon from "../../components/NFTLeverIcon";
import TabItem from "../../components/TabItem";
import "./styles";

const NFTAuction: FC = () => {
  const classPrefix = "NFTAuction";
  const [digTabSelected, setDigTabSelected] = useState(0);
  const [auctionTabSelected, setAuctionTabSelected] = useState(0);
  const testImage =
    "https://ipfs.io/ipns/k51qzi5uqu5djiekvrfwa8xi63010iqktc1lqzxkgchz0i3v1yyz690yyf62yr";
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
            <img src={testImage} alt="img" />
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
    const topLeftViewClass = `${classPrefix}-bottom-main`;
    
    if (auctionTabSelected === 0) {
      return (
        <></>
      );
    } else if (auctionTabSelected === 1) {
      return <>1</>;
    } else {
      return <>2</>;
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
          <ul className="line">
            <li>
              <ul>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
                <li>
                  <NFTItem
                    width={200}
                    src={testImage}
                    name={"hahah"}
                    lever={2}
                  />
                </li>
              </ul>
            </li>
          </ul>
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
