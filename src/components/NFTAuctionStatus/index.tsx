import classNames from "classnames";
import { FC, useState } from "react";
import "./styles";

export type NFTAuctionStatusType = {
  data: Array<string>;
  classString: string;
};

const NFTAuctionStatus: FC<NFTAuctionStatusType> = ({ ...props }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const statusLi = props.data.map((item, index) => {
    return (
      <li
        key={`${props.classString}+${item}+${index}`}
        onClick={() => setSelectedIndex(index)}
        className={classNames({
            [`selected`]: selectedIndex === index
        })}
      >
        {item}
      </li>
    );
  });
  return (
    <div className={"NFTAuctionStatus"}>
      <p>Status:</p>
      <ul>{statusLi}</ul>
    </div>
  );
};

export default NFTAuctionStatus;
