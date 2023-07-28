import useNEST from "./useNEST";

import { useMemo } from "react";
import {
  CoinbaseWallet,
  DefaultWallet,
  MetaMask,
  OKX,
  TrustWallet,
  WalletConnect,
  Warning,
} from "../components/icons";

function useWalletIcon() {
  const { account, checkSigned } = useNEST();
  const walletIcon = useMemo(() => {
    if (!checkSigned) {
      return <Warning className="warning" />;
    }
    if (account.connector?.id === "metaMask") {
      return <MetaMask />;
    } else if (account.connector?.id === "coinbase") {
      return <CoinbaseWallet />;
    } else if (account.connector?.id === "walletConnect") {
      return <WalletConnect />;
    } else if (account.connector?.id === "trust") {
      return <TrustWallet />;
    } else if (account.connector?.id === "okx-wallet") {
      return <OKX />;
    } else {
      return <DefaultWallet />;
    }
  }, [account.connector?.id, checkSigned]);
  return walletIcon;
}

export default useWalletIcon;
