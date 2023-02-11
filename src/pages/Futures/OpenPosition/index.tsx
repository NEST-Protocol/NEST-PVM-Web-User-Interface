import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { OrderView, useFuturesOpenPosition } from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import "./styles";

type OpenPositionProp = {
  order: OrderView;
  onClose: () => void;
};

const OpenPosition: FC<OpenPositionProp> = ({ ...props }) => {
  const classPrefix = "OpenPosition";
  const { theme } = useThemes();
  const { nestAmount, setNestAmount, limit, setLimit, tp, setTp, sl, setSl, showPosition } =
    useFuturesOpenPosition(props.order);
  return (
    <MainCard
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <Stack spacing={0} alignItems="center">
        <p className="title">Open Position</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-position`}
        >
          <p>Position</p>
          <p>{showPosition()}</p>
        </Stack>
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
          <p>Fees</p>
          <p>666 NEST</p>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Total Pay</p>
          <p>666 NEST</p>
        </Stack>

        <MainButton
          className="mainButton"
          disable={false}
          loading={false}
          onClick={() => {}}
        >
          Approve
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default OpenPosition;
