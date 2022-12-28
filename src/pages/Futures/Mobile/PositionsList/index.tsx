import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { FC, useState } from "react";
import { LongIcon } from "../../../../components/Icon";
import MainButton from "../../../../components/MainButton";
import { tokenList } from "../../../../libs/constants/addresses";
import "./styles";

enum DrawerType {
  trigger = 1,
  triggerEdit = 2,
  orderEdit = 3,
}

const PositionsList: FC = () => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.trigger);
  const TokenOneSvg = tokenList["ETH"].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;

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
        <MainButton>Current Price</MainButton>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input />
          <p>USDT</p>
        </Stack>
      </Stack>
    );
  };
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
          <input />
          <p>USDT</p>
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
          <input />
          <p>USDT</p>
        </Stack>
      </Stack>
    );
  };

  const drawerView = () => {
    const titleString = () => {
      switch (drawerType) {
        case DrawerType.trigger:
          return "Trigger Position";
        case DrawerType.triggerEdit:
          return "Edit Trigger";
        case DrawerType.orderEdit:
          return "Edit Order";
      }
    };
    const buttonString = () => {
      switch (drawerType) {
        case DrawerType.trigger:
          return "Confirm";
        case DrawerType.triggerEdit:
          return "Confirm New Trigger";
        case DrawerType.orderEdit:
          return "Confirm New Price";
      }
    };
    const mainView = () => {
      switch (drawerType) {
        case DrawerType.trigger:
          return (
            <Stack spacing={0}>
              {stopLimit1()}
              {stopLimit2()}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
                className={`${classPrefix}-infoShow`}
              >
                <p>Position</p>
                <p>5X Long 5000 NEST</p>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
                className={`${classPrefix}-infoShow`}
              >
                <p>Open price</p>
                <p>1000 USDT</p>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
                className={`${classPrefix}-infoShow`}
              >
                <p>Fees</p>
                <p>300 USDT</p>
              </Stack>
            </Stack>
          );
        case DrawerType.triggerEdit:
          return (
            <Stack spacing={0}>
              {stopLimit1()}
              {stopLimit2()}
            </Stack>
          );
        case DrawerType.orderEdit:
          return <Stack spacing={0}>{limitPrice()}</Stack>;
      }
    };
    return (
      <Stack spacing={0}>
        <p className="title">{titleString()}</p>
        {mainView()}
        <MainButton className="action">{buttonString()}</MainButton>
      </Stack>
    );
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
          <p className="value">5X</p>
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
          <p className="value">500 NEST</p>
        </div>
        <div className="right">
          <p className="title">Type</p>
          <div className="longShort">
            <LongIcon />
            Long
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
          <p className="value">3232.45 NEST</p>
        </div>
        <div className="right">
          <p className="title">Open Price</p>
          <p className="value">1234.4 NEST</p>
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-button`}
      >
        <MainButton onClick={() => {
            setShowDrawer(true)
            setDrawerType(DrawerType.trigger)
        }}>Add</MainButton>
        <MainButton onClick={() => {
            setShowDrawer(true)
            setDrawerType(DrawerType.triggerEdit)
        }}>Edit</MainButton>
        <MainButton onClick={() => {
            setShowDrawer(true)
            setDrawerType(DrawerType.orderEdit)
        }}>Close</MainButton>
      </Stack>
      <Drawer
        anchor={"bottom"}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        className={`${classPrefix}-drawer`}
      >
        {drawerView()}
      </Drawer>
    </Stack>
  );
};

export default PositionsList;
