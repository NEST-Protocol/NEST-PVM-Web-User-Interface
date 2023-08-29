import { useCallback, useState } from "react";
import useNEST from "../../../hooks/useNEST";
import { serviceClose } from "../../../lib/NESTRequest";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "../../../hooks/useTransactionReceipt";
import { SnackBarType } from "../../../components/SnackBar/NormalSnackBar";

function useMyCopiesCurrent(updateList: () => void) {
  const { chainsData, signature } = useNEST();
  const [isLoading, setIsLoading] = useState<number>(-1);
  const { addTransactionNotice } = usePendingTransactionsBase();
  const close = useCallback(
    async (id: number) => {
      if (chainsData.chainId && signature) {
        const closeBase: { [key: string]: any } = await serviceClose(
          id.toString(),
          chainsData.chainId,
          { Authorization: signature.signature }
        );
        if (Number(closeBase["errorCode"]) === 0) {
        }

        addTransactionNotice({
          type: TransactionType.futures_sell,
          info: "",
          result:
            Number(closeBase["errorCode"]) === 0
              ? SnackBarType.success
              : SnackBarType.fail,
        });
        setIsLoading(-1);
        updateList();
      }
    },
    [addTransactionNotice, chainsData.chainId, signature, updateList]
  );

  const action = useCallback(
    (id: number) => {
      if (isLoading === -1) {
        close(id);
        setIsLoading(id);
      }
    },
    [close, isLoading]
  );
  return { action, isLoading };
}

export default useMyCopiesCurrent;
