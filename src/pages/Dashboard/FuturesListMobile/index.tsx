import { FC } from "react";
import { LongIcon, ShortIcon } from "../../../components/Icon";
import "../styles";
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import { Divider, Stack } from "@mui/material";
import MainCard from "../../../components/MainCard";
import ShareMyOrderModal from "../ShareMyOrderModal";

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
  tp?: number;
  sl?: number;
  lastPrice?: number;
};

type FuturesListProps = {
  item: OrderView;
  key: number;
  className: string;
};

const FuturesListMobile: FC<FuturesListProps> = ({ ...props }) => {
  const { TokenOneSvg, TokenTwoSvg } = useTokenPairSymbol(props.item.tokenPair);

  return (
    <MainCard classNames={"dashboard-orderCard"}>
      <Stack spacing={"8px"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={"dashboard-orderCard-title"}>Token Pair</p>
          <p className={"dashboard-orderCard-title"}>Type</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} spacing={"-10px"}>
            <TokenOneSvg />
            <TokenTwoSvg />
          </Stack>
          <Stack direction={"row"} spacing={"6px"}>
            {props.item.orientation === "Long" ? <LongIcon /> : <ShortIcon />}
            <p
              style={{
                fontWeight: "bold",
                color:
                  props.item.orientation === "Long" ? "#DD8751" : "#63C8A7",
              }}
            >
              {props.item.orientation}
            </p>
          </Stack>
        </Stack>
        <Divider color={"#C5C5C5"} style={{ opacity: 0.15 }} />
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={"dashboard-orderCard-title"}>Level</p>
          <p className={"dashboard-orderCard-title"}>Initial Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={"dashboard-orderCard-value"}>{props.item.leverage}</p>
          <p className={"dashboard-orderCard-value"}>
            {props.item.initialMargin.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            NEST
          </p>
        </Stack>
        <Divider color={"#C5C5C5"} style={{ opacity: 0.15 }} />
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={"dashboard-orderCard-title"}>Open Price</p>
          <p className={"dashboard-orderCard-title"}>Actual Margin</p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p className={"dashboard-orderCard-value"}>
            {props.item.openPrice.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            USDT
          </p>
          <p className={"dashboard-orderCard-value"}>
            {props.item.actualMargin.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            NEST
          </p>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <p></p>
          <p className={"dashboard-orderCard-caption"}>
            {props.item.actualRate.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            %
          </p>
        </Stack>
      </Stack>
      <Stack
        position={"absolute"}
        right={0}
        top={0}
        width={"32px"}
        height={"32px"}
        borderRadius={"0 20px"}
        justifyContent={"center"}
        alignItems={"center"}
        style={{ background: "rgba(255, 255, 255, 0.15)" }}
      >
        <ShareMyOrderModal order={props.item} />
      </Stack>
    </MainCard>
  );
};

export default FuturesListMobile;
