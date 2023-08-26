import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST from "../../../hooks/useNEST";
import { copyClose, copyCloseInfo } from "../../../lib/NESTRequest";

export interface MyCopiesCloseModel {
  openInterest: number;
  totalProfit: number;
  totalCopyAmount: number;
  aum: number;
}

function useCloseCopyModal(address: string | undefined, onClose: () => void) {
  const { chainsData, signature } = useNEST();
  const [closeInfo, setCloseInfo] = useState<MyCopiesCloseModel>();
  const [isLoading, setIsLoading] = useState(false);

  const getCloseInfo = useCallback(async () => {
    if (chainsData.chainId && signature && address) {
      const req = await copyCloseInfo(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];
        const info: MyCopiesCloseModel = {
          openInterest: value["openInterest"],
          totalProfit: value["totalProfit"],
          totalCopyAmount: value["totalCopyAmount"],
          aum: value["aum"],
        };
        setCloseInfo(info);
      }
    }
  }, [address, chainsData.chainId, signature]);

  const closeFollow = useCallback(async () => {
    if (chainsData.chainId && signature && address) {
      const req = await copyClose(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        onClose();
      } else {
        setIsLoading(false);
      }
    }
  }, [address, chainsData.chainId, onClose, signature]);

  const mainButtonLoading = useMemo(() => {
    return isLoading;
  }, [isLoading]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);

  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      setIsLoading(true);
      closeFollow();
    }
  }, [closeFollow, mainButtonDis, mainButtonLoading]);

  useEffect(() => {
    getCloseInfo();
  }, [getCloseInfo]);

  return {
    closeInfo,
    closeFollow,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useCloseCopyModal;
