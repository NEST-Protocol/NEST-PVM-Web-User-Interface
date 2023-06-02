import { useCallback, useEffect, useMemo, useState } from "react";
import useReadTokenBalance from "../../contracts/Read/useReadTokenContract";
import useNEST from "../../hooks/useNEST";
import { useProvider } from "wagmi";
import { BigNumber } from "ethers/lib/ethers";
import { t } from "@lingui/macro";

export function useDirectPoster() {
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const { account, chainsData, setShowConnect } = useNEST();
  const provider = useProvider();
  const { balance: nestBalance, balanceOfRefetch: nestBalanceRefetch } =
    useReadTokenBalance(
      ("NEST".getTokenAddress(chainsData.chainId) ??
        String().zeroAddress) as `0x${string}`,
      account.address ?? ""
    );
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
  const mainButtonAction = useCallback(() => {
    if (mainButtonTitle === t`Connect Wallet`) {
      setShowConnect(true);
    } else {
    }
  }, [mainButtonTitle, setShowConnect]);

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
    mainButtonAction,
  };
}
