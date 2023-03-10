import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { TokenType } from "../../../libs/constants/addresses";
import {
  Futures3OrderView,
  useFuturesTrigger,
} from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import { LightTooltip } from "../../../styles/MUI";
import TriggerRiskModal from "../TriggerRisk";
import "./styles";

type TriggerProp = {
  order: Futures3OrderView;
  onClose: () => void;
  kValue?: { [key: string]: TokenType };
};

const Trigger: FC<TriggerProp> = ({ ...props }) => {
  const classPrefix = "Trigger";
  const modalRisk = useRef<any>();
  const { theme } = useThemes();
  const {
    stopProfitPriceInput,
    setStopProfitPriceInput,
    stopLossPriceInput,
    setStopLossPriceInput,
    showPosition,
    showOpenPrice,
    showTriggerFee,
    showTitle,
    actionCloseProfit,
    actionCloseLoss,
    buttonDis,
    buttonLoading,
    buttonAction,
    isEdit,
    showTPPlaceHolder,
    showSLPlaceHolder,
    showTriggerRisk,
    setShowTriggerRisk,
    baseAction,
    showLiqPrice,
    closeProfit,
    closeLoss,
  } = useFuturesTrigger(props.order, props.kValue);
  const stopLimit1 = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-stopLimit1`}
      >
        <p className={`${classPrefix}-stopLimit1-title`}>Take Profit</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input
            placeholder={showTPPlaceHolder()}
            value={stopProfitPriceInput}
            maxLength={32}
            onChange={(e) =>
              setStopProfitPriceInput(formatInputNumWithFour(e.target.value))
            }
          />
          <p>USDT</p>
          {closeProfit() ? (
            <MainButton
              className="TriggerClose"
              onClick={() => {
                props.onClose();
                actionCloseProfit();
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

  const stopLimit2 = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-stopLimit2`}
      >
        <p className={`${classPrefix}-stopLimit2-title`}>Stop Loss</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input
            placeholder={showSLPlaceHolder()}
            value={stopLossPriceInput}
            maxLength={32}
            onChange={(e) =>
              setStopLossPriceInput(formatInputNumWithFour(e.target.value))
            }
          />
          <p>USDT</p>
          {closeLoss() ? (
            <MainButton
              className="TriggerClose"
              onClick={() => {
                props.onClose();
                actionCloseLoss();
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Liq Price</p>
          <p>{showLiqPrice()} USDT</p>
        </Stack>
        {isEdit() ? (
          <></>
        ) : (
          <>
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
                    <p>Position fee =Position*0.1%</p>
                    <p>Stop order fee(after execution) = 15 NEST</p>
                  </div>
                }
                arrow
              >
                <p className="underLine">Fees</p>
              </LightTooltip>
              <p>{`${showTriggerFee()}`}</p>
            </Stack>
          </>
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
        {stopLimit2()}
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
