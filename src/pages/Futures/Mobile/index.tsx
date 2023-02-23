import { FC, useMemo, useRef, useState } from "react";
import "./styles";
import Stack from "@mui/material/Stack";
import { tokenList } from "../../../libs/constants/addresses";
import { PutDownIcon } from "../../../components/Icon";
import LongAndShort from "../../../components/LongAndShort";
// import { LeverChoose } from "../../../components/LeverChoose";
import InfoShow from "../../../components/InfoShow";
import { SingleTokenShow } from "../../../components/TokenShow";
import { formatInputNum, formatInputNumWithFour } from "../../../libs/utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import OpenShow from "../../../components/OpenShow";
import classNames from "classnames";
import PositionsList3, {
  PositionsList,
  PositionsList2,
  PositionsOldList,
} from "./PositionsList";
import MainButton from "../../../components/MainButton";
import { Popover } from "@mui/material";
import TVChart from "../../../components/TVChart";
import { useFutures } from "../../../libs/hooks/useFutures";
import { LightTooltip } from "../../../styles/MUI";
import PerpetualsNoticeModal from "../PerpetualsNoticeModal";
import Popup from "reactjs-popup";
import TriggerRiskModal from "../TriggerRisk";
import { BigNumber } from "ethers";
import LeverSlider from "../../../components/LeverSlider";
import OpenPosition from "../OpenPosition";

const FuturesMobile: FC = () => {
  const classPrefix = "FuturesMobile";
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const modal = useRef<any>();
  const {
    // chainId,
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
    stopProfitPriceInput,
    setStopProfitPriceInput,
    stopLossPriceInput,
    setStopLossPriceInput,
    tokenPrice,
    tokenPair,
    checkNESTBalance,
    fee,
    showFee,
    mainButtonTitle,
    mainButtonDis,
    mainButtonAction,
    mainButtonLoading,
    plusOrder3List,
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
    showOpenPosition,
    setShowOpenPosition,
    showOpenPositionOrder
  } = useFutures();
  const BTCIcon = tokenList["BTC"].Icon;
  const ETHIcon = tokenList["ETH"].Icon;
  const BNBIcon = tokenList["BNB"].Icon;
  const USDTIcon = tokenList["USDT"].Icon;

  const handleLeverNum = (selected: number) => {
    setLeverNum(selected);
  };

  const noOrders = () => {
    return <p className="emptyOrder">No Orders</p>;
  };

  const tokenPairAndPrice = () => {
    const LeftIcon = tokenPrice.leftIcon;
    return (
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
          <PutDownIcon className="putDown" />
        </button>
        <p>
          1 {tokenPrice.tokenName} = {tokenPrice ? tokenPrice.price : "---"}{" "}
          USDT
        </p>
      </Stack>
    );
  };
  const close = useMemo(() => {
    if (kValue?.[tokenPair].nowPrice) {
      return (
        BigNumber.from(kValue?.[tokenPair].nowPrice)
          .div(BigNumber.from(10).pow(16))
          .toNumber() / 100
      );
    }
    return 0;
  }, [kValue, tokenPair]);
  const KPrice = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-KPrice`}
      >
        <TVChart chainId={56} tokenPair={tokenPair} close={close} />
      </Stack>
    );
  };
  const mainView = () => {
    // const leverList =
    //   chainId === 1
    //     ? [
    //         { text: "1X", value: 1 },
    //         { text: "2X", value: 2 },
    //         { text: "3X", value: 3 },
    //         { text: "4X", value: 4 },
    //         { text: "5X", value: 5 },
    //       ]
    //     : [
    //         { text: "1X", value: 1 },
    //         { text: "5X", value: 5 },
    //         { text: "10X", value: 10 },
    //         { text: "20X", value: 20 },
    //         { text: "25X", value: 25 },
    //         { text: "30X", value: 30 },
    //       ];
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
          <p className={`${classPrefix}-stopLimit1-title`}>Take Profit</p>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
            className={`rightInput`}
          >
            <input
              placeholder={`${tokenPrice.price}`}
              value={stopProfitPriceInput}
              maxLength={32}
              onChange={(e) =>
                setStopProfitPriceInput(formatInputNum(e.target.value))
              }
            />
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
            <input
              placeholder={`${tokenPrice.price}`}
              value={stopLossPriceInput}
              maxLength={32}
              onChange={(e) =>
                setStopLossPriceInput(formatInputNum(e.target.value))
              }
            />
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
        <Stack
          direction="row"
          justifyContent="space-between"
          className={`${classPrefix}-mainView-leverTitle`}
        >
          <p>Leverage</p>
          <p>{leverNum}</p>
        </Stack>
        <LeverSlider callBack={handleLeverNum} />
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
          justifyContent="space-between"
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
        {stop ? stopLimit2() : <></>}
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
            placement="top-start"
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

  const order3ListView = () => {
    return [...plusOrder3List].map((item, index) => {
      return (
        <li key={`f3+${index}`}>
          <PositionsList3
            key={"f3"}
            item={item}
            className={classPrefix}
            kValue={kValue}
            hideOrder={hideOrder}
          />
        </li>
      );
    });
  };

  const orderListView = () => {
    return [...orderList].map((item, index) => {
      return (
        <li key={`f+${index}`}>
          <PositionsList
            key={"f"}
            item={item}
            className={classPrefix}
            kValue={kValue}
            hideOrder={hideOrder}
          />
        </li>
      );
    });
  };

  const limitOrderListView = () => {
    return limitOrderList.map((item, index) => {
      return (
        <li key={`f2+${index}`}>
          <PositionsList2 key={"f2"} item={item} className={classPrefix} />
        </li>
      );
    });
  };

  const oldOrderListView = () => {
    return oldOrderList.map((item, index) => {
      return (
        <li key={`f2+${index}`}>
          <PositionsOldList
            key={`fOld+${item.index}`}
            item={item}
            className={classPrefix}
            kValue={kValue}
          />
        </li>
      );
    });
  };

  const listView = () => {
    if (isPositions) {
      if (orderEmpty()) {
        return noOrders();
      }
      return order3ListView();
    } else {
      if (limitEmpty()) {
        return noOrders();
      }
      return limitOrderListView();
    }
  };
  const oldListView = () => {
    if (isPositions) {
      return [...orderListView(), oldOrderListView()];
    }
    return <></>;
  };
  return (
    <Stack spacing={0} className={`${classPrefix}`}>
      <Popup
        open={showOpenPosition}
        modal
        ref={modal}
        onClose={() => setShowOpenPosition(false)}
        nested
      >
        <OpenPosition
          onClose={() => setShowOpenPosition(false)}
          order={showOpenPositionOrder!}
        />
      </Popup>
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
      {tokenPairAndPrice()}
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
          <li
            onClick={() => {
              setTokenPair("BNB");
              setAnchorEl(null);
            }}
          >
            <BNBIcon />
            <USDTIcon className="USDT" />
            <p>BNB/USDT</p>
          </li>
        </ul>
      </Popover>
      {KPrice()}
      {mainView()}
      {listTab()}
      <ul className="list">
        {listView()}
        {oldListView()}
      </ul>
    </Stack>
  );
};

export default FuturesMobile;
