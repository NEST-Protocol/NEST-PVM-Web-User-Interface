import {FC, useRef} from "react";
import {LongIcon, ShortIcon} from "../../../components/Icon";
import Popup from "reactjs-popup";
import '../styles';

type OrderView = {
  index: number;
  owner: string;
  leverage: string;
  orientation: string;
  actualRate: number;
  openPrice: number;
  tokenPair: string;
  actualMargin: number;
  initialMargin: number;
  lastPrice: number;
};

type FuturesListProps = {
  item: OrderView;
  key: number;
  className: string;
};

const FuturesList: FC<FuturesListProps> = ({ ...props }) => {
  const share = useRef<any>();

  return (
    <tr className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <span>{props.item.tokenPair}</span>
      </td>
      <td className={"td-type"}>
        {props.item.orientation ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation ? "red" : "green"}>
          {props.item.orientation ? "Long" : "Short"}
        </p>
      </td>
      <td>{props.item.leverage}</td>
      <td>{props.item.initialMargin} NEST</td>
      <td>{props.item.openPrice} USDT</td>
      <td>{props.item.actualMargin} NEST</td>
      <td>
        <Popup
          modal
          ref={share}
          trigger={<button className="fort-button">Add</button>}
          nested
        >
          {/*<FuturesAdd order={props.item} onClose={() => modalAdd.current.close()}/>*/}
        </Popup>
      </td>
    </tr>
  );
};

export default FuturesList;