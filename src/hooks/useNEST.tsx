import { useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

function useMainReact() {
  const [showConnect, setShowConnect] = useState(false);
  
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
   * show share position
   */
  const [openedSharePosition, setOpenedSharePosition] =
    useState<boolean>(false);
  return {
    showConnect,
    setShowConnect,
    account,
    connectData,
    chainsData,
    disconnect,
    openedSharePosition,
    setOpenedSharePosition,
  };
}
const NEST = createContainer(useMainReact);

function useNEST() {
  return NEST.useContainer();
}

export const NESTProvider = NEST.Provider;
export default useNEST;
