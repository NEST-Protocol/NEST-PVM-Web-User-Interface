import { Stack } from "@mui/material";
import { BigNumber } from "ethers/lib/ethers";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import { LongIcon, ShortIcon, XIcon } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import { TokenType } from "../../../libs/constants/addresses";
import {
  Futures3OrderView,
  OldOrderView,
  OrderView,
  useFutures3OrderList,
  useFuturesLimitOrderList,
  useFuturesOldOrderList,
  useFuturesOrderList,
} from "../../../libs/hooks/useFutures";
import ShareMyOrderModal from "../../Dashboard/ShareMyOrderModal";
import FuturesAdd from "../Add";
import FuturesClose from "../Close";
import LimitPrice from "../LimitPrice";
import Trigger from "../Trigger";

export type FuturesList3Props = {
  item: Futures3OrderView;
  key: string;
  className: string;
  hideOrder: (index: BigNumber) => void;
  kValue?: { [key: string]: TokenType };
};

export type FuturesListProps = {
  item: OrderView;
  key: string;
  className: string;
  hideOrder: (index: BigNumber) => void;
  kValue?: { [key: string]: TokenType };
};
export type FuturesList2Props = {
  item: Futures3OrderView;
  key: string;
  className: string;
};
export type FuturesOldListProps = {
  item: OldOrderView;
  key: string;
  className: string;
  kValue?: { [key: string]: TokenType };
};

const FuturesList3: FC<FuturesList3Props> = ({ ...props }) => {
  const modalAdd = useRef<any>();
  const modalTrigger = useRef<any>();
  const modalClose = useRef<any>();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBasePrice,
    showMarginAssets,
    showTriggerTitle,
    showPercent,
    showLiqPrice,
    showStopPrice,
    shareOrderData,
  } = useFutures3OrderList(props.item, props.kValue);

  const endButton = () => {
    //  TODO
    // const text =
    //   props.item.baseBlock.toString() === "0"
    //     ? "Liquidated"
    //     : "Trigger executed";
    const text = "Liquidated";
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
    <tr className={`${props.className}-table-normal`}>
      <td className={"position"}>
        <Stack spacing={1} alignItems="center">
          <Stack direction={"row"} spacing={0} alignItems="center">
            <TokenOneSvg />
            <TokenTwoSvg />
          </Stack>
          <Stack direction={"row"} spacing={1} alignItems="center">
            <p>{props.item.lever.toString()}X</p>
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </Stack>
        </Stack>
      </td>
      <td>
        <Stack spacing={1} alignItems="center">
          <p>{showMarginAssets()} NEST</p>
          <p style={{ color: showPercent() >= 0 ? "#80C269" : "#FF0000" }}>
            {showPercent().toFixed(2)}%
          </p>
        </Stack>
      </td>
      <td>{showBasePrice()} USDT</td>
      <td>{showLiqPrice()} USDT</td>
      <td>
        <Stack spacing={1} alignItems="center">
          {showStopPrice().map((item, index) => {
            return <p key={`stopOrder+${index}`}>{item}</p>;
          })}
        </Stack>
      </td>
      {isEnd() ? (
        <td className="button">{endButton()}</td>
      ) : (
        <td className="button">
          <Popup
            modal
            ref={modalAdd}
            trigger={<button className="fort-button">Add</button>}
            nested
          >
            <FuturesAdd
              order={props.item}
              onClose={() => modalAdd.current.close()}
            />
          </Popup>
          <Popup
            modal
            ref={modalTrigger}
            trigger={
              <button className="fort-button">{showTriggerTitle()}</button>
            }
            nested
          >
            <Trigger
              order={props.item}
              onClose={() => modalTrigger.current.close()}
            />
          </Popup>
          <Popup
            modal
            ref={modalClose}
            trigger={<button className="fort-button">Close</button>}
            nested
          >
            <FuturesClose
              order={props.item}
              kValue={props.kValue}
              onClose={() => modalClose.current.close()}
            />
          </Popup>
          <Popup
            modal
            ref={modalClose}
            trigger={
              <button>
                <ShareMyOrderModal order={shareOrderData()} />
              </button>
            }
            nested
          >
            {/* <FuturesClose
              order={props.item}
              kValue={props.kValue}
              onClose={() => modalClose.current.close()}
            /> */}
          </Popup>
        </td>
      )}
    </tr>
  );
};

export const FuturesList: FC<FuturesListProps> = ({ ...props }) => {
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
    <tr className={`${props.className}-table-normal`}>
      <td className={"position"}>
        <Stack spacing={1} alignItems="center">
          <Stack direction={"row"} spacing={0} alignItems="center">
            <TokenOneSvg />
            <TokenTwoSvg />
          </Stack>
          <Stack direction={"row"} spacing={1} alignItems="center">
            <p>{props.item.lever.toString()}X</p>
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </Stack>
        </Stack>
      </td>
      <td>
        <Stack spacing={1} alignItems="center">
          <p>{showMarginAssets()} NEST</p>
          <p style={{ color: showPercent() >= 0 ? "#80C269" : "#FF0000" }}>
            {showPercent().toFixed(2)}%
          </p>
        </Stack>
      </td>
      <td>{showBasePrice()} USDT</td>
      <td>{showLiqPrice()} USDT</td>
      <td>
        <Stack spacing={1} alignItems="center">
          {showStopPrice().map((item, index) => {
            return <p key={`stopOrder+${index}`}>{item}</p>;
          })}
        </Stack>
      </td>
      <td className="button">
        <MainButton
          className="fort-button"
          disable={buttonDis()}
          loading={buttonLoading()}
          onClick={buttonAction}
        >
          Close
        </MainButton>
      </td>
    </tr>
  );
};

export default FuturesList3;

export const FuturesList2: FC<FuturesList2Props> = ({ ...props }) => {
  const modalLimit = useRef<any>();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showLimitPrice,
    closeButtonLoading,
    closeButtonDis,
    closeButtonAction,
  } = useFuturesLimitOrderList(props.item);

  return (
    <tr className={`${props.className}-table-order`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={"td-type"}>
        {props.item.orientation ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation ? "red" : "green"}>
          {props.item.orientation ? "Long" : "Short"}
        </p>
      </td>
      <td>{props.item.lever.toString()}X</td>
      <td>{showBalance()} NEST</td>
      <td>{showLimitPrice()} USDT</td>
      <td className="button">
        <Popup
          modal
          ref={modalLimit}
          trigger={<button className="fort-button">Edit</button>}
          nested
        >
          <LimitPrice
            order={props.item}
            onClose={() => modalLimit.current.close()}
          />
        </Popup>

        <MainButton
          disable={closeButtonDis()}
          loading={closeButtonLoading()}
          onClick={closeButtonAction}
          className={"listCloseButton"}
        >
          Close
        </MainButton>
      </td>
    </tr>
  );
};

export const FuturesListOld: FC<FuturesOldListProps> = ({ ...props }) => {
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBasePrice,
    showMarginAssets,
    closeButtonLoading,
    closeButtonDis,
    closeButtonAction,
    showPercent,
    showLiqPrice,
  } = useFuturesOldOrderList(props.item, props.kValue);

  return (
    <tr className={`${props.className}-table-normal`}>
      <td className={"position"}>
        <Stack spacing={1} alignItems="center">
          <Stack direction={"row"} spacing={0} alignItems="center">
            <TokenOneSvg />
            <TokenTwoSvg />
          </Stack>
          <Stack direction={"row"} spacing={1} alignItems="center">
            <p>{props.item.lever.toString()}X</p>
            {props.item.orientation ? <LongIcon /> : <ShortIcon />}
            <p className={props.item.orientation ? "red" : "green"}>
              {props.item.orientation ? "Long" : "Short"}
            </p>
          </Stack>
        </Stack>
      </td>
      <td>
        <Stack spacing={1} alignItems="center">
          <p>{showMarginAssets()} NEST</p>
          <p style={{ color: showPercent() >= 0 ? "#80C269" : "#FF0000" }}>
            {showPercent().toFixed(2)}%
          </p>
        </Stack>
      </td>
      <td>{showBasePrice()} USDT</td>
      <td>{showLiqPrice()} USDT</td>
      <td>not set</td>
      <td className="button">
        <MainButton
          disable={closeButtonDis()}
          loading={closeButtonLoading()}
          onClick={closeButtonAction}
          className={"listCloseButton"}
        >
          Close
        </MainButton>
      </td>
    </tr>
  );
};
