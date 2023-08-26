import { useCallback, useEffect, useState } from "react";
import { MyTradeInfoModel } from "./useCopy";
import useNEST from "../../../hooks/useNEST";
import {
  copyMyCopiesHistoryList,
  copyMyCopiesList,
  copyMyCopiesMyTradersList,
  copyMyTradeInfo,
} from "../../../lib/NESTRequest";

export interface MyCopiesList {
  id: number;
  timestamp: number;
  walletAddress: string;
  chainId: number;
  product: string;
  leverage: number;
  orderPrice: number;
  direction: boolean;
  balance: number;
  marketPrice: number;
  lipPrice: number;
  profitLossRate: number;
  kolAddress: string;
  nickName: string;
  avatar: string;
  closeTime: number;
}

export interface MyCopiesMyTradersList {
  kolAddress: string;
  nickName: string;
  avatar: string;
  copyAccountBalance: number;
  profit: number;
}

function useMyCopies() {
  const { chainsData, signature } = useNEST();
  const [myTradeInfo, setMyTradeInfo] = useState<MyTradeInfoModel>();
  const [myCopiesList, setMyCopiesList] = useState<Array<MyCopiesList>>([]);
  const [myCopiesHistoryList, setMyCopiesHistoryList] = useState<
    Array<MyCopiesList>
  >([]);
  const [myCopiesMyTradersList, setMyCopiesMyTradersList] = useState<
    Array<MyCopiesMyTradersList>
  >([]);

  const getMyTradeInfo = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const req = await copyMyTradeInfo(chainsData.chainId, {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];
        const info: MyTradeInfoModel = {
          assets: value["assets"],
          copyOrders: value["copyOrders"],
          unRealizedPnl: value["unRealizedPnl"],
          profit: value["profit"],
        };
        setMyTradeInfo(info);
      }
    }
  }, [chainsData.chainId, signature]);

  const getMyCopiesList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !signature) {
        return;
      }
      const baseList = await copyMyCopiesList(chainsData.chainId, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<MyCopiesList> = baseList["value"].map(
          (item: { [x: string]: any }) => {
            return {
              id: item["id"],
              timestamp: item["timestamp"],
              walletAddress: item["walletAddress"],
              chainId: item["chainId"],
              product: item["product"],
              leverage: item["leverage"],
              orderPrice: item["orderPrice"],
              direction: item["direction"],
              balance: item["balance"],
              marketPrice: item["marketPrice"],
              lipPrice: item["lipPrice"],
              profitLossRate: item["profitLossRate"],
              kolAddress: item["kolAddress"],
              nickName: item["nickName"],
              avatar: item["avatar"],
            };
          }
        );
        setMyCopiesList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chainsData.chainId, signature]);

  const getMyCopiesHistoryList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !signature) {
        return;
      }
      const baseList = await copyMyCopiesHistoryList(chainsData.chainId, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<MyCopiesList> = baseList["value"].map(
          (item: { [x: string]: any }) => {
            return {
              id: item["id"],
              timestamp: item["openTime"],
              walletAddress: item["walletAddress"],
              chainId: item["chainId"],
              product: item["product"],
              leverage: item["leverage"],
              orderPrice: item["openPrice"],
              direction: item["direction"],
              balance: item["actualMargin"],
              marketPrice: item["closePrice"],
              lipPrice: item["lipPrice"],
              profitLossRate: item["profitLossRate"],
              kolAddress: item["kolAddress"],
              nickName: item["nickName"],
              avatar: item["avatar"],
              closeTime: item["closeTime"],
            };
          }
        );
        setMyCopiesHistoryList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chainsData.chainId, signature]);

  const getMyCopiesMyTraderList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !signature) {
        return;
      }
      const baseList = await copyMyCopiesMyTradersList(chainsData.chainId, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<MyCopiesMyTradersList> = baseList["value"].map(
          (item: { [x: string]: any }) => {
            return {
              profit: item["profit"],
              copyAccountBalance: item["copyAccountBalance"],
              kolAddress: item["walletAddress"],
              nickName: item["nickName"],
              avatar: item["avatar"],
            };
          }
        );
        setMyCopiesMyTradersList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chainsData.chainId, signature]);

  

  useEffect(() => {
    getMyTradeInfo();
  }, [getMyTradeInfo]);

  useEffect(() => {
    getMyCopiesList();
    getMyCopiesHistoryList();
    getMyCopiesMyTraderList();
    const time = setInterval(() => {
      getMyCopiesList();
      getMyCopiesHistoryList();
      getMyCopiesMyTraderList();
    }, 10 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getMyCopiesHistoryList, getMyCopiesList, getMyCopiesMyTraderList]);
  return {
    myTradeInfo,
    myCopiesList,
    myCopiesHistoryList,
    myCopiesMyTradersList,
  };
}

export default useMyCopies;
