import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { OrderView, useFuturesTrigger } from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import { LightTooltip } from "../../../styles/MUI";
import "./styles";

type TriggerProp = {
  order: OrderView;
};

const Trigger: FC<TriggerProp> = ({ ...props }) => {
  const classPrefix = "Trigger";
  const { theme } = useThemes();
  const {
    triggerInput,
    setTriggerInput,
    showPosition,
    showOpenPrice,
    showTriggerFee,
    showTitle,
    actionClose,
    buttonDis,
    buttonLoading,
    buttonAction,
    isEdit,
  } = useFuturesTrigger(props.order);
  const stopLimit1 = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-stopLimit1`}
      >
        <p className={`${classPrefix}-stopLimit1-title`}>Trigger</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input
            placeholder={"Input"}
            value={triggerInput}
            maxLength={32}
            onChange={(e) =>
              setTriggerInput(formatInputNumWithFour(e.target.value))
            }
          />
          <p>USDT</p>
        </Stack>
      </Stack>
    );
  };
  const info = () => {
    return (
      <>
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
          <p>Open Price</p>
          <p>{showOpenPrice()}</p>
        </Stack>
        {isEdit() ? (
          <></>
        ) : (
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
                  <p>Trigger fee: cost × leverage × 0.2% </p>
                  <p>Execution fee : 15NEST</p>
                </div>
              }
              arrow
            >
              <p className="underLine">Fees</p>
            </LightTooltip>
            <p>{showTriggerFee()}</p>
          </Stack>
        )}
      </>
    );
  };
  return (
    <MainCard
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <Stack spacing={0} alignItems="center">
        <p className="title">{showTitle()}</p>
        {stopLimit1()}
        {info()}
        <MainButton
          className="mainButton"
          disable={buttonDis()}
          loading={buttonLoading()}
          onClick={buttonAction}
        >
          Confirm
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default Trigger;
