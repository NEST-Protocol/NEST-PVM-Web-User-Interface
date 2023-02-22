import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import {
  Futures3OrderView,
  useFuturesOpenPosition,
} from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import { LightTooltip } from "../../../styles/MUI";
import "./styles";

type OpenPositionProp = {
  order: Futures3OrderView;
  onClose: () => void;
};

const OpenPosition: FC<OpenPositionProp> = ({ ...props }) => {
  const classPrefix = "OpenPosition";
  const { theme } = useThemes();
  const {
    nestAmount,
    setNestAmount,
    limit,
    setLimit,
    tp,
    setTp,
    sl,
    setSl,
    showPosition,
    mainButtonTitle,
    mainButtonDis,
    mainButtonAction,
    mainButtonLoading,
    feeHoverText,
    showFee,
    showTotalPay,
  } = useFuturesOpenPosition(props.order);
  return (
    <MainCard
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <Stack spacing={0} alignItems="center">
        <p className="title">{showPosition()}</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-input`}
        >
          <p className={`${classPrefix}-input-title`}>NEST</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={"Input"}
              value={nestAmount}
              maxLength={32}
              onChange={(e) =>
                setNestAmount(formatInputNumWithFour(e.target.value))
              }
            />
            <p>NEST</p>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-input`}
        >
          <p className={`${classPrefix}-input-title`}>Limit</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={"Input"}
              value={limit}
              maxLength={32}
              onChange={(e) => setLimit(formatInputNumWithFour(e.target.value))}
            />
            <p>USDT</p>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-input`}
        >
          <p className={`${classPrefix}-input-title`}>Take Profit</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={"Input"}
              value={tp}
              maxLength={32}
              onChange={(e) => setTp(formatInputNumWithFour(e.target.value))}
            />
            <p>USDT</p>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-input`}
        >
          <p className={`${classPrefix}-input-title`}>Stop Loss</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={"Input"}
              value={sl}
              maxLength={32}
              onChange={(e) => setSl(formatInputNumWithFour(e.target.value))}
            />
            <p>USDT</p>
          </Stack>
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
            title={
              <div>
                {feeHoverText().map((item, index) => {
                  return <p key={`hover+${index}`}>{item}</p>;
                })}
              </div>
            }
            arrow
          >
            <p className="underLine">Service Fee</p>
          </LightTooltip>
          <p>{showFee()} NEST</p>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Total Pay</p>
          <p>{showTotalPay()} NEST</p>
        </Stack>

        <MainButton
          className="mainButton"
          disable={mainButtonDis()}
          loading={mainButtonLoading()}
          onClick={mainButtonAction}
        >
          {mainButtonTitle()}
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default OpenPosition;
