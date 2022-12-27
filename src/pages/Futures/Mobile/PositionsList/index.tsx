import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { FC, useState } from "react";
import { LongIcon } from "../../../../components/Icon";
import MainButton from "../../../../components/MainButton";
import { tokenList } from "../../../../libs/constants/addresses";
import "./styles";

const PositionsList: FC = () => {
  const classPrefix = "positionsList";
  const [showDrawer, setShowDrawer] = useState(false);
  const TokenOneSvg = tokenList["ETH"].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
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
        <MainButton>Add</MainButton>
        <MainButton onClick={() => setShowDrawer(true)}>Edit</MainButton>
        <MainButton>Close</MainButton>
      </Stack>
      <Drawer
        anchor={"bottom"}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <input/>
      </Drawer>
    </Stack>
  );
};

export default PositionsList;
