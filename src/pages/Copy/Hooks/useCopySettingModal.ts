import { useCallback, useMemo, useState } from "react";
import useNEST from "../../../hooks/useNEST";
import { copyFollow } from "../../../lib/NESTRequest";
import { t } from "@lingui/macro";

function useCopySettingModal(
  address: string | undefined,
  add: boolean,
  onClose: () => void
) {
  const { chainsData, signature } = useNEST();
  const [copyAccountBalance, setCopyAccountBalance] = useState<string>("");
  const [followingValue, setFollowingValue] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const follow = useCallback(async () => {
    if (
      chainsData.chainId &&
      signature &&
      address &&
      copyAccountBalance !== "" &&
      followingValue !== ""
    ) {
      const req = await copyFollow(
        chainsData.chainId,
        {
          Authorization: signature.signature,
        },
        {
          chainId: chainsData.chainId.toString(),
          copyAccountBalance: copyAccountBalance,
          copyKolAddress: address,
          follow: "true",
          followingMethod: "FIEXD",
          followingValue: followingValue,
        }
      );
      if (Number(req["errorCode"]) === 0) {
        onClose();
      } else {
        setIsLoading(false);
      }
    }
  }, [
    address,
    chainsData.chainId,
    copyAccountBalance,
    followingValue,
    onClose,
    signature,
  ]);

  const mainButtonTitle = useMemo(() => {
    return add ? t`Save` : t`Copy Now`;
  }, [add]);

  const mainButtonLoading = useMemo(() => {
    return isLoading;
  }, [isLoading]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);

  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      setIsLoading(true);
      follow();
    }
  }, [follow, mainButtonDis, mainButtonLoading]);

  return {
    copyAccountBalance,
    setCopyAccountBalance,
    followingValue,
    setFollowingValue,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useCopySettingModal;
