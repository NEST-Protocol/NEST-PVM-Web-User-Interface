import classNames from "classnames";
import { FC, useState } from "react";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import "./styles";

const NFTWhiteList: FC = () => {
  const classPrefix = "NFTWhiteList";
  const [lever, setLever] = useState(0);
  const leverLi = [
    "All",
    <NFTLeverIcon lever={1} />,
    <NFTLeverIcon lever={5} />,
    <NFTLeverIcon lever={10} />,
  ].map((item, index) => {
    return index === 1 ? (
      <li
        key={`${index}+NFTAuctionView-lever`}
        className={classNames({
          [`selected`]: lever === index,
        })}
        onClick={() => setLever(index)}
      >
        {item}
      </li>
    ) : (
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
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <div className={`${classPrefix}-choice-top-lever`}>
            <p className={`${classPrefix}-choice-top-lever-title`}>Rarity:</p>
            <ul>{leverLi}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTWhiteList;
