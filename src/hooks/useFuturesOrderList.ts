import { useCallback, useEffect, useState } from "react";
import useNEST from "./useNEST";
import { serviceList } from "../lib/NESTRequest";
import { usePendingTransactionsBase } from "./useTransactionReceipt";
import { FuturesOrderService } from "../pages/Futures/OrderList";

const UPDATE_LIST_TIME = 3;

function useFuturesOrderList() {
  const { account, chainsData, signature } = useNEST();
  const [pOrderListV2, setPOrderListV2] = useState<Array<FuturesOrderService>>(
    []
  );
  const [orderListV2, setOrderListV2] = useState<Array<FuturesOrderService>>(
    []
  );
  const { transactionNotice } = usePendingTransactionsBase();

  const getList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !account.address || !signature) {
        return;
      }
      const baseList = await serviceList(chainsData.chainId, account.address, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<FuturesOrderService> = baseList["value"]
          .map((item: { [x: string]: any }) => {
            return {
              id: item["id"],
              timestamp: item["timestamp"],
              walletAddress: item["walletAddress"],
              chainId: item["chainId"],
              product: item["product"],
              leverage: item["leverage"],
              orderPrice: item["orderPrice"],
              limitPrice: item["limitPrice"],
              direction: item["direction"],
              margin: item["margin"],
              append: item["append"],
              balance: item["balance"],
              fees: item["fees"],
              stopLossPrice: item["stopLossPrice"],
              takeProfitPrice: item["takeProfitPrice"],
              status: item["status"],
              
            };
          })
          .filter((item: any) => item.leverage.toString() !== "0");
        const pOrderList = list.filter((item) => {
          return item.status === 2;
        });
        const orderList = list.filter((item) => {
          return item.status === 4;
        });
        setPOrderListV2(pOrderList);
        setOrderListV2(orderList);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account.address, chainsData.chainId, signature]);
  // list
  useEffect(() => {
    getList();
    const time = setInterval(() => {
      getList();
    }, UPDATE_LIST_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getList]);

  return { pOrderListV2, orderListV2 };
}

export default useFuturesOrderList;
