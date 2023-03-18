import { FuturesV2Contract } from "./../contracts/contractAddress";
import { BigNumber } from "ethers/lib/ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST from "./useNEST";
import { useContract, useProvider } from "wagmi";
import FuturesV2ABI from "../contracts/ABI/FuturesV2.json";

export interface TrustOrder {
  index: BigNumber;
  owner: string;
  orderIndex: BigNumber;
  balance: BigNumber;
  fee: BigNumber;
  limitPrice: BigNumber;
  stopProfitPrice: BigNumber;
  stopLossPrice: BigNumber;
  status: BigNumber;
}

export interface FuturesOrderV2 {
  index: BigNumber;
  owner: BigNumber;
  basePrice: BigNumber;
  balance: BigNumber;
  appends: BigNumber;
  channelIndex: BigNumber;
  lever: BigNumber;
  orientation: boolean;
  Pt: BigInt;
  actualMargin: string;
  baseBlock: BigNumber;
  trustOrder?: TrustOrder;
  closeHash?: string;
}

const ORDER_GROUP = 10000;
const UPDATE_LIST_TIME = 15;

function useFuturesOrderList() {
  const provider = useProvider();
  const { account, chainsData } = useNEST();
  const [trustOrderListV2, setTrustOrderListV2] = useState<Array<TrustOrder>>(
    []
  );
  const [orderListV2, setOrderListV2] = useState<Array<FuturesOrderV2>>([]);
  const [pOrderList, setPOrderList] = useState<Array<FuturesOrderV2>>([]);
  const [orderList, setOrderList] = useState<Array<FuturesOrderV2>>([]);
  const [closedOrder, setClosedOrder] = useState<Array<FuturesOrderV2>>([]);
  const [orderNotShow, setOrderNotShow] = useState<BigNumber[]>([]);
  const contractAddress = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId];
    }
  }, [chainsData.chainId]);
  const FuturesV2 = useContract({
    address: contractAddress,
    abi: FuturesV2ABI,
    signerOrProvider: provider,
  });
  const getFutures3List = useCallback(
    async (getPart: boolean = false) => {
      try {
        if (!FuturesV2 || !account) {
          return;
        }
        const latestOrder: Array<FuturesOrderV2> = await FuturesV2.list(
          "0",
          "1",
          "0"
        );
        const orderMaxNum = Number(latestOrder[0].index.toString()) + 1;
        const orderGroupNum = orderMaxNum / ORDER_GROUP;
        var result: FuturesOrderV2[] = [];
        for (let i = 0; i < orderGroupNum; i++) {
          const startNum = i === 0 ? 0 : orderMaxNum - i * ORDER_GROUP;
          if (i !== 0 && startNum === 0) {
            return;
          }
          const groupList: Array<FuturesOrderV2> = await FuturesV2.find(
            startNum.toString(),
            "1000",
            ORDER_GROUP.toString(),
            account.address
          );
          const groupResult = groupList.filter((item) => {
            return item.lever.toString() !== "0";
          });
          result = [...result, ...groupResult];
          if (getPart) {
            setOrderListV2(result);
          }
        }
        if (!getPart) {
          setOrderListV2(result);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [FuturesV2, account]
  );

  const getFutures3TrustList = useCallback(
    async (getPart: boolean = false) => {
      try {
        if (!FuturesV2 || !account) {
          return;
        }

        const latestOrder: Array<TrustOrder> = await FuturesV2.listTrustOrder(
          "0",
          "1",
          "0"
        );
        const orderMaxNum = Number(latestOrder[0].index.toString()) + 1;
        const orderGroupNum = orderMaxNum / ORDER_GROUP;
        var result: TrustOrder[] = [];
        for (let i = 0; i < orderGroupNum; i++) {
          const startNum = i === 0 ? 0 : orderMaxNum - i * ORDER_GROUP;
          if (i !== 0 && startNum === 0) {
            return;
          }
          const groupList: Array<TrustOrder> = await FuturesV2.findTrustOrder(
            startNum.toString(),
            "1000",
            ORDER_GROUP.toString(),
            account.address
          );
          const groupResult = groupList.filter((item) => {
            return (
              item.owner.toString().toLocaleLowerCase() !==
              String().zeroAddress.toLocaleLowerCase()
            );
          });
          result = [...result, ...groupResult];
          if (getPart) {
            setTrustOrderListV2(result);
          }
        }
        if (!getPart) {
          setTrustOrderListV2(result);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [account, FuturesV2]
  );

  useEffect(() => {
    const plusOrders = orderListV2.map((order) => {
      var newOrder = { ...order };
      const trustOrders = trustOrderListV2.filter((trust) =>
        BigNumber.from(trust.orderIndex.toString()).eq(order.index)
      );
      if (trustOrders.length > 0) {
        newOrder.trustOrder = trustOrders[0];
      }
      return newOrder;
    });

    const plusOrdersNormal = plusOrders
      .filter(
        (item) =>
          !item.trustOrder ||
          (item.trustOrder && BigNumber.from("0").eq(item.trustOrder.status))
      )
      .filter((item) => item.balance.toString() !== "0");
    const plusOrdersLimit = plusOrders.filter(
      (item) =>
        item.trustOrder && BigNumber.from("1").eq(item.trustOrder.status)
    );
    setPOrderList(plusOrdersNormal);
    setOrderList(plusOrdersLimit);
  }, [orderListV2, trustOrderListV2]);

  const getClosedOrderList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !account.address) {
        return;
      }
      const data = await fetch(
        `https://api.nestfi.net/api/order/position/v2/list/${chainsData.chainId}?address=${account.address}`
      );
      const data_json = await data.json();
      const list: Array<FuturesOrderV2> = data_json["value"]
        .map((item: { [x: string]: any }) => {
          const trustOrder: TrustOrder = {
            limitPrice: BigNumber.from("0"),
            stopProfitPrice:
              item["sp"].toString().stringToBigNumber(18) ??
              BigNumber.from("0"),
            stopLossPrice:
              item["sl"].toString().stringToBigNumber(18) ??
              BigNumber.from("0"),
            index: BigNumber.from("0"),
            owner: "",
            orderIndex: BigNumber.from("0"),
            balance: BigNumber.from("0"),
            fee: BigNumber.from("0"),
            status: BigNumber.from("0"),
          };
          return {
            index: BigNumber.from(item["index"].toString()),
            owner: BigNumber.from(item["owner"].toString()),
            balance:
              item["balance"].toString().stringToBigNumber(4) ??
              BigNumber.from("0"),
            channelIndex: BigNumber.from(item["tokenIndex"].toString()),
            baseBlock: BigNumber.from(item["baseBlock"].toString()),
            lever: BigNumber.from(item["level"].toString()),
            orientation: item["orientation"].toString() === "true",
            basePrice:
              item["basePrice"].toString().stringToBigNumber(18) ??
              BigNumber.from("0"),
            stopPrice: item["stopPrice"]
              ? item["stopPrice"].toString().stringToBigNumber(18) ??
                BigNumber.from("0")
              : BigNumber.from("0"),
            appends: BigNumber.from(item["append"].toString()),
            actualMargin: item["actualMargin"].toString(),
            trustOrder: trustOrder,
          };
        })
        .filter((item: any) => item.lever.toString() !== "0");
      setClosedOrder(list);
    } catch (error) {
      console.log(error);
    }
  }, [account.address, chainsData.chainId]);

  const showClosedOrder = useMemo(() => {
    return closedOrder.filter((item) => {
      return !orderNotShow
        .map((item) => item.toString())
        .includes(item.index.toString());
    });
  }, [closedOrder, orderNotShow]);
  const hideOrder = useCallback(
    async (index: BigNumber) => {
      setOrderNotShow([...orderNotShow, index]);
      try {
        await fetch(
          `https://api.nestfi.net/api/order/save/${
            chainsData.chainId
          }?address=${account.address}&index=${index.toString()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    [account.address, chainsData.chainId, orderNotShow]
  );

  // list
  useEffect(() => {
    getFutures3List(true);
    getFutures3TrustList(true);
    const time = setInterval(() => {
      getFutures3List();
      getFutures3TrustList();
    }, UPDATE_LIST_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getFutures3List, getFutures3TrustList]);
  useEffect(() => {
    getClosedOrderList();
  }, [getClosedOrderList]);

  return { pOrderList, orderList, showClosedOrder, hideOrder };
}

export default useFuturesOrderList;
