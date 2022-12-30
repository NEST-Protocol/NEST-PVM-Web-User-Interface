import { FC, useState } from "react";
import { checkWidth, formatInputNum } from "../../libs/utils";
import FuturesMobile from "./Mobile";
import "./styles";
import Stack from "@mui/material/Stack";
import useWeb3 from "../../libs/hooks/useWeb3";
import { BigNumber } from "ethers";
import { tokenList } from "../../libs/constants/addresses";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import ChooseType from "../../components/ChooseType";
import { LeverChoose } from "../../components/LeverChoose";
import InfoShow from "../../components/InfoShow";
import { SingleTokenShow } from "../../components/TokenShow";
import OpenShow from "../../components/OpenShow";
import MainButton from "../../components/MainButton";
import { PutDownIcon } from "../../components/Icon";
import { Popover } from "@mui/material";
import classNames from "classnames";
import PerpetualsList, { PerpetualsList2 } from "../../components/PerpetualsList";
import TVChart from "../../components/TVChart";

const Futures: FC = () => {
  const classPrefix = "Futures";
  const isPC = checkWidth();
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

  const topView = () => {
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
        direction="row"
        justifyContent="center"
        alignItems="top"
        spacing={0}
        className={`${classPrefix}-topView`}
      >
        <Stack spacing={0} className={`${classPrefix}-topView-left`}>
          <p className={`${classPrefix}-tokenPair`}>Token pair</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`${classPrefix}-tokenPairAndPrice`}
            id={"qwer"}
          >
            <button onClick={(e) => setAnchorEl(e.currentTarget)}>
              <ETHIcon />
              <USDTIcon className="USDT" />
              <p>ETH/USDT</p>
              <PutDownIcon className="putDown" />
            </button>
            <p>1 ETH = 3116.6 USDT</p>
          </Stack>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            className={`${classPrefix}-selectToken`}
          >
            <ul>
              <li
                onClick={() => {
                  setAnchorEl(null);
                }}
              >
                <ETHIcon />
                <USDTIcon className="USDT" />
                <p>ETH/USDT</p>
              </li>
              <li>
                <BTCIcon />
                <USDTIcon className="USDT" />
                <p>BTC/USDT</p>
              </li>
            </ul>
          </Popover>
          <ChooseType
            callBack={(e: any) => setIsLong(e)}
            isLong={isLong}
            textArray={[`Long`, `Short`]}
          />
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
            justifyContent="center"
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
        <Stack spacing={0} className={`${classPrefix}-topView-right`}>
          <p className="title">ETH/USDT</p>
          <TVChart chainId={56} tokenPair={"ETH"}/>
        </Stack>
      </Stack>
    );
  };

  const listView1 = () => {
    return (
      <table className={`${classPrefix}-table`}>
        <thead>
          <tr className={`${classPrefix}-table-title`}>
            <th>Token Pair</th>
            <th>Type</th>
            <th>Lever</th>
            <th>Initial Margin</th>
            <th>Open Price</th>
            <th>Actual Margin</th>
            <th>Operate</th>
          </tr>
        </thead>
        <tbody>
          <PerpetualsList
            key={"q"}
            item={{
              index: BigNumber.from("1"),
              tokenAddress: "",
              lever: BigNumber.from("2"),
              orientation: false,
              balance: parseUnits("23", 18),
              basePrice: parseUnits("23", 18),
              baseBlock: parseUnits("23", 18),
            }}
            className={classPrefix}
          />
        </tbody>
      </table>
    );
  };
  const listView2 = () => {
    return (
        <table className={`${classPrefix}-table`}>
          <thead>
            <tr className={`${classPrefix}-table-title`}>
              <th>Token Pair</th>
              <th>Type</th>
              <th>Lever</th>
              <th>Initial Margin</th>
              <th>Limit Price</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            <PerpetualsList2
              key={"q2"}
              item={{
                index: BigNumber.from("1"),
                tokenAddress: "",
                lever: BigNumber.from("2"),
                orientation: false,
                balance: parseUnits("23", 18),
                basePrice: parseUnits("23", 18),
                baseBlock: parseUnits("23", 18),
              }}
              className={classPrefix}
            />
          </tbody>
        </table>
      );
  };
  return !isPC ? (
    <FuturesMobile />
  ) : (
    <Stack spacing={0} alignItems="center" className={`${classPrefix}`}>
      {topView()}
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
      {isPositions ? listView1() : listView2()}
    </Stack>
  );
};

export default Futures;
