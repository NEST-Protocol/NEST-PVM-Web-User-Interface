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
  hideOrder: (index: BigNumber) => void;
  kValue?: { [key: string]: TokenType };
};
export type FuturesList2Props = {
  item: LimitOrderView;
  key: string;
  className: string;
};
export type FuturesOldListProps = {
  item: OldOrderView;
  key: string;
  className: string;
  kValue?: { [key: string]: TokenType };
};

const FuturesList: FC<FuturesListProps> = ({ ...props }) => {
  const modalAdd = useRef<any>();
  const modalTrigger = useRef<any>();
  const modalClose= useRef<any>();
  const {
    TokenOneSvg,
    TokenTwoSvg,
    showBalance,
    showBasePrice,
    showMarginAssets,
    showTriggerTitle,
  } = useFuturesOrderList(props.item, props.kValue);

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
            ref={modalAdd}
            trigger={<button className="fort-button">Add</button>}
            nested
          >
            <FuturesAdd order={props.item} onClose={() => modalAdd.current.close()}/>
          </Popup>
          <Popup
            modal
            ref={modalTrigger}
            trigger={
              <button className="fort-button">{showTriggerTitle()}</button>
            }
            nested
          >
            <Trigger order={props.item}  onClose={() => modalTrigger.current.close()}/>
          </Popup>
          <Popup
            modal
            ref={modalClose}
            trigger={<button className="fort-button">Close</button>}
            nested
          >
            <FuturesClose order={props.item} kValue={props.kValue}  onClose={() => modalClose.current.close()}/>
          </Popup>
        </td>
      )}
    </tr>
  );
};

export default FuturesList;

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
      <td className="button">
        <Popup
          modal
          ref={modalLimit}
          trigger={<button className="fort-button">Edit</button>}
          nested
        >
          <LimitPrice order={props.item} onClose={() => modalLimit.current.close()}/>
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
          className={"listCloseButton"}
        >
          Close
        </MainButton>
      </td>
    </tr>
  );
};
