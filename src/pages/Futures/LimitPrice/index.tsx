import Stack from "@mui/material/Stack";
import { FC } from "react";
import classNames from "classnames";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import "./styles";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import { LimitOrderView, useFuturesSetLimitOrder } from "../../../libs/hooks/useFutures";

export type LimitPriceProp = {
  order: LimitOrderView;
};

const LimitPrice: FC<LimitPriceProp> = ({...props}) => {
  const classPrefix = "LimitPrice";
  const {limitInput, setLimitInput} = useFuturesSetLimitOrder(props.order)
  const { theme } = useThemes();
  const limitPrice = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-limitPrice`}
      >
        <p className={`${classPrefix}-limitPrice-title`}>Limit Price</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input
            placeholder={"Input"}
            value={limitInput}
            maxLength={32}
            onChange={(e) =>
              setLimitInput(formatInputNumWithFour(e.target.value))
            }
          />
          <p>USDT</p>
        </Stack>
      </Stack>
    );
  };
  return (
    <MainCard classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}>
      <Stack spacing={0} alignItems="center">
      <p className="title">Limit Price</p>
        {limitPrice()}
        <MainButton className="mainButton">Confirm</MainButton>
      </Stack>
    </MainCard>
  );
};

export default LimitPrice;
