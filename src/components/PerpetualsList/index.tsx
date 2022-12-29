import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { usePVMLeverSell } from "../../contracts/hooks/usePVMLeverTransaction";
import {
  PVMLeverContract,
  tokenList,
  TokenType,
} from "../../libs/constants/addresses";
import { PVMLever } from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { BASE_AMOUNT, bigNumberToNormal, ZERO_ADDRESS } from "../../libs/utils";
import { LeverListType } from "../../pages/Perpetuals";
import PerpetualsAdd from "../../pages/Futures/PerpetualsAdd";
import { LongIcon, ShortIcon } from "../Icon";
import MainButton from "../MainButton";
import Trigger from "../../pages/Futures/Trigger";
import LimitPrice from "../../pages/Futures/LimitPrice";

type Props = {
  item: LeverListType;
  key: string;
  className: string;
  kValue?: { [key: string]: TokenType };
};

const PerpetualsList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const { account } = useWeb3();
  const modal = useRef<any>();
  const leverContract = PVMLever(PVMLeverContract);
  const [marginAssets, setMarginAssets] = useState<BigNumber>();
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.closeLever
    );
    return closeTx.length > 0 ? true : false;
  };
  const tokenName = useCallback(() => {
    if (props.item.tokenAddress === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [props.item.tokenAddress]);
  const TokenOneSvg = tokenList[tokenName()].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
  const active = usePVMLeverSell(props.item.index, props.item.balance);
  useEffect(() => {
    if (!leverContract || !account) {
      return;
    }
    (async () => {
      if (!props.kValue) {
        return;
      }
      const tokenKValue = props.kValue[tokenName()];
      if (!tokenKValue.nowPrice || !tokenKValue.k) {
        return;
      }

      var price: BigNumber;
      if (!props.item.orientation) {
        price = tokenKValue.nowPrice
          .mul(BASE_AMOUNT.add(tokenKValue.k))
          .div(BASE_AMOUNT);
      } else {
        price = tokenKValue.nowPrice
          .mul(BASE_AMOUNT)
          .div(BASE_AMOUNT.add(tokenKValue.k));
      }
      const num: BigNumber = await leverContract.balanceOf(
        props.item.index,
        price,
        account
      );
      setMarginAssets(num);
    })();
  }, [
    account,
    leverContract,
    props.item.index,
    props.item.orientation,
    props.kValue,
    tokenName,
  ]);
  const marginAssetsStr = marginAssets
    ? bigNumberToNormal(marginAssets, 18, 2)
    : "---";
  return (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={"td-type"}>
        {props.item.orientation ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation ? "red" : "green"}>
          {props.item.orientation ? t`Long` : t`Short`}
        </p>
      </td>
      <td>{props.item.lever.toString()}X</td>
      <td>
        {bigNumberToNormal(props.item.balance, 18, 2)} NEST
      </td>
      <td>
        {bigNumberToNormal(props.item.basePrice, tokenList["USDT"].decimals, 2)} USDT
      </td>
      <td>
        {`${marginAssetsStr}`} NEST
      </td>
      <td className="button">
        <Popup modal ref={modal} trigger={<button className="fort-button">Add</button>}>
          <PerpetualsAdd item={props.item} kValue={props.kValue} />
        </Popup>
        <Popup modal ref={modal} trigger={<button className="fort-button">Edit</button>}>
          <Trigger />
        </Popup>
        <MainButton
          onClick={() => {
            return loadingButton() ? null : active();
          }}
          loading={loadingButton()}
          disable={loadingButton()}
        >
          <Trans>Close</Trans>
        </MainButton>
      </td>
    </tr>
  );
};

export default PerpetualsList;

export const PerpetualsList2: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const modal = useRef<any>();
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.closeLever
    );
    return closeTx.length > 0 ? true : false;
  };
  const tokenName = useCallback(() => {
    if (props.item.tokenAddress === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [props.item.tokenAddress]);
  const TokenOneSvg = tokenList[tokenName()].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
  const active = usePVMLeverSell(props.item.index, props.item.balance);
  return (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={"td-type"}>
        {props.item.orientation ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation ? "red" : "green"}>
          {props.item.orientation ? t`Long` : t`Short`}
        </p>
      </td>
      <td>{props.item.lever.toString()}X</td>
      <td>
        {bigNumberToNormal(props.item.balance, 18, 2)} NEST
      </td>
      <td>
        {bigNumberToNormal(props.item.basePrice, tokenList["USDT"].decimals, 2)} USDT
      </td>
      <td className="button">
        <Popup modal ref={modal} trigger={<button className="fort-button">Edit</button>}>
          <LimitPrice/>
        </Popup>

        <MainButton
          onClick={() => {
            return loadingButton() ? null : active();
          }}
          loading={loadingButton()}
          disable={loadingButton()}
        >
          <Trans>Close</Trans>
        </MainButton>
      </td>
    </tr>
  );
};
