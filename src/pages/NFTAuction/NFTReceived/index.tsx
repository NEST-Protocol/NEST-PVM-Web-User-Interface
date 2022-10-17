import { FC } from "react";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import "./styles";

const NFTReceived: FC = () => {
  const testImage =
    "https://ipfs.io/ipns/k51qzi5uqu5djiekvrfwa8xi63010iqktc1lqzxkgchz0i3v1yyz690yyf62yr";
  const classPrefix = "NFTReceived";
  const auctionChoice = ["All", "In progress", "No auctioned"];
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
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
            <li>
              <NFTItem src={testImage} name={"hahah"} lever={2} />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default NFTReceived;
