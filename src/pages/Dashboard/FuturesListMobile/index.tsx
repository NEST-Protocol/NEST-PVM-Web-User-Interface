import {FC, useRef} from "react";
import {LongIcon, ShortIcon} from "../../../components/Icon";
import '../styles';
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import {Divider, Stack} from "@mui/material";
import MainCard from "../../../components/MainCard";

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

const FuturesListMobile: FC<FuturesListProps> = ({ ...props }) => {
  const share = useRef<any>();
  const { TokenOneSvg, TokenTwoSvg } = useTokenPairSymbol(props.item.tokenPair);

  return (
    <MainCard classNames={'dashboard-orderCard'}>
      <Stack spacing={'8px'}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p>Token Pair</p>
          <p>Type</p>
        </Stack>
        <Stack direction={'row'} justifyContent={"space-between"}>
          <Stack direction={"row"} spacing={'-10px'}>
            <TokenOneSvg />
            <TokenTwoSvg />
          </Stack>
          <Stack direction={"row"} spacing={'6px'}>
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p>Level</p>
          <p>Initial Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p>{props.item.leverage}</p>
          <p>{props.item.initialMargin} NEST</p>
        </Stack>
        <Divider/>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p>Open Price</p>
          <p>Actual Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p>{props.item.openPrice} USDT</p>
          <p>{props.item.actualMargin} NEST</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p></p>
          <p>{props.item.actualRate} %</p>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default FuturesListMobile;