import { FC } from "react";
import {
  DownIcon,
  LongIcon,
  ShortIcon,
  UpIcon,
} from "../../../components/Icon";
import "../styles";
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import ShareMyOrderModal from "../ShareMyOrderModal";
import { Stack } from "@mui/material";

export type FuturesShareOrderView = {
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
  item: FuturesShareOrderView;
  key: number;
  className: string;
};

const FuturesList: FC<FuturesListProps> = ({ ...props }) => {
  const { TokenOneSvg, TokenTwoSvg } = useTokenPairSymbol(props.item.tokenPair);

  return (
    <tr className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={"td-type"}>
        {props.item.orientation === "Long" ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation === "Long" ? "red" : "green"}>
          {props.item.orientation}
        </p>
      </td>
      <td>{props.item.leverage}</td>
      <td>
        {props.item.initialMargin.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}{" "}
        NEST
      </td>
      <td>
        {props.item.openPrice.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}{" "}
        USDT
      </td>
      <td>
        <Stack alignItems={"center"}>
          <p>
            {props.item.actualMargin.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            NEST
          </p>
          <Stack direction={"row"} spacing={"6px"}>
            {props.item.actualRate > 0 ? <UpIcon /> : <DownIcon />}
            <p>
              {props.item.actualRate.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
              %
            </p>
          </Stack>
        </Stack>
      </td>
      <td>
        <ShareMyOrderModal order={props.item} />
      </td>
    </tr>
  );
};

export default FuturesList;
