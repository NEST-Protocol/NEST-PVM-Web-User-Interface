import { useCallback, useEffect, useState } from "react";
import { copyAllKOL, copyMyTradeInfo } from "../../../lib/NESTRequest";
import useNEST from "../../../hooks/useNEST";

export interface AllKOLModel {
  id: string;
  walletAddress: string;
  nickName: string;
  avatar: string;
  tags: [string];
  introduction: string;
  maxFollowers: number;
  maxPositionSize: number;
  rewardRatio: number;
  currentFollowers: number;
  followersAssets: number;
  followerProfitLoss: number;
  kolProfitLoss: number;
  kolProfitLossRate: number;
  roiList: [number];
}

export interface MyTradeInfoModel {
  assets: number;
  copyOrders: number;
  unRealizedPnl: number;
  profit: number;
}

function useCopy() {
  const { chainsData, signature } = useNEST();
  const [kolList, setKolList] = useState<Array<AllKOLModel>>([]);
  const [myTradeInfo, setMyTradeInfo] = useState<MyTradeInfoModel>();
  const [page, setPage] = useState<number>(1);
  const [allPage, setAllPage] = useState<number>(1);

  const getAllKOL = useCallback(async () => {
    if (chainsData.chainId && signature) {
      const req = await copyAllKOL(chainsData.chainId, page, 12, {
        Authorization: signature.signature,
      });
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"]["records"];
        const allItem = req["value"]["total"];
        setAllPage(Math.ceil(allItem / 12));
        const list: Array<AllKOLModel> = value.map((item: any) => {
          const one: AllKOLModel = {
            id: item["id"],
            walletAddress: item["walletAddress"],
            nickName: item["nickName"],
            avatar: item["avatar"],
            tags: item["tags"],
            introduction: item["introduction"],
            maxFollowers: item["maxFollowers"],
            maxPositionSize: item["maxPositionSize"],
            rewardRatio: item["rewardRatio"],
            currentFollowers: item["currentFollowers"],
            followersAssets: item["followersAssets"],
            followerProfitLoss: item["followerProfitLoss"],
            kolProfitLoss: item["kolProfitLoss"],
            kolProfitLossRate: item["kolProfitLossRate"],
            roiList: item["roiList"],
          };
          return one;
        });
        setKolList(list);
      }
    }
  }, [chainsData.chainId, page, signature]);

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

  useEffect(() => {
    getAllKOL();
    getMyTradeInfo();
  }, [getAllKOL, getMyTradeInfo]);
  return { kolList, myTradeInfo, setPage, allPage };
}

export default useCopy;
