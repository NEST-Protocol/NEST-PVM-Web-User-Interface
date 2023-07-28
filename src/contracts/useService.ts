import { useCallback } from "react";
import useNEST from "../hooks/useNEST";
import { serviceAsset } from "../lib/NESTRequest";

function useService() {
    const { account, chainsData, signature } = useNEST();
    const service_balance = useCallback(async (back: (result: number) => void) => {
        if (chainsData.chainId && account.address && signature) {
          const balanceBase: { [key: string]: any } = await serviceAsset(
            chainsData.chainId,
            account.address,
            { Authorization: signature.signature }
          );
          if (Number(balanceBase["errorCode"]) === 0) {
            const value: { [key: string]: number } = balanceBase["value"];
            const balance = value["availableBalance"];
            back(balance)
          }
        }
      }, [account.address, chainsData.chainId, signature]);
    return {
      service_balance
    }
}

export default useService