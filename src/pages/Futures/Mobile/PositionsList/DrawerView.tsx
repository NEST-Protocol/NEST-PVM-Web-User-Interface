import Stack from "@mui/material/Stack";
import { formatUnits } from "ethers/lib/utils";
import { FC } from "react";
import InfoShow from "../../../../components/InfoShow";
import MainButton from "../../../../components/MainButton";
import { SingleTokenShow } from "../../../../components/TokenShow";
import { TokenType } from "../../../../libs/constants/addresses";
import {
  LimitOrderView,
  OrderView,
  useFuturesAdd,
  useFuturesCloseOrder,
  useFuturesSetLimitOrder,
  useFuturesTrigger,
} from "../../../../libs/hooks/useFutures";
import { formatInputNumWithFour } from "../../../../libs/utils";
import { LightTooltip } from "../../../../styles/MUI";

const classPrefix = "positionsList";

type DrawerBaseType = {
  order: OrderView;
  hideSelf: () => void;
};

type DrawerCloseType = {
  order: OrderView;
  hideSelf: () => void;
  kValue?: { [key: string]: TokenType };
};

type DrawerLimitEditType = {
  order: LimitOrderView;
  hideSelf: () => void;
};

export const DrawerAdd: FC<DrawerBaseType> = ({ ...props }) => {
  const {
    nestInput,
    setNestInput,
    nestBalance,
    checkNESTBalance,
    showPosition,
    showOpenPrice,
    showFee,
    buttonLoading,
    buttonDis,
    buttonAction,
  } = useFuturesAdd(props.order);
  return (
    <Stack spacing={0}>
      <p className="title">Add Position</p>
      <Stack spacing={0}>
        <InfoShow
          topLeftText={"Payment"}
          bottomRightText={""}
          topRightText={`Balance: ${
            nestBalance
              ? parseFloat(formatUnits(nestBalance, 18)).toFixed(2).toString()
              : "----"
          } NEST`}
          topRightRed={!checkNESTBalance()}
        >
          <SingleTokenShow tokenNameOne={"NEST"} isBold />
          <input
            placeholder={"Input"}
            className={"input-middle"}
            value={nestInput}
            maxLength={32}
            onChange={(e) =>
              setNestInput(formatInputNumWithFour(e.target.value))
            }
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setNestInput(nestBalance ? formatUnits(nestBalance, 18) : "")
            }
          >
            MAX
          </button>
        </InfoShow>
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
          <p>Open price</p>
          <p>{showOpenPrice()}</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <LightTooltip
            placement="top-start"
            title={"open positions fee: cost x leverage x 0.2% "}
            arrow
          >
            <p className="underLine">Fees</p>
          </LightTooltip>
          <p>{showFee()} NEST</p>
        </Stack>
      </Stack>
      <MainButton
        className="action"
        loading={buttonLoading()}
        disable={buttonDis()}
        onClick={() => {
          if (buttonDis()) {
            return;
          }
          props.hideSelf();
          buttonAction();
        }}
      >
        Confirm
      </MainButton>
    </Stack>
  );
};

export const DrawerTrigger: FC<DrawerBaseType> = ({ ...props }) => {
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
  return (
    <Stack spacing={0}>
      <p className="title">{showTitle()}</p>
      <Stack spacing={0}>
        {stopLimit1()}
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
          <p>Open price</p>
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
              placement="top-start"
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
      </Stack>
      <MainButton
        className="action"
        loading={buttonLoading()}
        disable={buttonDis()}
        onClick={() => {
          if (buttonDis()) {
            return;
          }
          props.hideSelf();
          buttonAction();
        }}
      >
        Confirm
      </MainButton>
    </Stack>
  );
};

export const DrawerClose: FC<DrawerCloseType> = ({ ...props }) => {
  const {
    showPosition,
    showClosePrice,
    showFee,
    buttonLoading,
    buttonDis,
    buttonAction,
  } = useFuturesCloseOrder(props.order, props.kValue);
  return (
    <Stack spacing={0}>
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
          placement="top-start"
          title={"Close positions fee: cost x leverage x 0.2%"}
          arrow
        >
          <p className="underLine">Fees</p>
        </LightTooltip>
        <p>{showFee()} NEST</p>
      </Stack>
      <MainButton
        className="action"
        loading={buttonLoading()}
        disable={buttonDis()}
        onClick={buttonAction}
      >
        Confirm
      </MainButton>
    </Stack>
  );
};

export const DrawerLimitEdit: FC<DrawerLimitEditType> = ({ ...props }) => {
  const { limitInput, setLimitInput, buttonLoading, buttonDis, buttonAction } =
    useFuturesSetLimitOrder(props.order);
  return (
    <Stack spacing={0}>
      <p className="title">Limit Price</p>
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
      <MainButton
        className="action"
        loading={buttonLoading()}
        disable={buttonDis()}
        onClick={() => {
          if (buttonDis()) {
            return;
          }
          props.hideSelf();
          buttonAction();
        }}
      >
        Confirm
      </MainButton>
    </Stack>
  );
};
