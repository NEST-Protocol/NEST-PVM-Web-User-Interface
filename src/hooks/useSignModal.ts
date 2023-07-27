import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST, { signatureData } from "./useNEST";
import { RequestBodyInterface, serviceLogin } from "../lib/NESTRequest";
import { t } from "@lingui/macro";
import { useSignMessage, useSignTypedData } from "wagmi";

const BASE_SIGN_CONTENT = "https://nestfi.org";

function useSignModal() {
  const { account, chainsData, setSignature } = useNEST();
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const signsData: Array<any> = useMemo(() => {
    var cache = localStorage.getItem("signature");
    if (!cache) {
      return [];
    }
    return JSON.parse(cache);
  }, []);

  const login = useCallback(
    async (signature: string) => {
      if (account.address && chainsData.chainId) {
        const info: RequestBodyInterface = {
          content: BASE_SIGN_CONTENT,
          signature: signature,
        };
        const loginBase: { [key: string]: any } = await serviceLogin(
          chainsData.chainId,
          account.address,
          remember,
          info
        );
        if (Number(loginBase["errorCode"]) === 0) {
          const signatureData: signatureData = {
            address: account.address,
            chainId: chainsData.chainId,
            signature: loginBase["value"]["token"],
            expirationTime: loginBase["value"]["expirationTime"],
          };
          setSignature(signatureData);
          if (remember) {
            const same = signsData.filter(
              (item) =>
                (item["address"] as string).toLocaleLowerCase() ===
                  account.address?.toLocaleLowerCase() &&
                item["chainId"] === chainsData.chainId
            );
            if (same.length > 0) {
              const itemIndex = signsData.indexOf(same[0]);
              const newSignsData = [...signsData];
              newSignsData[itemIndex] = signatureData;
              localStorage.setItem(`signature`, JSON.stringify(newSignsData));
            } else {
              const newSignsData = [...signsData, signatureData];
              localStorage.setItem(`signature`, JSON.stringify(newSignsData));
            }
          }
        }
        setLoading(false);
      }
    },
    [account.address, chainsData.chainId, remember, setSignature, signsData]
  );

  const { data, isSuccess, signMessage } = useSignMessage({
    message: BASE_SIGN_CONTENT,
  });
  // const { data, isError, isLoading, isSuccess, signTypedData:signMessage } =
  //   useSignTypedData({
  //     domain: {
  //       name: BASE_SIGN_CONTENT,
  //       version: '1',
  //       chainId: 97,
  //     },
  //     types: {
  //       Sign: [
  //         { name: 'msg', type: 'string' },
  //       ]
  //     },
  //     value: {
  //       msg: BASE_SIGN_CONTENT
  //     }
  //   })

  const mainButtonTitle = useMemo(() => {
    return t`Send request`;
  }, []);
  const mainButtonLoading = useMemo(() => {
    return loading;
  }, [loading]);
  const mainButtonDis = useMemo(() => {
    return false;
  }, []);
  const mainButtonAction = useCallback(() => {
    if (!mainButtonDis && !mainButtonLoading) {
      setLoading(true);
      signMessage();
    }
  }, [mainButtonDis, mainButtonLoading, signMessage]);

  useEffect(() => {
    if (isSuccess && data) {
      login(data);
    }
  }, [data, isSuccess, login]);

  return {
    remember,
    setRemember,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  };
}

export default useSignModal;
