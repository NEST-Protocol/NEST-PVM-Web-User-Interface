import { useCallback } from "react";
import useNEST from "../../../hooks/useNEST";
import { serviceClose } from "../../../lib/NESTRequest";

function useMyCopiesCurrent() {
  const { chainsData, signature } = useNEST();
  const close = useCallback(async (id: number) => {
    if (chainsData.chainId && signature) {
      const closeBase: { [key: string]: any } = await serviceClose(
        id.toString(),
        chainsData.chainId,
        { Authorization: signature.signature }
      );
      if (Number(closeBase["errorCode"]) === 0) {
      }
    }
  }, [chainsData.chainId, signature]);
  return { close };
}

export default useMyCopiesCurrent;
