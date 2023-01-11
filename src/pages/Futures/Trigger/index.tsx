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
  onClose: () => void;
};

const Trigger: FC<TriggerProp> = ({ ...props }) => {
  const classPrefix = "Trigger";
  const modalRisk = useRef<any>();
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
              onClick={() => {
                props.onClose();
                actionClose();
              }}
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
                  <p>margin*leverage*0.2%, trigger fee 15 NEST</p>
                </div>
              }
              arrow
            >
              <p className="underLine">Fees</p>
            </LightTooltip>
            <p>{`Execution Collect after ${showTriggerFee()}`}</p>
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
        ref={modalRisk}
        onClose={() => setShowTriggerRisk(false)}
        nested
      >
        <TriggerRiskModal
          onClose={() => setShowTriggerRisk(false)}
          action={() => {
            baseAction();
            props.onClose();
          }}
        />
      </Popup>
      <Stack spacing={0} alignItems="center">
        <p className="title">{showTitle()}</p>
        {stopLimit1()}
        {info()}
        <MainButton
          className="mainButton"
          disable={buttonDis()}
          loading={buttonLoading()}
          onClick={() => {
            if (buttonDis()) {
              return;
            }
            buttonAction();
            const triggerRiskModal = localStorage.getItem("TriggerRiskModal");
            if (triggerRiskModal === "1") {
              props.onClose();
            }
          }}
        >
          Confirm
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default Trigger;
