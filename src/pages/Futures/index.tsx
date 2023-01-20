import {FC, useCallback, useEffect, useRef, useState} from "react";
import {
  checkWidth,
  formatInputNum,
  formatInputNumWithFour,
} from "../../libs/utils";
import FuturesMobile from "./Mobile";
import "./styles";
import Stack from "@mui/material/Stack";
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
import TVChart from "../../components/TVChart";
import { useFutures } from "../../libs/hooks/useFutures";
import FuturesList, { FuturesList2, FuturesListOld } from "./List/FuturesList";
import { LightTooltip } from "../../styles/MUI";
import PerpetualsNoticeModal from "./PerpetualsNoticeModal";
import Popup from "reactjs-popup";
import TriggerRiskModal from "./TriggerRisk";
import useWeb3 from "../../libs/hooks/useWeb3";
import axios from "axios";

const Futures: FC = () => {
  const classPrefix = "Futures";
  const { account } = useWeb3()
  const isPC = checkWidth();
  const modal = useRef<any>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const {
    chainId,
    isLong,
    setIsLong,
    nestBalance,
    limit,
    setLimit,
    stop,
    setStop,
    isPositions,
    setIsPositions,
    nestInput,
    setNestInput,
    leverNum,
    setLeverNum,
    setTokenPair,
    limitInput,
    setLimitInput,
    takeInput,
    setTakeInput,
    tokenPrice,
    tokenPair,
    checkNESTBalance,
    fee,
    showFee,
    mainButtonTitle,
    mainButtonDis,
    mainButtonAction,
    mainButtonLoading,
    orderList,
    limitOrderList,
    oldOrderList,
    kValue,
    orderEmpty,
    limitEmpty,
    showNotice,
    setShowNotice,
    showTriggerRisk,
    setShowTriggerRisk,
    hideOrder,
    showClosedOrder,
    baseAction,
    feeHoverText,
  } = useFutures();
  const BTCIcon = tokenList["BTC"].Icon;
  const ETHIcon = tokenList["ETH"].Icon;
  const USDTIcon = tokenList["USDT"].Icon;

  const handleInviteCode = useCallback(async () => {
    const href = window.location.href;
    const inviteCode = href?.split("?a=")[1];
    if (inviteCode && inviteCode.length === 8) {
      window.localStorage.setItem("inviteCode", inviteCode.toLowerCase());
    }
  }, []);

  const postInviteCode = useCallback(async () => {
    const inviteCode = window.localStorage.getItem("inviteCode");
    if (inviteCode && account) {
      if (inviteCode === account.toLowerCase().slice(-8)) {
        return;
      }

      try {
        await axios({
          method: "post",
          url: "https://api.nestfi.net/api/users/users/saveInviteUser",
          data: {
            address: account,
            code: inviteCode,
            timestamp: new Date().getTime(),
          }
        })
        window.localStorage.removeItem("inviteCode");
      } catch (e) {
        console.log(e)
      }
    }
  }, [account, localStorage.getItem('inviteCode')]);

  useEffect(() => {
    handleInviteCode()
  }, [handleInviteCode])

  useEffect(() => {
    postInviteCode()
  }, [postInviteCode])

  const handleLeverNum = (selected: number) => {
    setLeverNum(selected);
  };

  const noOrders = () => {
    return <p className="emptyOrder">No Orders</p>;
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
            <input
              placeholder={tokenPrice.price}
              value={limitInput}
              maxLength={32}
              onChange={(e) => setLimitInput(formatInputNum(e.target.value))}
            />
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
          <p className={`${classPrefix}-stopLimit1-title`}>Trigger</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={`${tokenPrice.price}`}
              value={takeInput}
              maxLength={32}
              onChange={(e) =>
                setTakeInput(`${formatInputNum(e.target.value)}`)
              }
            />
            <p>USDT</p>
          </Stack>
        </Stack>
      );
    };
    const chartHeight = () => {
      if (stop && limit) {
        return 565;
      } else if (!stop && !limit) {
        return 475;
      } else if (stop && !limit) {
        return 534;
      } else if (!stop && limit) {
        return 506;
      }
    };
    const LeftIcon = tokenPrice.leftIcon;
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
          >
            <button onClick={(e) => setAnchorEl(e.currentTarget)}>
              <LeftIcon />
              <USDTIcon className="USDT" />
              <p>{tokenPrice ? tokenPrice.tokenName : "---"}/USDT</p>
              <PutDownIcon className="putDown" />
            </button>
            <p>1 {tokenPrice.tokenName} = {tokenPrice ? tokenPrice.price : "---"} USDT</p>
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
                  setTokenPair("ETH");
                  setAnchorEl(null);
                }}
              >
                <ETHIcon />
                <USDTIcon className="USDT" />
                <p>ETH/USDT</p>
              </li>
              <li
                onClick={() => {
                  setTokenPair("BTC");
                  setAnchorEl(null);
                }}
              >
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
              nestBalance
                ? parseFloat(formatUnits(nestBalance, 18)).toFixed(2).toString()
                : "---"
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
                setNestInput(
                  nestBalance
                    ? parseFloat(formatUnits(nestBalance, 18))
                        .toFixed(2)
                        .toString()
                    : ""
                )
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
              title={"Limit Order"}
              onclick={() => setLimit(!limit)}
            />
            <OpenShow
              isOn={stop}
              title={"Stop Order"}
              onclick={() => setStop(!stop)}
            />
          </Stack>

          {limit ? limitPrice() : <></>}
          {stop ? stopLimit1() : <></>}
          {limit ? (
            <></>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              className={`${classPrefix}-infoShow`}
            >
              <p>Open Price</p>
              <p>{tokenPrice ? tokenPrice.price : "---"} USDT</p>
            </Stack>
          )}
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
                  {feeHoverText().map((item, index) => {
                    return <p key={`hover+${index}`}>{item}</p>;
                  })}
                </div>
              }
              arrow
            >
              <p className="underLine">Service Fee</p>
            </LightTooltip>
            <p>{showFee()} NEST</p>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`${classPrefix}-infoShow`}
          >
            <p>Total Pay</p>

            <p>
              {parseFloat(
                formatUnits(
                  fee.add(parseUnits(nestInput === "" ? "0" : nestInput, 18)),
                  18
                )
              )
                .toFixed(2)
                .toString()}{" "}
              NEST
            </p>
          </Stack>
          <MainButton
            className="mainButton"
            disable={mainButtonDis()}
            onClick={mainButtonAction}
            loading={mainButtonLoading()}
          >
            {mainButtonTitle()}
          </MainButton>
        </Stack>
        <Stack spacing={0} className={`${classPrefix}-topView-right`}>
          <p className="title">{tokenPair}/USDT</p>
          <TVChart
            chainId={56}
            tokenPair={tokenPair}
            chartHeight={chartHeight()}
          />
        </Stack>
      </Stack>
    );
  };

  const listView1 = () => {
    const orderListView = () => {
      return [...orderList, ...showClosedOrder].map((item) => {
        return (
          <FuturesList
            key={`f+${item.index}`}
            item={item}
            kValue={kValue}
            className={classPrefix}
            hideOrder={hideOrder}
          />
        );
      });
    };
    const oldOrderListView = () => {
      return oldOrderList.map((item) => {
        return (
          <FuturesListOld
            key={`fOld+${item.index}`}
            item={item}
            kValue={kValue}
            className={classPrefix}
          />
        );
      });
    };
    if (orderEmpty()) {
      return noOrders();
    }
    return (
      <table className={`${classPrefix}-table`}>
        <thead>
          <tr className={`${classPrefix}-table-title`}>
            <th>Token Pair</th>
            <th>Type</th>
            <th>Lever</th>
            <th>Initial Margin</th>
            <th>Open Price</th>
            <th>
              <LightTooltip
                placement="top"
                title={
                  <div>
                    <p>
                      The net asset value, if this value is lower than
                      liquidation amount, the position will be liquidated.
                      Liquidation ratio = 0.2% Liquidation amount = margin *
                      leverage * (current price/initial price)*Liquidation ratio
                    </p>
                  </div>
                }
                arrow
              >
                <span>Actual Margin</span>
              </LightTooltip>
            </th>
            <th>Operate</th>
          </tr>
        </thead>
        <tbody>
          {orderListView()}
          {oldOrderListView()}
        </tbody>
      </table>
    );
  };
  const listView2 = () => {
    const limitOrderListView = () => {
      return limitOrderList.map((item) => {
        return (
          <FuturesList2
            key={`f2+${item.index}`}
            item={item}
            className={classPrefix}
          />
        );
      });
    };
    if (limitEmpty()) {
      return noOrders();
    }
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
        <tbody>{limitOrderListView()}</tbody>
      </table>
    );
  };
  return !isPC ? (
    <FuturesMobile />
  ) : (
    <Stack spacing={0} alignItems="center" className={`${classPrefix}`}>
      <Popup
        open={showNotice}
        modal
        ref={modal}
        onClose={() => setShowNotice(false)}
      >
        <PerpetualsNoticeModal onClose={() => setShowNotice(false)} />
      </Popup>
      <Popup
        open={showTriggerRisk}
        modal
        ref={modal}
        onClose={() => setShowTriggerRisk(false)}
      >
        <TriggerRiskModal
          onClose={() => setShowTriggerRisk(false)}
          action={baseAction}
        />
      </Popup>
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
