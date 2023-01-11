import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { OrderView, useFuturesTrigger } from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import { LightTooltip } from "../../../styles/MUI";
import TriggerRiskModal from "../TriggerRisk";
import "./styles";

type TriggerProp = {
  order: OrderView;
};

const Trigger: FC<TriggerProp> = ({ ...props }) => {
  const classPrefix = "Trigger";
  const modal = useRef<any>();
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
    showPlaceHolder,
    showTriggerRisk,
    setShowTriggerRisk,
    baseAction,
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
            placeholder={showPlaceHolder()}
            value={triggerInput !== "" ? `>${triggerInput}` : triggerInput}
            maxLength={32}
            onChange={(e) =>
              setTriggerInput(formatInputNumWithFour(e.target.value))
            }
          />
          <p>USDT</p>
          {isEdit() ? (
            <MainButton
              className="TriggerClose"
              onClick={actionClose}
            >
              <p>Close</p>
            </MainButton>
          ) : (
            <></>
          )}
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
      <Popup
        open={showTriggerRisk}
        modal
        ref={modal}
        onClose={() => setShowTriggerRisk(false)}
        nested
      >
        <TriggerRiskModal onClose={() => setShowTriggerRisk(false)} action={baseAction} />
      </Popup>
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
