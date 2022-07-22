import { FC } from "react";
import { WinListType } from "..";
import MainCard from "../../../components/MainCard";
import { WinPendingItem } from "../../../components/WinPendingItem";
import { bigNumberToNormal } from "../../../libs/utils";
import "./styles";

type WinOrderListProps = {
  historyList: Array<WinListType>;
  pendingList: Array<WinListType>;
  nowBlock: number;
};

const WinOrderList: FC<WinOrderListProps> = ({ ...props }) => {
  const classPrefix = "winOrderList";

  const historyLi = props.historyList.map((item) => {
    return (
      <li key={item.owner + item.index.toString() + item.open_block.toString() + 'h'}>
        <p>{item.open_block.toString()}</p>

        <p className={`${classPrefix}-historyList-amount`}>
          {`${item.gained} NEST`}
        </p>
        <span></span>
      </li>
    );
  });
  const pendingLi = props.pendingList.map((item) => {
    const itemAmount = bigNumberToNormal(item.gained, 18, 2)
    
    return (
      <li key={item.owner + item.index.toString() + 'p'}>
        <p>{item.openBlock.toString()}</p>

        <p className={`${classPrefix}-historyList-amount`}>
          {`${itemAmount} NEST`}
        </p>
          <span>
            <WinPendingItem
              nowBlock={props.nowBlock}
              gained={item.gained}
              openBlock={item.openBlock}
              index={item.index}
            />
          </span>
      </li>
    );
  });
  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-card`}>
        <p className={`${classPrefix}-card-title`}>My Bet</p>
        <ul className={`${classPrefix}-historyList`}>{pendingLi}{historyLi}</ul>
      </MainCard>
    </div>
  );
};

export default WinOrderList;
