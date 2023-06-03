import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance from "../../contracts/Read/useReadTokenContract";
import useNEST from "../../hooks/useNEST";
import { useProvider } from "wagmi";
import { BigNumber } from "ethers/lib/ethers";
import { t } from "@lingui/macro";
import { useScrollNESTfaucet } from "../../contracts/useScrollNEST";
import { TransactionType, usePendingTransactions } from "../../hooks/useTransactionReceipt";

export function useDirectPoster() {
  const { isPendingType } = usePendingTransactions();
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const { account, chainsData, setShowConnect } = useNEST();
  const provider = useProvider();

  const { balance: nestBalance, balanceOfRefetch: nestBalanceRefetch } =
    useReadTokenBalance(
      ("NEST".getTokenAddress(chainsData.chainId) ??
        String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
    const { transaction: faucet } = useScrollNESTfaucet();

  const getETHBalance = useCallback(async () => {
    if (account.address) {
      const balance = await provider.getBalance(account.address);
      setEthBalance(balance);
    }
  }, [account.address, provider]);

  const mainButtonTitle = useMemo(() => {
    if (!account.address) {
      return t`Connect Wallet`;
    } else {
      return t`GET` + ` NEST ` + t`Testnet token`;
    }
  }, [account.address]);
  const pending = useMemo(() => {
    return (
      isPendingType(TransactionType.faucet_scroll)
    );
  }, [isPendingType]);
  const mainButtonLoading = useMemo(() => {
    if (
      faucet.isLoading ||
      pending
    ) {
      return true;
    } else {
      return false;
    }
  }, [faucet.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    if (!account.address) {
      return false;
    }
    return false
  }, [account.address]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonTitle === t`Connect Wallet`) {
      setShowConnect(true);
    } else if (mainButtonLoading) {
      return
    } else {
      faucet.write?.()
    }
  }, [faucet, mainButtonLoading, mainButtonTitle, setShowConnect]);

  useEffect(() => {
    getETHBalance();
  }, [getETHBalance]);

  const showNESTBalance = useMemo(() => {
    return nestBalance ? nestBalance.bigNumberToShowString(18, 2) : "-";
  }, [nestBalance]);
  const showETHBalance = useMemo(() => {
    return ethBalance ? ethBalance.bigNumberToShowString(18, 2) : "-";
  }, [ethBalance]);
  const getNESTError = useMemo(() => {
    if (ethBalance && BigNumber.from("0").eq(ethBalance)) {
      return t`Please get ETH testnet token first`;
    } else {
      return undefined;
    }
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
