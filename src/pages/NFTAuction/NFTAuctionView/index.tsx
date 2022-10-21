import { Slider } from "antd";
import classNames from "classnames";
import { FC, useRef, useState } from "react";
import Popup from "reactjs-popup";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import { NFTAuctionModal } from "../NFTModal";
import { MyDig } from "../testDaata";
// import '../../../styles/ant.css';
import "./styles";
import { checkWidth } from "../../../libs/utils";


const NFTAuctionView: FC = () => {
  const classPrefix = "NFTAuctionView";
  const auctionChoice = ["All", "Ending soon", "Recently start"];
  const modal = useRef<any>();
  const [lever, setLever] = useState(0);
  const leverLi = [
    <NFTLeverIcon lever={0} />,
    <NFTLeverIcon lever={1} />,
    <NFTLeverIcon lever={2} />,
    <NFTLeverIcon lever={3} />,
    <NFTLeverIcon lever={4} />,
  ].map((item, index) => {
    return (
      <li
        key={`${index}+NFTAuctionView-lever`}
        className={classNames({
          [`selected`]: lever === index,
        })}
        onClick={() => setLever(index)}
      >
        {item}
      </li>
    );
  });
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
            <li key={`${NFTAuctionView}+li+${index}+${indexData}`}>
              <NFTItem
                src={itemData.img}
                name={itemData.name}
                lever={itemData.lever}
                leftTime={itemData.leftTime} value={"200"}              />
            </li>
          }
        >
          <NFTAuctionModal title={"In Auction"} />
        </Popup>
      );
    });
    return (
      <li key={`${NFTAuctionView}+li+${index}`}>
        <ul>{ul}</ul>
      </li>
    );
  });
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <NFTAuctionStatus data={auctionChoice} classString={"auction"} />
          <div className={`${classPrefix}-choice-top-lever`}>
            <p className={`${classPrefix}-choice-top-lever-title`}>Rarity:</p>
            <ul>{leverLi}</ul>
          </div>
        </div>
        <div className={`${classPrefix}-choice-bottom`}>
          <p>Price:<span>NEST</span></p>
          <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />
        </div>
      </div>
      <ul className="line">{testLiData}</ul>
    </div>
  );
};

export default NFTAuctionView;
