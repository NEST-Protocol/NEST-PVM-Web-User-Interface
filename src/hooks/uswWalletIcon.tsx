import useNEST from "./useNEST";

import { useMemo } from "react";
import {
  CoinbaseWallet,
  DefaultWallet,
  MetaMask,
  OKX,
  TrustWallet,
  WalletConnect,
} from "../components/icons";

function useWalletIcon() {
  const { account } = useNEST();
  const walletIcon = useMemo(() => {
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
  }, [account.connector?.id]);
  return walletIcon;
}

export default useWalletIcon;
