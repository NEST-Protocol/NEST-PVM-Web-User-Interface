import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo } from "react";
import MessageSnackBar from "../components/SnackBar/MessageSnackBar";
import NormalSnackBar, {
  SnackBarType,
} from "../components/SnackBar/NormalSnackBar";
import useNEST from "./useNEST";
import useWindowWidth from "./useWindowWidth";
import { t } from "@lingui/macro";
import { getTransactionTypeString } from "./useTransactionReceipt";



function useTransactionSnackBar() {
  const { isBigMobile } = useWindowWidth();
  const { chainsData } = useNEST();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const transactionsData: Array<any> = useMemo(() => {
    var cache = localStorage.getItem(
      "transactionListV2" + chainsData.chain?.id.toString()
    );
    if (!cache) {
      return [];
    }
    return JSON.parse(cache);
  }, [chainsData.chain?.id]);

  const transactionSnackBar = (
    title: string,
    info: string,
    type: SnackBarType,
    hash: string
  ) => {
    enqueueSnackbar("", {
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: isBigMobile ? "center" : "right",
      },
      content: (key, message) => (
        <NormalSnackBar
          id={key}
          title={getTransactionTypeString(title)}
          info={info}
          type={type}
          hash={hash}
          message={message}
          closeSnackbar={closeSnackbar}
        />
      ),
    });

    const same = transactionsData.filter(
      (item) =>
        (item["hash"] as string).toLocaleLowerCase() ===
        hash.toLocaleLowerCase()
    );

    if (same.length === 0) {
      const newTransactionsData = [
        ...transactionsData,
        {
          title: title,
          success: type === SnackBarType.success,
          hash: hash,
        },
      ];

      localStorage.setItem(
        "transactionListV2" + chainsData.chainId?.toString(),
        JSON.stringify(newTransactionsData)
      );
    }
  };

  const transactionSnackBarService = (
    title: string,
    info: string,
    type: SnackBarType
  ) => {
    enqueueSnackbar("", {
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: isBigMobile ? "center" : "right",
      },
      content: (key, message) => (
        <NormalSnackBar
          id={key}
          title={getTransactionTypeString(title)}
          info={info}
          type={type}
          message={message}
          closeSnackbar={closeSnackbar}
        />
      ),
    });
  };

  const switchNetWork = useCallback(() => {
    enqueueSnackbar("", {
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      content: (key, message) => (
        <NormalSnackBar
          id={key}
          title={t`Switch network successfully`}
          info={""}
          type={SnackBarType.success}
          message={message}
          closeSnackbar={closeSnackbar}
        />
      ),
    });
  }, [closeSnackbar, enqueueSnackbar]);
  useEffect(() => {
    if (chainsData.status === "success") {
      switchNetWork();
      chainsData.switchNetworkReset();
    }
  }, [chainsData, chainsData.status, switchNetWork]);

  const messageSnackBar = (message: string) => {
    enqueueSnackbar(`${message}`, {
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      content: (key, message) => <MessageSnackBar id={key} message={message} />,
    });
  };

  const failRequest = () => {
    enqueueSnackbar("", {
      preventDuplicate: false,
      anchorOrigin: {
        vertical: "top",
        horizontal: isBigMobile ? "center" : "right",
      },
      content: (key, message) => (
        <NormalSnackBar
          id={key}
          title={t`Fail Request`}
          info={t`The transaction failed and the amount has been fully refunded. You can re-trade`}
          type={SnackBarType.fail}
          hash={undefined}
          message={message}
          closeSnackbar={closeSnackbar}
        />
      ),
    });
  };

  return {
    transactionSnackBar,
    transactionSnackBarService,
    closeSnackbar,
    messageSnackBar,
    switchNetWork,
    failRequest,
  };
}

export default useTransactionSnackBar;
