import { FC } from "react";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import "./styles";

const NFTOfferView: FC = () => {
  const testImage =
    "https://ipfs.io/ipns/k51qzi5uqu5djiekvrfwa8xi63010iqktc1lqzxkgchz0i3v1yyz690yyf62yr";
  const classPrefix = "NFTOfferView";
  const auctionChoice = ["All", "Bid made", "No auction", "Closed"];
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <NFTAuctionStatus data={auctionChoice} classString={"auction"} />
        </div>
      </div>
      <ul className="line">
        <li>
          <ul>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
            <li>
              <NFTItem
                src={testImage}
                name={"hahah"}
                lever={2}
                leftTime={1234567}
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default NFTOfferView;
