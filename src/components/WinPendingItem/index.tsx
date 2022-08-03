import { BigNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { usePVMWinClaim } from "../../contracts/hooks/usePVMWinTransation";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import MainButton from "../MainButton";
import PendingClock from "./PendingClock";
import "./styles";

type WinPendingItemType = {
  nowBlock: number;
  gained: BigNumber;
  openBlock: BigNumber;
  index: BigNumber;
};

export const WinPendingItem: FC<WinPendingItemType> = ({ ...props }) => {
  const classPrefix = "winPendingItem";
  const { pendingList } = useTransactionListCon();
  const [countNum, setCountNum] = useState<number>(0);
  const [nowBlock, setNowBlock] = useState<number>(0);
  const [leftTimeClock, setLeftTimeClock] = useState<number>(0);

  const claim = usePVMWinClaim(props.index);
  const allTime = 256 * 3;
  const loadingButton = () => {
    const claimTx = pendingList.filter(
      (item) =>
        item.info === props.index.toString() &&
        item.type === TransactionType.winClaim
    );
    return claimTx.length > 0 ? true : false;
  };

  setTimeout(() => {
    if (props.nowBlock !== nowBlock) {
      setCountNum(0);
      setNowBlock(props.nowBlock);
    } else {
      setCountNum(countNum + 1);
    }
  }, 1000);

  useEffect(() => {
    var leftTime =
      allTime -
      BigNumber.from(props.nowBlock).sub(props.openBlock).toNumber() * 3;

    const thisLeftTime = leftTime - countNum;
    if (thisLeftTime <= 0) {
      setLeftTimeClock(0);
      return;
    }
    setLeftTimeClock(thisLeftTime);
  }, [allTime, countNum, nowBlock, props.nowBlock, props.openBlock]);

  const buttonState = () => {
    if (BigNumber.from("0").eq(props.gained) || loadingButton()) {
      return true;
    }
    return false;
  };

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-left`}>
        <MainButton
          onClick={() => {
            if (buttonState()) {
              return;
            }
            
            claim();
          }}
          disable={buttonState()}
          loading={loadingButton()}
        >
          Claim
        </MainButton>
      </div>
      <div className={`${classPrefix}-right`}>
        <span>
          <PendingClock
            leftTime={leftTimeClock}
            allTime={allTime}
            index={props.index.toNumber()}
          />
        </span>
      </div>
    </div>
  );
};
