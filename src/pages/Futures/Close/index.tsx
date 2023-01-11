import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { TokenType } from "../../../libs/constants/addresses";
import {
  OrderView,
  useFuturesCloseOrder,
} from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { LightTooltip } from "../../../styles/MUI";
import "./styles";

export type FuturesCloseProps = {
  order: OrderView;
  kValue?: { [key: string]: TokenType };
};

const FuturesClose: FC<FuturesCloseProps> = ({ ...props }) => {
  const classPrefix = "FuturesClose";
  const {
    showPosition,
    showClosePrice,
    showFee,
    buttonLoading,
    buttonDis,
    buttonAction,
  } = useFuturesCloseOrder(props.order, props.kValue);
  const { theme } = useThemes();
  return (
    <MainCard
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <Stack spacing={0} alignItems="center">
        <p className="title">Close Position</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Position</p>
          <p>{showPosition()}</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Close Price</p>
          <p>{showClosePrice()} </p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <LightTooltip
            placement="right"
            title={"margin*leverage*0.2%"}
            arrow
          >
            <p className="underLine">Fees</p>
          </LightTooltip>

          <p>{showFee()} NEST</p>
        </Stack>
        <MainButton
          className="mainButton"
          loading={buttonLoading()}
          disable={buttonDis()}
          onClick={buttonAction}
        >
          Confirm
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default FuturesClose;
