import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance from "../../contracts/Read/useReadTokenContract";
import useNEST from "../../hooks/useNEST";
import { usePublicClient } from "wagmi";
import { BigNumber } from "ethers/lib/ethers";
import { t } from "@lingui/macro";
import { useScrollNESTfaucet } from "../../contracts/useScrollNEST";
import {
  TransactionType,
  usePendingTransactions,
} from "../../hooks/useTransactionReceipt";
import { useReadScrollNESTRemain } from "../../contracts/Read/useReadScrollNESTContract";

export function useDirectPoster() {
  const { isPendingType } = usePendingTransactions();
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const { account, chainsData, setShowConnect } = useNEST();
  const provider = usePublicClient();

  const { balance: nestBalance, balanceOfRefetch: nestBalanceRefetch } =
    useReadTokenBalance(
      ("NEST".getTokenAddress(chainsData.chainId) ??
        String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
  const { transaction: faucet } = useScrollNESTfaucet();

  const getETHBalance = useCallback(async () => {
    if (account.address) {
      const balance = await provider.getBalance({ address: account.address });
      setEthBalance(balance.toBigNumber());
    }
  }, [account.address, provider]);

  const { remain, remainRefetch } = useReadScrollNESTRemain(
    account.address ?? "",
    account.address ?? ""
  );
  const noRemain = useMemo(() => {
    console.log(account.address);
    console.log(remain);
    return remain && BigNumber.from("0").eq(remain);
  }, [account.address, remain]);
  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return t`Connect Wallet`;
    } else {
      return t`GET` + ` NEST ` + t`Testnet token`;
    }
  }, [account.address]);
  const pending = useMemo(() => {
    return isPendingType(TransactionType.faucet_scroll);
  }, [isPendingType]);
  const getNESTError = useMemo(() => {
    if (ethBalance && BigNumber.from("0").eq(ethBalance)) {
      return t`Please get ETH testnet token first`;
    } else if (noRemain) {
      return t`It's available once in 24 hours. Please come later.`;
    } else {
      return undefined;
    }
  }, [ethBalance, noRemain]);
  const mainButtonLoading = useMemo(() => {
    if (faucet.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [faucet.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    } else if (noRemain || getNESTError) {
      return true;
    }
    return false;
  }, [account.address, getNESTError, noRemain]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonTitle === t`Connect Wallet`) {
      setShowConnect(true);
    } else if (mainButtonLoading || noRemain || getNESTError) {
      return;
    } else {
      faucet.write?.();
    }
  }, [
    faucet,
    getNESTError,
    mainButtonLoading,
    mainButtonTitle,
    noRemain,
    setShowConnect,
  ]);

  useEffect(() => {
    getETHBalance();
  }, [getETHBalance]);

  useEffect(() => {
    const time = setInterval(() => {
      nestBalanceRefetch();
      getETHBalance();
      remainRefetch();
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getETHBalance, nestBalanceRefetch, remainRefetch]);

  const showNESTBalance = useMemo(() => {
    return nestBalance ? nestBalance.bigNumberToShowString(18, 2) : "-";
  }, [nestBalance]);
  const showETHBalance = useMemo(() => {
    return ethBalance ? ethBalance.bigNumberToShowString(18, 2) : "-";
  }, [ethBalance]);

  return {
    showNESTBalance,
    showETHBalance,
    getNESTError,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}
