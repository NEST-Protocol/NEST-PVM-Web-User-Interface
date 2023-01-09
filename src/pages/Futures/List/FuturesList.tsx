import { BigNumber } from "ethers/lib/ethers";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import { LongIcon, ShortIcon, XIcon } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import { TokenType } from "../../../libs/constants/addresses";
import {
  LimitOrderView,
  OldOrderView,
  OrderView,
  useFuturesLimitOrderList,
  useFuturesOldOrderList,
  useFuturesOrderList,
} from "../../../libs/hooks/useFutures";
import FuturesAdd from "../Add";
import FuturesClose from "../Close";
import LimitPrice from "../LimitPrice";
import Trigger from "../Trigger";

export type FuturesListProps = {
  item: OrderView;
  key: string;
  className: string;
  hideOrder: (isPosition: boolean, index: BigNumber) => void;
  kValue?: { [key: string]: TokenType };
};
export type FuturesList2Props = {
  item: LimitOrderView;
  key: string;
  className: string;
  hideOrder: (isPosition: boolean, index: BigNumber) => void;
};
export type FuturesOldListProps = {
  item: OldOrderView;
  key: string;
  className: string;
  kValue?: { [key: string]: TokenType };
};

const FuturesList: FC<FuturesListProps> = ({ ...props }) => {
  const modal = useRef<any>();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showBasePrice,
    showMarginAssets,
    showTriggerTitle,
  } = useFuturesOrderList(props.item, props.kValue);

  const endButton = () => {
    return (
      <button className="endOrder" onClick={() => props.hideOrder(true, props.item.index)}>
        <p>Liquidated</p>
        <XIcon />
      </button>
    );
  };

  const isEnd = () => {
    return props.item.baseBlock.toString() === "0" ? true : false;
  };

  return (
    <tr className={`${props.className}-table-normal`}>
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
      <td>{showBasePrice()} USDT</td>
      <td>{showMarginAssets()} NEST</td>
      {isEnd() ? (
        <td className="button">{endButton()}</td>
      ) : (
        <td className="button">
          <Popup
            modal
            ref={modal}
            trigger={<button className="fort-button">Add</button>}
            nested
          >
            <FuturesAdd order={props.item} />
          </Popup>
          <Popup
            modal
            ref={modal}
            trigger={
              <button className="fort-button">{showTriggerTitle()}</button>
            }
            nested
          >
            <Trigger order={props.item} />
          </Popup>
          <Popup
            modal
            ref={modal}
            trigger={<button className="fort-button">Close</button>}
            nested
          >
            <FuturesClose order={props.item} kValue={props.kValue} />
          </Popup>
        </td>
      )}
    </tr>
  );
};

export default FuturesList;

export const FuturesList2: FC<FuturesList2Props> = ({ ...props }) => {
  const modal = useRef<any>();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showLimitPrice,
    closeButtonLoading,
    closeButtonDis,
    closeButtonAction,
  } = useFuturesLimitOrderList(props.item);

  const endButton = () => {
    return (
      <button className="endOrder" onClick={() => props.hideOrder(false, props.item.index)}>
        <p>Implemented take profit</p>
        <XIcon />
      </button>
    );
  };

  const isEnd = () => {
    return props.item.status.toString() === "0" ? true : false;
  };

  return (
    <tr className={`${props.className}-table-normal`}>
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
      {isEnd() ? (
        <td className="button">{endButton()}</td>
      ) : (
        <td className="button">
          <Popup
            modal
            ref={modal}
            trigger={<button className="fort-button">Edit</button>}
            nested
          >
            <LimitPrice order={props.item} />
          </Popup>

          <MainButton
            disable={closeButtonDis()}
            loading={closeButtonLoading()}
            onClick={closeButtonAction}
          >
            Close
          </MainButton>
        </td>
      )}
    </tr>
  );
};

export const FuturesListOld: FC<FuturesOldListProps> = ({ ...props }) => {
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
    <tr className={`${props.className}-table-normal`}>
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
      <td>{showBasePrice()} USDT</td>
      <td>{showMarginAssets()} NEST</td>
      <td className="button">
        <MainButton
          disable={closeButtonDis()}
          loading={closeButtonLoading()}
          onClick={closeButtonAction}
        >
          Close
        </MainButton>
      </td>
    </tr>
  );
};
