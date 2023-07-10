import { useCallback, useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { NavItems, NavItemsForScroll } from "../pages/Share/Head/NESTHead";

function useMainReact() {
  const [showConnect, setShowConnect] = useState(false);
  const stopAll = false

  /**
   * wallet
   */
  const account = useAccount({
    onConnect: (data) => console.log("connected", data),
    onDisconnect: () => console.log("disconnected"),
  });
  const connectData = useConnect();
  const disconnect = useDisconnect();
  useEffect(() => {
    if (showConnect && account.isConnected) {
      setShowConnect(false);
    }
  }, [account.isConnected, showConnect]);
  /**
   * Switch chains
   */
  const { chain } = useNetwork();
  const chainId = useMemo(() => {
    return chain ? chain.id : undefined;
  }, [chain]);
  const {
    chains,
    error: switchNetworkError,
    pendingChainId,
    switchNetwork,
    status,
    reset: switchNetworkReset,
  } = useSwitchNetwork();
  const chainsData = {
    chain,
    chainId,
    chains,
    switchNetworkError,
    pendingChainId,
    switchNetwork,
    switchNetworkReset,
    status,
  };
  /**
   * user: connect wallet
   */
  useEffect(() => {
    if (chainId !== 97 && account.address) {
      (async () => {
        try {
          await fetch(
            `https://api.nestfi.net/api/users/users/setwallet?address=${account.address}`,
            {
              method: "POST",
            }
          );
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [account.address, chainId]);
  /**
   * nav items from different chain
   */
  const navItems = useMemo(() => {
    return chainId === 534353 ? NavItemsForScroll : NavItems;
  }, [chainId]);
  /**
   * add nest
   */
  const addNESTToWallet = useCallback(async () => {
    const token = "NEST".getToken();
    if (chainId && token && account.connector) {
      const imageURL =
        "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenNest.svg";
      await account.connector.watchAsset?.({
        address: token.address[chainId], // The address that the token is at.
        symbol: "NEST", // A ticker symbol or shorthand, up to 5 chars.
        decimals: 18, // The number of decimals in the token
        image: imageURL, // A string url of the token logo
      });
    }
  }, [account.connector, chainId]);
  return {
    showConnect,
    setShowConnect,
    account,
    connectData,
    chainsData,
    disconnect,
    navItems,
    addNESTToWallet,
    stopAll
  };
}
const NEST = createContainer(useMainReact);

function useNEST() {
  return NEST.useContainer();
}

export const NESTProvider = NEST.Provider;
export default useNEST;
