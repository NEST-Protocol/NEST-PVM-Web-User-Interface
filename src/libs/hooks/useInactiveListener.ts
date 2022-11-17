import { useEffect } from "react";
import injected from "../connectors/injected";
import useWeb3 from "./useWeb3";

const useInactiveListener = (suppress = false) => {
  const { active, error, activate, chainId } = useWeb3();

  useEffect((): any => {
    const { ethereum } = window as any;
    const setWallet = async (account: string) => {
      try {
        await fetch(
          `https://api.hedge.red/api/users/users/setwallet?address=${account}`,
          {
            method: "POST",
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected.connector);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected.connector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          activate(injected.connector);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected.connector);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate, chainId]);
};

export default useInactiveListener;
