import {FC, useRef} from "react";
import {LongIcon, ShortIcon} from "../../../components/Icon";
import '../styles';
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import {Divider, Stack} from "@mui/material";
import MainCard from "../../../components/MainCard";
import Popup from "reactjs-popup";

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

const FuturesListMobile: FC<FuturesListProps> = ({...props}) => {
  const share = useRef<any>();
  const {TokenOneSvg, TokenTwoSvg} = useTokenPairSymbol(props.item.tokenPair);

  return (
    <MainCard classNames={'dashboard-orderCard'}>
      <Stack spacing={'8px'}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={'dashboard-orderCard-title'}>Token Pair</p>
          <p className={'dashboard-orderCard-title'}>Type</p>
        </Stack>
        <Stack direction={'row'} justifyContent={"space-between"}>
          <Stack direction={"row"} spacing={'-10px'}>
            <TokenOneSvg/>
            <TokenTwoSvg/>
          </Stack>
          <Stack direction={"row"} spacing={'6px'}>
            {props.item.orientation ? <LongIcon/> : <ShortIcon/>}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </Stack>
        </Stack>
        <Divider color={'#C5C5C5'} style={{opacity: 0.15}}/>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={'dashboard-orderCard-title'}>Level</p>
          <p className={'dashboard-orderCard-title'}>Initial Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={'dashboard-orderCard-value'}>{props.item.leverage}</p>
          <p className={'dashboard-orderCard-value'}>{props.item.initialMargin} NEST</p>
        </Stack>
        <Divider color={'#C5C5C5'} style={{opacity: 0.15}}/>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={'dashboard-orderCard-title'}>Open Price</p>
          <p className={'dashboard-orderCard-title'}>Actual Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={'dashboard-orderCard-value'}>{props.item.openPrice} USDT</p>
          <p className={'dashboard-orderCard-value'}>{props.item.actualMargin} NEST</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p></p>
          <p className={'dashboard-orderCard-caption'}>{props.item.actualRate} %</p>
        </Stack>
      </Stack>
      <Popup
        modal
        ref={share}
        trigger={<Stack position={'absolute'} right={0} top={0} width={'32px'} height={'32px'} borderRadius={'0 20px'}
                            justifyContent={"center"} alignItems={"center"}
                            style={{ background: 'red' }}>
          <p>S</p>
        </Stack>}
        nested
      >
      </Popup>
    </MainCard>
  );
};

export default FuturesListMobile;