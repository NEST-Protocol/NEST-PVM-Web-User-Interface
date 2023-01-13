import { t } from "@lingui/macro";
import { message } from "antd";
import { useEffect, useState } from "react";
import injected from "../connectors/injected";
import OKX from "../connectors/okx-connect";
import useWeb3 from "./useWeb3";

const useEagerConnect = () => {
  const { activate, active, deactivate } = useWeb3();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const isAuthorized_inj = await injected.connector.isAuthorized();
        if (isAuthorized_inj) {
          activate(injected.connector, undefined, true).catch(() => {
            deactivate();
            message.error(
              t`This network is not supported, please switch the network`
            );
          })
        }
        const isAuthorized_okx = await OKX.connector.isAuthorized();
        if (isAuthorized_okx) {
          activate(OKX.connector, undefined, true).catch(() => {
            deactivate();
            message.error(
              t`This network is not supported, please switch the network`
            );
          })
        }
      } finally {
        setTried(true);
      }
    })();

  }, [activate, deactivate]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export default useEagerConnect;
