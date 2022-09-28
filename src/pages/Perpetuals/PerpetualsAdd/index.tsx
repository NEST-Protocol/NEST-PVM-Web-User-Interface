import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import { LeverListType } from "..";
import InfoShow from "../../../components/InfoShow";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { SingleTokenShow } from "../../../components/TokenShow";
import { usePVMLeverBuy } from "../../../contracts/hooks/usePVMLeverTransaction";
import { tokenList } from "../../../libs/constants/addresses";
import { ERC20Contract } from "../../../libs/hooks/useContract";
import useLiquidationPrice from "../../../libs/hooks/useLiquidationPrice";
import useTransactionListCon, { TransactionType } from "../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
  ZERO_ADDRESS,
} from "../../../libs/utils";
import "./styles";

type PerpetualsAddType = {
item: LeverListType;
}

const PerpetualsAdd: FC<PerpetualsAddType> = ({...props}) => {
  const className = "PerpetualsAdd";
  const { account, chainId, library } = useWeb3();
  const { pendingList, txList } = useTransactionListCon();
  const [nestInput, setNestInput] = useState<string>("");
  const [nestBalance, setNestBalance] = useState<BigNumber>();
  const nestToken = ERC20Contract(tokenList["NEST"].addresses);
  const checkNESTBalance = normalToBigNumber(nestInput).gt(
    nestBalance || BigNumber.from("0")
  );
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.buyLever
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const checkMainButton = () => {
    if (
      nestInput === "" ||
      normalToBigNumber(nestInput).eq(BigNumber.from("0")) ||
      checkNESTBalance ||
      mainButtonState()
    ) {
      return false;
    }
    return true;
  };
//   const getLiquidationPrice = useLiquidationPrice(parseUnits(nestInput === "" ? "0" : nestInput, "ether"),
//   BigNumber.from(props.item.lever.toString()),
//   props.item.orientation,
//   parseUnits(kPrice() === "---" ? "0" : kPrice(), "ether"),chainId)
  const tokenName = useCallback(() => {
    if (props.item.tokenAddress === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [props.item.tokenAddress]);
  const active = usePVMLeverBuy(
    tokenList[tokenName()],
    props.item.lever.toNumber(),
    props.item.orientation,
    normalToBigNumber(nestInput)
  );
  // balance
  useEffect(() => {
    if (!nestToken) {
      return;
    }
    (async () => {
      const balance = await nestToken.balanceOf(account);
      setNestBalance(balance);
    })();
  }, [nestToken, account]);
  return (
    <MainCard classNames={className}>
      <div className={`${className}-title`}>Add Position</div>
      <InfoShow
        topLeftText={`Payment`}
        bottomRightText={""}
        // balanceRed={checkNESTBalance}
        topRightText={`Balance: ${
          nestBalance ? bigNumberToNormal(nestBalance, 18, 6) : "----"
        } NEST`}
        topRightRed={checkNESTBalance}
      >
        <SingleTokenShow tokenNameOne={"NEST"} isBold />
        <input
          placeholder={`Input`}
          className={"input-middle"}
          value={nestInput}
          maxLength={32}
          onChange={(e) => setNestInput(formatInputNum(e.target.value))}
          onBlur={(e: any) => {}}
        />
        <button
          className={"max-button"}
          onClick={() =>
            setNestInput(
              bigNumberToNormal(nestBalance || BigNumber.from("0"), 18, 18)
            )
          }
        >
          MAX
        </button>
      </InfoShow>
      <div className={`${className}-info`}>
        <div className={`${className}-info-one`}>
          <p className="title">Position:</p>
          <p>{`${props.item.lever.toString()}X ${props.item.orientation ? 'long' : 'short'}`}</p>
        </div>
        <div className={`${className}-info-two`}>
          <p className="title">Open Price:</p>
          <p>{`${Number(
                formatUnits(
                  props.item.basePrice,
                  18
                )
              ).toFixed(2)} USDT`}</p>
        </div>
        <div className={`${className}-info-three`}>
          <p className="title">Liquidation Price:</p>
          <p>{" USDT"}</p>
        </div>
        <div className={`${className}-info-four`}>
          <p className="title">Liquidation Rate:</p>
          <p>{"10 %"}</p>
        </div>
      </div>
      <div className={`${className}-des`}>
        The calculated result is for reference only. Please expect some
        deviation due to trading fees or changes in the funding rate. Read tips
        on how to use.
      </div>
      <MainButton
          className={`${className}-button`}
          onClick={() => {
            if (!checkMainButton()) {
              return;
            }
            active();
          }}
          disable={!checkMainButton()}
          loading={mainButtonState()}
        >
          Add
        </MainButton>
    </MainCard>
  );
};

export default PerpetualsAdd;
