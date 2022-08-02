import classNames from "classnames";
import { BigNumber } from "ethers";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import { Chance, TokenNest, XIcon } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { usePVMWinClaim } from "../../../contracts/hooks/usePVMWinTransation";
import { useEtherscanBaseUrl } from "../../../libs/hooks/useEtherscanBaseUrl";
import useTransactionListCon, {
  TransactionType,
} from "../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { BLOCK_TIME, showEllipsisAddress } from "../../../libs/utils";
import { WinV2BetData } from "../RightCard";
import "./styles";

type Props = {
  onClose: () => void;
  item: WinV2BetData;
};

const WinV2Modal: FC<Props> = ({ ...props }) => {
  const classPrefix = "WinV2Modal";
  const { chainId, library } = useWeb3();
  const { pendingList } = useTransactionListCon();
  const [latestBlock, setLatestBlock] = useState<number>();
  const result = Number(props.item.profit) > 0 ? true : false;
  const hashBaseUrl = useEtherscanBaseUrl();
  const [timeString, setTimeString] = useState<string>();
  const claim = usePVMWinClaim(BigNumber.from(props.item.index));
  const loadingButton = () => {
    const claimTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.winClaim
    );
    return claimTx.length > 0 ? true : false;
  };
  const buttonState = () => {
    if (props.item.claim === "true" || loadingButton()) {
      return true;
    }
    return false;
  };
  const showInfo = (title: string, text: string) => {
    return (
      <div className={`${classPrefix}-card-mid-showInfo`}>
        <p>{title}</p>
        <div className={`${classPrefix}-card-mid-showInfo-bg`}>
          <p>{text}</p>
        </div>
      </div>
    );
  };
  const showInfo_nest = (title: string, text: string) => {
    return (
      <div className={`${classPrefix}-card-mid-showInfo`}>
        <p>{title}</p>
        <div className={`${classPrefix}-card-mid-showInfo-bg`}>
          <TokenNest />
          <p className={`${classPrefix}-card-mid-showInfo-bg-nest`}>{text}</p>
        </div>
      </div>
    );
  };
  const showButton = useCallback(() => {
    if (!result) {
      return false;
    }
    const claimBool = props.item.claim === "true" ? true : false;
    if (!claimBool && Number(props.item.openBlock) + 256 > (latestBlock ?? 0)) {
      return true;
    } else {
      return false;
    }
  }, [latestBlock, props.item.claim, props.item.openBlock, result]);
  const url = hashBaseUrl + props.item.hash;
  // get latest block
  useEffect(() => {
    const getBlock = async () => {
      const latest = await library?.getBlockNumber();
      setLatestBlock(latest ?? 0);
    };
    getBlock();
    const time = setInterval(() => {
      getBlock();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [library]);
  // set time string
  useEffect(() => {
    if (showButton()) {
      const setTime = () => {
        const leftTime =
          Number(props.item.openBlock) + 256 - (latestBlock ?? 0) > 0
            ? ((Number(props.item.openBlock) + 256 - (latestBlock ?? 0)) *
                BLOCK_TIME[chainId ?? 56]) /
              1000
            : 0;
        const min = (leftTime / 60).toFixed(0);
        const second = (leftTime - Number(min) * 60).toString();
        setTimeString(`${min}:${second}`);
      };
      const time = setInterval(() => {
        setTime();
      }, 1000);
      return () => {
        clearTimeout(time);
      };
    }
  }, [chainId, latestBlock, props.item.openBlock, showButton]);

  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <div className={`${classPrefix}-card-top`}>
          <p className={`${classPrefix}-card-top-time`}>
            {moment(Number(props.item.time) * 1000).format(
              "YYYY[-]MM[-]DD HH:mm:ss"
            )}
          </p>
          <p
            className={classNames({
              [`${classPrefix}-card-top-result`]: true,
              [`result`]: result,
            })}
          >
            {result ? "WIN" : "LOSE"}
          </p>
          <div className={`${classPrefix}-card-top-random`}>
            <p
              className={classNames({
                [`${classPrefix}-card-top-random-num`]: true,
                [`result`]: result,
              })}
            >
              {props.item.multiplier} X
            </p>
            <Chance />
          </div>
        </div>
        <div className={`${classPrefix}-card-mid`}>
          {showInfo_nest("BET", props.item.bet)}
          {showInfo("WIN CHANCE", props.item.chance + "%")}
          {showInfo("PROFIT", props.item.profit)}
        </div>
        <p className={`${classPrefix}-card-hash`}>
          hash:{" "}
          {props.item.hash === undefined ? (
            "---"
          ) : (
            <a href={url}>{showEllipsisAddress(props.item.hash)}</a>
          )}
        </p>
        {showButton() ? (
          <MainButton
            onClick={() => {
              if (buttonState() || loadingButton()) {
                return;
              }
              claim();
              props.onClose();
            }}
            disable={buttonState()}
            loading={loadingButton()}
          >
            Claim (remaining time <span>{timeString}</span>)
          </MainButton>
        ) : (
          <></>
        )}
      </MainCard>
      <button className={`${classPrefix}-X`} onClick={props.onClose}>
        <XIcon />
      </button>
    </div>
  );
};

export default WinV2Modal;
