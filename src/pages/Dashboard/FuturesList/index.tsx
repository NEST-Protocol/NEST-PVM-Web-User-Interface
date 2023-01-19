import {FC} from "react";
import {LongIcon, ShortIcon} from "../../../components/Icon";
import '../styles';
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import ShareMyOrderModal from "../ShareMyOrderModal";

export type OrderView = {
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
  const { TokenOneSvg, TokenTwoSvg } = useTokenPairSymbol(props.item.tokenPair);

  console.log(props.item.orientation)

  return (
    <tr className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={"td-type"}>
        {props.item.orientation === 'Long' ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation === 'Long' ? "red" : "green"}>
          {props.item.orientation}
        </p>
      </td>
      <td>{props.item.leverage}</td>
      <td>{props.item.initialMargin} NEST</td>
      <td>{props.item.openPrice} USDT</td>
      <td>{props.item.actualMargin} NEST</td>
      <td>
        <ShareMyOrderModal order={props.item} />
      </td>
    </tr>
  );
};

export default FuturesList;