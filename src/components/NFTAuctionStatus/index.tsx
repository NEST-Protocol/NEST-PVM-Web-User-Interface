import classNames from "classnames";
import { FC, useState } from "react";
import "./styles";

export type NFTAuctionStatusType = {
  data: Array<string>;
  classString: string;
  selectedVoid: (index: number) => void;
};

const NFTAuctionStatus: FC<NFTAuctionStatusType> = ({ ...props }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const statusLi = props.data.map((item, index) => {
    return (
      <li
        key={`${props.classString}+${item}+${index}`}
        onClick={() => {
          setSelectedIndex(index)
          props.selectedVoid(index)
        }}
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
      <p className="NFTAuctionStatus-title">Status:</p>
      <ul>{statusLi}</ul>
    </div>
  );
};

export default NFTAuctionStatus;
