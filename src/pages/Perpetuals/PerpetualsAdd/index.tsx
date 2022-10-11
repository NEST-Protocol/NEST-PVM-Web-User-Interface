import message from "antd/lib/message";
import classNames from "classnames";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import { LeverListType } from "..";
import InfoShow from "../../../components/InfoShow";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { SingleTokenShow } from "../../../components/TokenShow";
import { usePVMLeverBuy } from "../../../contracts/hooks/usePVMLeverTransaction";
import { tokenList, TokenType } from "../../../libs/constants/addresses";
import { ERC20Contract } from "../../../libs/hooks/useContract";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import useTransactionListCon, {
  TransactionType,
} from "../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  BASE_AMOUNT,
  bigNumberToNormal,
  BLOCK_TIME,
  formatInputNum,
  normalToBigNumber,
  ZERO_ADDRESS,
} from "../../../libs/utils";
import "./styles";

type PerpetualsAddType = {
  item: LeverListType;
  kValue?: { [key: string]: TokenType };
};

const PerpetualsAdd: FC<PerpetualsAddType> = ({ ...props }) => {
  const className = "PerpetualsAdd";
  const { account, chainId, library } = useWeb3();
  const { pendingList } = useTransactionListCon();
  const [nowBlock, setNowBlock] = useState<number>();
  const [nestInput, setNestInput] = useState<string>("");
  const [nestBalance, setNestBalance] = useState<BigNumber>();
  const nestToken = ERC20Contract(tokenList["NEST"].addresses);
  const { theme } = useThemes();
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
  const tokenName = useCallback(() => {
    if (props.item.tokenAddress === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [props.item.tokenAddress]);
  const kPrice = useCallback(() => {
    if (!props.kValue) {
      return BigNumber.from("0");
    }
    var price: BigNumber;
    const inputNum = normalToBigNumber(nestInput);
    const tokenKValue = props.kValue[tokenName()];
    if (!tokenKValue || !tokenKValue.nowPrice || !tokenKValue.k) {
      return BigNumber.from("0");
    }
    if (props.item.orientation) {
      price = tokenKValue.nowPrice
        .mul(
          BASE_AMOUNT.add(tokenKValue.k).add(
            inputNum.div(BigNumber.from("10000000"))
          )
        )
        .div(BASE_AMOUNT);
    } else {
      price = tokenKValue.nowPrice
        .mul(BASE_AMOUNT)
        .div(
          BASE_AMOUNT.add(tokenKValue.k).add(
            inputNum.div(BigNumber.from("10000000"))
          )
        );
    }
    return price;
  }, [nestInput, props.item.orientation, props.kValue, tokenName]);

  const newBalance = props.item.balance.add(
    parseUnits(nestInput === "" ? "0" : nestInput, 18)
  );

  useEffect(() => {
    (async () => {
      const latestBlock = await library?.getBlockNumber();
      setNowBlock(latestBlock);
    })();
  }, [library]);

  const newBasePrice = useCallback(() => {
    if (
      !chainId ||
      !nowBlock ||
      nestInput === "" ||
      kPrice().eq(BigNumber.from("0"))
    ) {
      return props.item.basePrice;
    }
    const expMiuT = (miu: BigNumber, chainId: number) => {
      return miu
        .mul(nowBlock - props.item.baseBlock.toNumber())
        .mul(BLOCK_TIME[chainId] / 1000)
        .div(1000)
        .add(BigNumber.from("18446744073709552000"));
    };
    const top = newBalance.mul(kPrice()).mul(props.item.basePrice);
    const bottom = props.item.basePrice.mul(parseUnits(nestInput, 18)).add(
      kPrice()
        .mul(props.item.balance.mul(BigNumber.from("2").pow(64)))
        .div(
          expMiuT(
            props.item.orientation
              ? BigNumber.from("64051194700")
              : BigNumber.from("0"),
            chainId
          )
        )
    );
    return top.div(bottom);
  },[chainId, kPrice, nestInput, newBalance, nowBlock, props.item.balance, props.item.baseBlock, props.item.basePrice, props.item.orientation]);

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
    <MainCard classNames={classNames({
      [`${className}`]: true,
      [`${className}-dark`]: theme === ThemeType.dark,
    })}>
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
          <p>{`${props.item.lever.toString()}X ${
            props.item.orientation ? "long" : "short"
          }`}</p>
        </div>
        <div className={`${className}-info-two`}>
          <p className="title">Open Price:</p>
          <p>{`${Number(formatUnits(newBasePrice(), 18)).toFixed(2)} USDT`}</p>
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
          if (normalToBigNumber(nestInput).lt(normalToBigNumber("50"))) {
            message.error(`Minimum input 50`);
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
