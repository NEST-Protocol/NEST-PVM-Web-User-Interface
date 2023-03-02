import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { FC, useState } from "react";
import {
  LongIcon,
  ShareWhiteIcon,
  ShortIcon,
  XIcon,
} from "../../../../components/Icon";
import MainButton from "../../../../components/MainButton";
import "./styles";
import classNames from "classnames";
import useThemes, { ThemeType } from "../../../../libs/hooks/useThemes";
import {
  useFutures3OrderList,
  useFuturesLimitOrderList,
  useFuturesOldOrderList,
  useFuturesOrderList,
} from "../../../../libs/hooks/useFutures";
import {
  FuturesList2Props,
  FuturesList3Props,
  FuturesListProps,
  FuturesOldListProps,
} from "../../List/FuturesList";
import {
  DrawerLimitEdit,
  DrawerAdd,
  DrawerClose,
  DrawerTrigger,
} from "./DrawerView";
import { LightTooltip } from "../../../../styles/MUI";

enum DrawerType {
  add = 0,
  trigger = 1,
  orderEdit = 2,
  close = 3,
}

const PositionsList3: FC<FuturesList3Props> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.trigger);
  const { theme } = useThemes();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBasePrice,
    showMarginAssets,
    showTriggerTitle,
    showPercent,
    showLiqPrice,
    showStopPrice,
  } = useFutures3OrderList(props.item, props.kValue);

  const drawerView = () => {
    switch (drawerType) {
      case DrawerType.add:
        return (
          <DrawerAdd order={props.item} hideSelf={() => setShowDrawer(false)} />
        );
      case DrawerType.trigger:
        return (
          <DrawerTrigger
            order={props.item}
            hideSelf={() => setShowDrawer(false)}
          />
        );
      case DrawerType.close:
        return (
          <DrawerClose
            order={props.item}
            hideSelf={() => setShowDrawer(false)}
            kValue={props.kValue}
          />
        );
    }
  };

  const endButton = () => {
    const text =
      props.item.baseBlock.toString() === "0"
        ? "Liquidated"
        : "Trigger executed";
    return (
      <button
        className="endOrder"
        onClick={() => props.hideOrder(props.item.index)}
      >
        <p>{text}</p>
        <XIcon />
      </button>
    );
  };

  const isEnd = () => {
    return props.item.actualMargin !== undefined;
  };

  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-one`}
      >
        <div className="left">
          <p className="title">Symbol</p>
          <Stack direction="row" spacing={1} alignItems="left">
            <div className="pairIcon">
              <TokenOneSvg />
              <TokenTwoSvg className="USDT" />
            </div>
            <p className="value positionLever">
              {props.item.lever.toString()}X
            </p>
            <div className="longShort">
              {props.item.orientation ? <LongIcon /> : <ShortIcon />}
              <p className={props.item.orientation ? "red" : "green"}>
                {props.item.orientation ? "Long" : "Short"}
              </p>
            </div>
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-two`}
      >
        <div className="left">
          <LightTooltip
            placement="top"
            title={
              <div>
                <p>
                  The net asset value, if this value is lower than liquidation
                  amount, the position will be liquidated. Liquidation ratio =
                  0.5% Liquidation amount = margin * leverage * (current
                  price/initial price)*Liquidation ratio
                </p>
              </div>
            }
            arrow
          >
            <p
              className={classNames({
                [`title positionActual`]: true,
                [`underLine`]: true,
              })}
            >
              Actual Margin
            </p>
          </LightTooltip>
          <Stack direction="row" spacing={1} alignItems="left">
            <p className="value">{showMarginAssets()} NEST</p>
            <p
              className="value"
              style={{ color: showPercent() >= 0 ? "#80C269" : "#FF0000" }}
            >
              {showPercent() > 0 ? '+' : ''}{showPercent().toFixed(2)}%
            </p>
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-three`}
      >
        <div className="left">
          <p className="title">Open Price</p>
          <p className="value">{showBasePrice()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Liq Price </p>
          <p className="value">{showLiqPrice()} USDT</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-four`}
      >
        <div className="left">
          <p className="title">Stop Order</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            {showStopPrice().map((item, index) => {
              return (
                <p className="value" key={`stopOrder+${index}`}>
                  {item}
                </p>
              );
            })}
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        className={`${classPrefix}-button`}
      >
        {isEnd() ? (
          endButton()
        ) : (
          <>
            <MainButton
              onClick={() => {
                setShowDrawer(true);
                setDrawerType(DrawerType.add);
              }}
            >
              Add
            </MainButton>
            <MainButton
              onClick={() => {
                setShowDrawer(true);
                setDrawerType(DrawerType.trigger);
              }}
            >
              {showTriggerTitle()}
            </MainButton>
            <MainButton
              onClick={() => {
                setShowDrawer(true);
                setDrawerType(DrawerType.close);
              }}
            >
              Close
            </MainButton>
          </>
        )}
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        className={`${classPrefix}-futuresShare`}
      >
        <button>
          <ShareWhiteIcon />
        </button>
      </Stack>
      <Drawer
        anchor={"bottom"}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        className={classNames({
          [`${classPrefix}-drawer`]: true,
          [`${classPrefix}-drawer-dark`]: theme === ThemeType.dark,
        })}
      >
        {drawerView()}
      </Drawer>
    </Stack>
  );
};

export const PositionsList: FC<FuturesListProps> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBasePrice,
    showMarginAssets,
    showPercent,
    showLiqPrice,
    showStopPrice,
    buttonLoading,
    buttonDis,
    buttonAction,
  } = useFuturesOrderList(props.item, props.kValue);

  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-one`}
      >
        <div className="left">
          <p className="title">Positions</p>
          <Stack direction="row" spacing={1} alignItems="left">
            <div className="pairIcon">
              <TokenOneSvg />
              <TokenTwoSvg className="USDT" />
            </div>
            <p className="value positionLever">
              {props.item.lever.toString()}X
            </p>
            <div className="longShort">
              {props.item.orientation ? <LongIcon /> : <ShortIcon />}
              <p className={props.item.orientation ? "red" : "green"}>
                {props.item.orientation ? "Long" : "Short"}
              </p>
            </div>
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-two`}
      >
        <div className="left">
          <LightTooltip
            placement="top"
            title={
              <div>
                <p>
                  The net asset value, if this value is lower than liquidation
                  amount, the position will be liquidated. Liquidation ratio =
                  0.5% Liquidation amount = margin * leverage * (current
                  price/initial price)*Liquidation ratio
                </p>
              </div>
            }
            arrow
          >
            <p
              className={classNames({
                [`title positionActual`]: true,
                [`underLine`]: true,
              })}
            >
              Actual Margin
            </p>
          </LightTooltip>
          <Stack direction="row" spacing={1} alignItems="left">
            <p className="value">{showMarginAssets()} NEST</p>
            <p
              className="value"
              style={{ color: showPercent() >= 0 ? "#80C269" : "#FF0000" }}
            >
              {showPercent() > 0 ? '+' : ''}{showPercent().toFixed(2)}%
            </p>
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-three`}
      >
        <div className="left">
          <p className="title">Open Price</p>
          <p className="value">{showBasePrice()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Liq Price </p>
          <p className="value">{showLiqPrice()} USDT</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-four`}
      >
        <div className="left">
          <p className="title">Stop Order</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            {showStopPrice().map((item, index) => {
              return (
                <p className="value" key={`stopOrder+${index}`}>
                  {item}
                </p>
              );
            })}
          </Stack>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        className={`${classPrefix}-button`}
      >
        <MainButton
          disable={buttonDis()}
          loading={buttonLoading()}
          onClick={buttonAction}
        >
          Close
        </MainButton>
      </Stack>
    </Stack>
  );
};

export default PositionsList3;

export const PositionsList2: FC<FuturesList2Props> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(
    DrawerType.orderEdit
  );
  const { theme } = useThemes();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showLimitPrice,
    closeButtonLoading,
    closeButtonDis,
    closeButtonAction,
  } = useFuturesLimitOrderList(props.item);

  const drawerView = () => {
    switch (drawerType) {
      case DrawerType.orderEdit:
        return (
          <DrawerLimitEdit
            order={props.item}
            hideSelf={() => setShowDrawer(false)}
          />
        );
    }
  };

  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-one`}
      >
        <div className="left">
          <p className="title">Token Pair</p>
          <div className="pairIcon">
            <TokenOneSvg />
            <TokenTwoSvg className="USDT" />
          </div>
        </div>
        <div className="right">
          <p className="title">Lever</p>
          <p className="value">{props.item.lever.toString()}X</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-two`}
      >
        <div className="left">
          <p className="title">Initial Margin</p>
          <p className="value">{showBalance()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Type</p>
          <div className="longShort">
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </div>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-three`}
      >
        <div className="left">
          <p className="title">Limit Price</p>
          <p className="value">{showLimitPrice()} NEST</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        className={`${classPrefix}-button`}
      >
        <MainButton
          onClick={() => {
            setShowDrawer(true);
            setDrawerType(DrawerType.orderEdit);
          }}
        >
          Edit
        </MainButton>
        <MainButton
          loading={closeButtonLoading()}
          disable={closeButtonDis()}
          onClick={closeButtonAction}
        >
          Close
        </MainButton>
      </Stack>
      <Drawer
        anchor={"bottom"}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        className={classNames({
          [`${classPrefix}-drawer`]: true,
          [`${classPrefix}-drawer-dark`]: theme === ThemeType.dark,
        })}
      >
        {drawerView()}
      </Drawer>
    </Stack>
  );
};

export const PositionsOldList: FC<FuturesOldListProps> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showBasePrice,
    showMarginAssets,
    closeButtonLoading,
    closeButtonDis,
    closeButtonAction,
  } = useFuturesOldOrderList(props.item, props.kValue);
  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-one`}
      >
        <div className="left">
          <p className="title">Token Pair</p>
          <div className="pairIcon">
            <TokenOneSvg />
            <TokenTwoSvg className="USDT" />
          </div>
        </div>
        <div className="right">
          <p className="title">Lever</p>
          <p className="value">{props.item.lever.toString()}X</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-two`}
      >
        <div className="left">
          <p className="title">Initial Margin</p>
          <p className="value">{showBalance()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Type</p>
          <div className="longShort">
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </div>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-three`}
      >
        <div className="left">
          <p className="title">Actual Margin</p>
          <p className="value">{showMarginAssets()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Open Price</p>
          <p className="value">{showBasePrice()} USDT</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-button`}
      >
        <MainButton
          loading={closeButtonLoading()}
          disable={closeButtonDis()}
          onClick={closeButtonAction}
        >
          Close
        </MainButton>
      </Stack>
    </Stack>
  );
};
