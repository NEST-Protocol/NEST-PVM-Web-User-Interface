import { FC, useState } from "react";
import "./styles";
import { BigNumber } from "@ethersproject/bignumber";
import Stack from "@mui/material/Stack";
import { tokenList } from "../../../libs/constants/addresses";
import { PutDownIcon } from "../../../components/Icon";
import LongAndShort from "../../../components/LongAndShort";
import { LeverChoose } from "../../../components/LeverChoose";
import useWeb3 from "../../../libs/hooks/useWeb3";
import InfoShow from "../../../components/InfoShow";
import { SingleTokenShow } from "../../../components/TokenShow";
import { formatInputNum } from "../../../libs/utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import OpenShow from "../../../components/OpenShow";
import classNames from "classnames";
import PositionsList from "./PositionsList";
import MainButton from "../../../components/MainButton";
import { Popover } from "@mui/material";

const FuturesMobile: FC = () => {
  const { chainId } = useWeb3();
  const [isLong, setIsLong] = useState(true);
  const [nestBalance, setNestBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [limit, setLimit] = useState(false);
  const [stop, setStop] = useState(false);
  const [isPositions, setIsPositions] = useState(true);
  const [nestInput, setNestInput] = useState<string>("");
  const [leverNum, setLeverNum] = useState<number>(1);
  const classPrefix = "FuturesMobile";
  const BTCIcon = tokenList["BTC"].Icon;
  const ETHIcon = tokenList["ETH"].Icon;
  const USDTIcon = tokenList["USDT"].Icon;

  const handleLeverNum = (selected: number) => {
    setLeverNum(selected);
  };

  const checkNESTBalance = () => {
    if (nestInput === "") {
      return false;
    }
    return parseUnits(nestInput, 18).gt(nestBalance || BigNumber.from("0"));
  };

  const tokenPairAndPrice = () => {
    const TokenIcon = tokenList["ETH"].Icon;
    
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-tokenPairAndPrice`}
        id={"qwer"}
      >
        <button onClick={(e) => setAnchorEl(e.currentTarget)}>
          <TokenIcon />
          <USDTIcon className="USDT" />
          <PutDownIcon />
        </button>
        <p>1 ETH = 3116.6 USDT</p>
      </Stack>
    );
  };
  const KPrice = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-KPrice`}
      ></Stack>
    );
  };
  const mainView = () => {
    const leverList =
      chainId === 1
        ? [
            { text: "1X", value: 1 },
            { text: "2X", value: 2 },
            { text: "3X", value: 3 },
            { text: "4X", value: 4 },
            { text: "5X", value: 5 },
          ]
        : [
            { text: "1X", value: 1 },
            { text: "2X", value: 2 },
            { text: "5X", value: 5 },
            { text: "10X", value: 10 },
            { text: "15X", value: 15 },
            { text: "20X", value: 20 },
          ];
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
    return (
      <Stack
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-mainView`}
      >
        <LongAndShort callBack={(e) => setIsLong(e)} isLong={isLong} />
        <LeverChoose
          selected={leverNum}
          list={leverList}
          callBack={handleLeverNum}
          title={"Leverage"}
        />
        <InfoShow
          topLeftText={"Payment"}
          bottomRightText={""}
          topRightText={`Balance: ${
            nestBalance ? formatUnits(nestBalance, 18) : "----"
          } NEST`}
          topRightRed={checkNESTBalance()}
        >
          <SingleTokenShow tokenNameOne={"NEST"} isBold />
          <input
            placeholder={"Input"}
            className={"input-middle"}
            value={nestInput}
            maxLength={32}
            onChange={(e) => setNestInput(formatInputNum(e.target.value))}
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
          spacing={2}
          className={`${classPrefix}-showHid`}
        >
          <OpenShow
            isOn={limit}
            title={"Limit Price"}
            onclick={() => setLimit(!limit)}
          />
          <OpenShow
            isOn={stop}
            title={"Stop-Limit"}
            onclick={() => setStop(!stop)}
          />
        </Stack>

        {limit ? limitPrice() : <></>}
        {stop ? stopLimit1() : <></>}
        {stop ? stopLimit2() : <></>}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Open Price</p>
          <p>1266.6 USDT</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Service Fee</p>
          <p>1266.6 USDT</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Total Pay</p>
          <p>1266.6 USDT</p>
        </Stack>
        <MainButton className="mainButton">Open Long</MainButton>
      </Stack>
    );
  };
  const listTab = () => {
    return (
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-listTab`}
      >
        <button
          className={classNames({
            [`selected`]: isPositions,
          })}
          onClick={() => setIsPositions(true)}
        >
          Positions
        </button>
        <button
          className={classNames({
            [`selected`]: !isPositions,
          })}
          onClick={() => setIsPositions(false)}
        >
          Order
        </button>
      </Stack>
    );
  };
  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      {tokenPairAndPrice()}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className={"selectToken"}
      >
        <ul>
          <li onClick={() => {
            console.log(111)
            setAnchorEl(null)
          }}><ETHIcon /><USDTIcon className="USDT" /><p>ETH/USDT</p></li>
          <li><BTCIcon /><USDTIcon className="USDT" /><p>BTC/USDT</p></li>
        </ul>
      </Popover>
      {KPrice()}
      {mainView()}
      {listTab()}
      <ul className="list">
        <li>
          <PositionsList />
        </li>
      </ul>
    </Stack>
  );
};

export default FuturesMobile;
