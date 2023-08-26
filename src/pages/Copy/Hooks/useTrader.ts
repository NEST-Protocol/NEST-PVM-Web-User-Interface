import { useCallback, useEffect, useState } from "react";
import useNEST from "../../../hooks/useNEST";
import {
  copyEarningsList,
  copyKOLInfo,
  copyPerformance,
  copyPerformanceSymbol,
  copyTraderFollowers,
  serviceHistory,
  serviceList,
} from "../../../lib/NESTRequest";
import { AllKOLModel } from "./useCopy";

export interface EarningsListModel {
  date: string;
  roi: number;
  pnl: number;
}

export interface PerformanceModel {
  pnlRatio: number;
  cumlativeTraders: number;
  losingTraders: number;
  aum: number;
  winRate: number;
  traderPnl: number;
  winningTraders: number;
  ordersNumber: number;
}

export interface PerformanceSymbolModel {
  name: string;
  value: number;
}

export interface TraderOrderList {
  id: number;
  timestamp: number;
  closeTime: number;
  walletAddress: string;
  chainId: number;
  product: string;
  leverage: number;
  orderPrice: number;
  direction: boolean;
  marketPrice: number;
  profitLossRate: number;
  status: number;
}

export interface TraderFollowerList {
  walletAddress: string;
  followerProfitLoss: number;
}

function useTrader(address: string | undefined) {
  const { chainsData, signature } = useNEST();
  const [kolInfo, setKolInfo] = useState<AllKOLModel>();
  const [earningsData, setEarningsData] = useState<Array<EarningsListModel>>(
    []
  );
  const [performanceData, setPerformanceData] = useState<PerformanceModel>();
  const [performanceSymbolData, setPerformanceSymbolData] = useState<
    Array<PerformanceSymbolModel>
  >([]);
  const [traderOrderList, setTraderOrderList] = useState<
    Array<TraderOrderList>
  >([]);
  const [traderOrderHistoryList, setTraderOrderHistoryList] = useState<
    Array<TraderOrderList>
  >([]);
  const [traderFollowerList, setTraderFollowerList] = useState<
    Array<TraderFollowerList>
  >([]);

  const [tabsValue, setTabsValue] = useState(0);
  const [earningsDay, setEarningsDay] = useState<number>(0);
  const [performanceDay, setPerformanceDay] = useState<number>(0);
  const [performanceSymbolDay, setPerformanceSymbolDay] = useState<number>(0);

  const getKOLInfo = useCallback(async () => {
    if (chainsData.chainId && signature && address) {
      const req = await copyKOLInfo(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];

        const info: AllKOLModel = {
          id: value["id"],
          walletAddress: value["walletAddress"],
          nickName: value["nickName"],
          avatar: value["avatar"],
          tags: value["tags"].slice(1, -1).split(","),
          introduction: value["introduction"],
          maxFollowers: value["maxFollowers"],
          maxPositionSize: value["maxPositionSize"],
          rewardRatio: value["rewardRatio"],
          currentFollowers: value["currentFollowers"],
          followersAssets: value["followersAssets"],
          followerProfitLoss: value["followerProfitLoss"],
          kolProfitLoss: value["kolProfitLoss"],
          kolProfitLossRate: value["kolProfitLossRate"],
          roiList: value["roiList"],
        };
        setKolInfo(info);
      }
    }
  }, [address, chainsData.chainId, signature]);

  const getEarnings = useCallback(async () => {
    const days = () => {
      if (earningsDay === 0) {
        return 7;
      } else if (earningsDay === 1) {
        return 21;
      } else {
        return 30;
      }
    };
    if (chainsData.chainId && signature && address) {
      const req = await copyEarningsList(chainsData.chainId, address, days(), {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];
        const list: Array<EarningsListModel> = value.map((item: any) => {
          const one: EarningsListModel = {
            date: item["date"].split("-")[2],
            roi: item["roi"],
            pnl: item["pnl"],
          };
          return one;
        });

        setEarningsData(list);
      }
    }
  }, [address, chainsData.chainId, earningsDay, signature]);

  const getPerformance = useCallback(async () => {
    const days = () => {
      if (performanceDay === 0) {
        return 1;
      } else if (performanceDay === 1) {
        return 7;
      } else if (performanceDay === 2) {
        return 21;
      } else {
        return 30;
      }
    };
    if (chainsData.chainId && signature && address) {
      const req = await copyPerformance(chainsData.chainId, address, days(), {
        Authorization: signature.signature,
      });

      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];

        const info: PerformanceModel = {
          pnlRatio: value["pnlRatio"],
          cumlativeTraders: value["cumlativeTraders"],
          losingTraders: value["losingTraders"],
          aum: value["aum"],
          winRate: value["winRate"],
          traderPnl: value["traderPnl"],
          winningTraders: value["winningTraders"],
          ordersNumber: value["ordersNumber"],
        };
        setPerformanceData(info);
      }
    }
  }, [address, chainsData.chainId, performanceDay, signature]);

  const getPerformanceSymbol = useCallback(async () => {
    const days = () => {
      if (performanceSymbolDay === 0) {
        return 1;
      } else if (performanceSymbolDay === 1) {
        return 7;
      } else if (performanceSymbolDay === 2) {
        return 21;
      } else {
        return 30;
      }
    };
    if (chainsData.chainId && signature && address) {
      const req = await copyPerformanceSymbol(
        chainsData.chainId,
        address,
        days(),
        {
          Authorization: signature.signature,
        }
      );
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];
        const list: Array<PerformanceSymbolModel> = value.map((item: any) => {
          const one: PerformanceSymbolModel = {
            name: item["name"],
            value: item["value"],
          };
          return one;
        });
        setPerformanceSymbolData(list);
      }
    }
  }, [address, chainsData.chainId, performanceSymbolDay, signature]);

  const getList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !address || !signature) {
        return;
      }
      const baseList = await serviceList(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<TraderOrderList> = baseList["value"]
          .map((item: { [x: string]: any }) => {
            return {
              id: item["id"],
              timestamp: item["timestamp"],
              walletAddress: item["walletAddress"],
              chainId: item["chainId"],
              product: item["product"],
              leverage: item["leverage"],
              orderPrice: item["orderPrice"],
              direction: item["direction"],
              marketPrice: item["marketPrice"],
              profitLossRate: item["profitLossRate"],
              status: item["status"],
            };
          })
          .filter((item: any) => item.leverage.toString() !== "0");
        const pOrderList = list.filter((item) => {
          return item.status === 2;
        });
        setTraderOrderList(pOrderList);
      }
    } catch (error) {
      console.log(error);
    }
  }, [address, chainsData.chainId, signature]);

  const getHistoryList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !address || !signature) {
        return;
      }
      const baseList = await serviceHistory(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<TraderOrderList> = baseList["value"]
          .map((item: { [x: string]: any }) => {
            return {
              id: item["id"],
              timestamp: item["openTime"],
              closeTime: item["closeTime"],
              walletAddress: item["walletAddress"],
              chainId: item["chainId"],
              product: item["product"],
              leverage: item["leverage"],
              orderPrice: item["openPrice"],
              direction: item["direction"],
              marketPrice: item["closePrice"],
              profitLossRate: item["profitLossRate"],
            };
          })
          .filter((item: any) => item.leverage.toString() !== "0");

        setTraderOrderHistoryList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [address, chainsData.chainId, signature]);

  const getFollowerList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !address || !signature) {
        return;
      }
      const baseList = await copyTraderFollowers(chainsData.chainId, address, {
        Authorization: signature.signature,
      });
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<TraderFollowerList> = baseList["value"].map(
          (item: { [x: string]: any }) => {
            return {
              walletAddress: item["walletAddress"],
              followerProfitLoss: item["followerProfitLoss"],
            };
          }
        );

        setTraderFollowerList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [address, chainsData.chainId, signature]);

  useEffect(() => {
    getKOLInfo();
    getEarnings();
    getPerformance();
    getPerformanceSymbol();
    getFollowerList();
  }, [
    getKOLInfo,
    getEarnings,
    getPerformance,
    getPerformanceSymbol,
    getFollowerList,
  ]);

  useEffect(() => {
    getList();
    const time = setInterval(() => {
      getList();
      getHistoryList();
    }, 10 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getList, getHistoryList]);

  return {
    kolInfo,
    earningsDay,
    setEarningsDay,
    tabsValue,
    setTabsValue,
    earningsData,
    performanceData,
    performanceDay,
    setPerformanceDay,
    performanceSymbolDay,
    setPerformanceSymbolDay,
    performanceSymbolData,
    traderOrderList,
    traderOrderHistoryList,
    traderFollowerList
  };
}

export default useTrader;
