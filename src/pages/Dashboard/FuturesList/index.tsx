import {FC} from "react";
import {DownIcon, LongIcon, ShortIcon, UpIcon} from "../../../components/Icon";
import '../styles';
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import ShareMyOrderModal from "../ShareMyOrderModal";
import {Stack} from "@mui/material";

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
  lastPrice?: number;
};

type FuturesListProps = {
  item: OrderView;
  key: number;
  className: string;
};

const FuturesList: FC<FuturesListProps> = ({...props}) => {
  const {TokenOneSvg, TokenTwoSvg} = useTokenPairSymbol(props.item.tokenPair);

  return (
    <tr className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg/>
        <TokenTwoSvg/>
      </td>
      <td className={"td-type"}>
        {props.item.orientation === 'Long' ? <LongIcon/> : <ShortIcon/>}
        <p className={props.item.orientation === 'Long' ? "red" : "green"}>
          {props.item.orientation}
        </p>
      </td>
      <td>{props.item.leverage}</td>
      <td>{props.item.initialMargin} NEST</td>
      <td>{props.item.openPrice} USDT</td>
      <td>
        <Stack alignItems={"center"}>
          <p>{props.item.actualMargin} NEST</p>
          <Stack direction={'row'}>
            {props.item.actualRate > 0 ? <UpIcon/> : <DownIcon/>}
            <p style={{fontWeight: 500}}>
              {props.item.actualRate}%
            </p>
          </Stack>
        </Stack>
      </td>
      <td>
        <ShareMyOrderModal order={props.item}/>
      </td>
    </tr>
  );
};

export default FuturesList;