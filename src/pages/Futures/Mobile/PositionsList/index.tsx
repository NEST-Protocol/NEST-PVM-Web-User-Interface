import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { FC, useState } from "react";
import { LongIcon, ShortIcon } from "../../../../components/Icon";
import MainButton from "../../../../components/MainButton";
import "./styles";
import classNames from "classnames";
import useThemes, { ThemeType } from "../../../../libs/hooks/useThemes";
import {
  useFuturesLimitOrderList,
  useFuturesOrderList,
} from "../../../../libs/hooks/useFutures";
import { FuturesList2Props, FuturesListProps } from "../../List/FuturesList";
import { DraweLimitEdit, DrawerAdd, DrawerClose, DrawerTrigger } from "./DrawerView";

enum DrawerType {
  add = 0,
  trigger = 1,
  orderEdit = 2,
  close = 3,
}

const PositionsList: FC<FuturesListProps> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.trigger);
  const { theme } = useThemes();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showBasePrice,
    showMarginAssets,
    showTriggerTitle,
  } = useFuturesOrderList(props.item, props.kValue);

  const drawerView = () => {
    switch (drawerType) {
      case DrawerType.add:
        return <DrawerAdd order={props.item} hideSelf={() => setShowDrawer(false)} />;
      case DrawerType.trigger:
        return <DrawerTrigger order={props.item} hideSelf={() => setShowDrawer(false)}/>;
      case DrawerType.close:
        return <DrawerClose order={props.item} hideSelf={() => setShowDrawer(false)} kValue={props.kValue}/>
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
          <p className="title">Actual Margin</p>
          <p className="value">{showMarginAssets()} NEST</p>
        </div>
        <div className="right">
          <p className="title">Open Price</p>
          <p className="value">{showBasePrice()} NEST</p>
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

export default PositionsList;

export const PositionsList2: FC<FuturesList2Props> = ({ ...props }) => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.orderEdit);
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
        return <DraweLimitEdit order={props.item} hideSelf={() => setShowDrawer(false)}/>
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
        spacing={0}
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
