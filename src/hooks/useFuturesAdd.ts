import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesV2Contract } from "../contracts/contractAddress";
import useReadTokenBalance, {
  useReadTokenAllowance,
} from "../contracts/Read/useReadTokenContract";
import useTokenApprove from "../contracts/useTokenContract";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import useNEST from "./useNEST";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { lipPrice } from "./useFuturesNewOrder";
import { useFuturesAdd as useFuturesAddTransaction } from "../contracts/useFuturesBuyV2";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesAdd(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const { account, chainsData } = useNEST();
  const [nestAmount, setNestAmount] = useState("");
  const { isPendingOrder, isPendingType } = usePendingTransactions();
  const [send, setSend] = useState(false);
  const NESTToken = useMemo(() => {
    const token = "NEST".getToken();
    if (chainsData.chainId && token) {
      return token.address[chainsData.chainId];
    }
  }, [chainsData.chainId]);
  /**
   * futures contract
   */
  const futureContract = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId];
    }
  }, [chainsData.chainId]);
  /**
   * allowance
   */
  const { allowance: nestAllowance } = useReadTokenAllowance(
    (NESTToken ?? String().zeroAddress) as `0x${string}`,
    account.address ?? "",
    futureContract
  );
  /**
   * balance
   */
  const { balance: nestBalance } = useReadTokenBalance(
    (NESTToken ?? String().zeroAddress) as `0x${string}`,
    account.address ?? ""
  );
  /**
   * check
   */
  const checkAllowance = useMemo(() => {
    if (nestAllowance) {
      const nestAmountNumber =
        nestAmount === ""
          ? BigNumber.from("0")
          : nestAmount.stringToBigNumber(18)!;
      return nestAmountNumber.lte(nestAllowance);
    } else {
      return true;
    }
  }, [nestAllowance, nestAmount]);
  const checkBalance = useMemo(() => {
    if (nestBalance) {
      const nestAmountNumber =
        nestAmount === ""
          ? BigNumber.from("0")
          : nestAmount.stringToBigNumber(18)!;
      return nestAmountNumber.lte(nestBalance);
    } else {
      return false;
    }
  }, [nestAmount, nestBalance]);
  /**
   * action
   */
  const inputAmountTransaction = useMemo(() => {
    const amount = nestAmount.stringToBigNumber(4);
    if (amount && checkAllowance && checkBalance) {
      return amount;
    } else {
      return undefined;
    }
  }, [checkAllowance, checkBalance, nestAmount]);
  const { transaction: tokenApprove } = useTokenApprove(
    (NESTToken ?? String().zeroAddress) as `0x${string}`,
    futureContract,
    MaxUint256
  );
  const { transaction: add } = useFuturesAddTransaction(
    data.index,
    inputAmountTransaction
  );

  const maxCallBack = useCallback(() => {
    if (nestBalance) {
      setNestAmount(nestBalance.bigNumberToShowString(18, 2));
    }
  }, [nestBalance]);
  /**
   * show
   */
  const showToSwap = useMemo(() => {
    if (account.address && nestBalance) {
      return BigNumber.from("0").eq(nestBalance) ? true : false;
    } else {
      return false;
    }
  }, [account.address, nestBalance]);
  const showBalance = useMemo(() => {
    if (account.address && nestBalance) {
      return nestBalance.bigNumberToShowString(18, 2);
    } else {
      return String().placeHolder;
    }
  }, [account.address, nestBalance]);
  const showPosition = useMemo(() => {
    const lever = data.lever.toString();
    const longOrShort = data.orientation ? "Long" : "Short";
    const balance = BigNumber.from(
      data.balance.toString()
    ).bigNumberToShowString(4, 2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.lever, data.orientation]);

  const showOpenPrice = useMemo(() => {
    return `${BigNumber.from(data.basePrice.toString()).bigNumberToShowString(
      18,
      2
    )} USDT`;
  }, [data.basePrice]);

  const showLiqPrice = useMemo(() => {
    const result = lipPrice(
      data.balance,
      nestAmount === ""
        ? BigNumber.from("0")
        : nestAmount.stringToBigNumber(4)!,
      data.lever,
      price
        ? price[priceToken[parseInt(data.channelIndex.toString())]]
        : data.basePrice,
      data.basePrice,
      data.orientation
    );
    return result.bigNumberToShowString(18, 2);
  }, [
    data.balance,
    data.basePrice,
    data.channelIndex,
    data.lever,
    data.orientation,
    nestAmount,
    price,
  ]);
  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_add,
      parseInt(data.index.toString())
    );
  }, [data.index, isPendingOrder]);
  const approvePending = useMemo(() => {
    return isPendingType(TransactionType.approve);
  }, [isPendingType]);
  useEffect(() => {
    if (send && !pending) {
      onClose();
    } else if (!send && pending) {
      setSend(true);
    }
  }, [onClose, pending, send]);
  const mainButtonTitle = useMemo(() => {
    if (!checkBalance) {
      return `Insufficient NEST balance`;
    } else if (checkAllowance) {
      return "Confirm";
    } else {
      return "Approve";
    }
  }, [checkAllowance, checkBalance]);
  const mainButtonLoading = useMemo(() => {
    if (tokenApprove.isLoading || add.isLoading || pending || approvePending) {
      return true;
    } else {
      return false;
    }
  }, [add.isLoading, pending, tokenApprove.isLoading, approvePending]);
  const mainButtonDis = useMemo(() => {
    if (
      !account.address ||
      BigNumber.from("0").eq(
        nestAmount.stringToBigNumber(4) ?? BigNumber.from("0")
      )
    ) {
      return true;
    }
    return !checkBalance;
  }, [account.address, checkBalance, nestAmount]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading || !checkBalance) {
      return;
    } else if (!checkAllowance) {
      tokenApprove.write?.();
    } else {
      add.write?.();
    }
  }, [add, checkAllowance, checkBalance, mainButtonLoading, tokenApprove]);
  return {
    checkBalance,
    showToSwap,
    showBalance,
    maxCallBack,
    nestAmount,
    setNestAmount,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useFuturesAdd;
