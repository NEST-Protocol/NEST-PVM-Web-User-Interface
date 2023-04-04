import {
  FuturesV2Contract,
  NESTFiVault,
  NESTToken,
} from "./../contracts/contractAddress";
import { BigNumber } from "ethers/lib/ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useNEST from "./useNEST";
import { useContract, useContractEvent, useProvider } from "wagmi";
import FuturesV2ABI from "../contracts/ABI/FuturesV2.json";
import ERC20ABI from "../contracts/ABI/ERC20.json";
import { hideFuturesOrder } from "../lib/NESTRequest";
import useTransactionSnackBar from "./useNESTSnackBar";

export interface FuturesOrderV2 {
  index: BigNumber;
  owner: BigNumber;
  balance: BigNumber;
  channelIndex: BigNumber;
  lever: BigNumber;
  appends: BigNumber;
  orientation: boolean;
  basePrice: BigNumber;
  baseBlock: BigNumber;
  status: BigNumber;
  stopProfitPrice: BigNumber;
  stopLossPrice: BigNumber;
  Pt: BigInt;
  actualMargin: string;
  closeHash?: string;
}

interface WaitingFuturesOrder {
  index: BigNumber;
  nestAmount: BigNumber;
  owner: string;
}

const ORDER_GROUP = 10000;
const UPDATE_LIST_TIME = 15;

function useFuturesOrderList() {
  const provider = useProvider();
  const { failRequest } = useTransactionSnackBar();
  const { account, chainsData } = useNEST();
  const [orderListV2, setOrderListV2] = useState<Array<FuturesOrderV2>>([]);
  const [pOrderList, setPOrderList] = useState<Array<FuturesOrderV2>>([]);
  const [orderList, setOrderList] = useState<Array<FuturesOrderV2>>([]);
  const [closedOrder, setClosedOrder] = useState<Array<FuturesOrderV2>>([]);
  const [orderNotShow, setOrderNotShow] = useState<BigNumber[]>([]);
  const [waitingOrders, setWaitingOrders] = useState<
    Array<WaitingFuturesOrder>
  >([]);
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
  /**
   * listen futures order
   */
  useContractEvent({
    address: chainsData.chainId
      ? (FuturesV2Contract[chainsData.chainId] as `0x${string}`)
      : undefined,
    abi: FuturesV2ABI,
    eventName: "BuyRequest",
    listener(index, nestAmount, owner) {
      console.log(index, nestAmount, owner);
      const newWaitingOrder: WaitingFuturesOrder = {
        index: index as BigNumber,
        nestAmount: nestAmount as BigNumber,
        owner: owner as string,
      };
      setWaitingOrders([...waitingOrders, newWaitingOrder]);
    },
  });

  const check = async () => {
    console.log("test");
    if (waitingOrders.length > 0 && FuturesV2) {
      var overOrders = [];
      for (let index = 0; index < waitingOrders.length; index++) {
        const element = waitingOrders[index];
        const checkOrder: Array<FuturesOrderV2> = await FuturesV2.find(
          BigNumber.from("1").add(element.index).toString(),
          "1",
          "1",
          account.address
        );
        // console.log(checkOrder);
        if (
          BigNumber.from("255").eq(checkOrder[0].status) ||
          BigNumber.from("2").eq(checkOrder[0].status)
        ) {
          if (BigNumber.from("255").eq(checkOrder[0].status)) {
            // show
            console.log("fail");
            failRequest();
          }
          overOrders.push(element);
        }
      }
      const overOrdersIndex = overOrders.map((item) => item.index);
      const newWaitingOrders = waitingOrders.filter(
        (item) =>
          overOrdersIndex.indexOf(BigNumber.from(item.index.toString())) !== -1
      );
      console.log(newWaitingOrders);
      setWaitingOrders(newWaitingOrders);
    }
  };

  useContractEvent({
    address: chainsData.chainId
      ? (NESTToken[chainsData.chainId] as `0x${string}`)
      : undefined,
    abi: ERC20ABI,
    eventName: "Transfer",
    listener(from, to, amount) {
      console.log(from, to, amount);
      if (
        chainsData.chainId &&
        (from as string).toLocaleLowerCase() ===
          NESTFiVault[chainsData.chainId].toLocaleLowerCase() &&
        (to as string).toLocaleLowerCase() ===
          account.address?.toLocaleLowerCase()
      ) {
        console.log("may be fail");
        setTimeout(() => {
          (async () => {
            await check();
          })();
        }, 2 * 1000);
      }
    },
  });
  // useEffect(() => {
  //   const check = async () => {
  //     console.log("test");
  //     if (waitingOrders.length > 0 && FuturesV2) {
  //       for (let index = 0; index < waitingOrders.length; index++) {
  //         const element = waitingOrders[index];
  //         const checkOrder: Array<FuturesOrderV2> = await FuturesV2.find(
  //           BigNumber.from("1").add(element.index).toString(),
  //           "1",
  //           "1",
  //           account.address
  //         );
  //         // console.log(checkOrder);
  //         if (
  //           BigNumber.from("255").eq(checkOrder[0].status) ||
  //           BigNumber.from("2").eq(checkOrder[0].status)
  //         ) {
  //           if (BigNumber.from("255").eq(checkOrder[0].status)) {
  //             // show
  //             console.log("fail");
  //             failRequest();
  //           }
  //           const newWaitingOrders = waitingOrders.filter(
  //             (item) => !BigNumber.from(item.index.toString()).eq(element.index)
  //           );
  //           console.log(newWaitingOrders);
  //           setWaitingOrders(newWaitingOrders);
  //         }
  //       }
  //     }
  //   };
  //   check();
  // }, [FuturesV2, account.address, waitingOrders]);
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

  useEffect(() => {
    const plusOrdersNormal = orderListV2.filter((item) =>
      BigNumber.from("2").eq(item.status)
    );
    const plusOrdersLimit = orderListV2.filter((item) =>
      BigNumber.from("4").eq(item.status)
    );
    setPOrderList(plusOrdersNormal);
    setOrderList(plusOrdersLimit);
  }, [orderListV2]);

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
            stopProfitPrice:
              item["sp"].toString().stringToBigNumber(18) ??
              BigNumber.from("0"),
            stopLossPrice:
              item["sl"].toString().stringToBigNumber(18) ??
              BigNumber.from("0"),
            status: BigNumber.from("0"),
            appends: BigNumber.from(item["append"].toString()),
            actualMargin: item["actualMargin"].toString(),
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
      if (chainsData.chainId && account.address) {
        hideFuturesOrder(chainsData.chainId, account.address, index.toString());
      }
    },
    [account.address, chainsData.chainId, orderNotShow]
  );

  // list
  useEffect(() => {
    getFutures3List(true);
    const time = setInterval(() => {
      getFutures3List();
    }, UPDATE_LIST_TIME * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getFutures3List]);
  useEffect(() => {
    getClosedOrderList();
  }, [getClosedOrderList]);

  return { pOrderList, orderList, showClosedOrder, hideOrder };
}

export default useFuturesOrderList;
