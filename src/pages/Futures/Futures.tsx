import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers/lib/ethers";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useWindowWidth, { WidthType } from "../../hooks/useWindowWidth";
import FuturesMoreInfo from "./MoreInfo";
import FuturesNewOrder from "./NewOrder";
import FuturesOrderList, { FuturesOrderService } from "./OrderList";
import ExchangeTVChart from "./ExchangeTVChart";
import {
  futuresHistory,
  getPriceList,
  serviceList,
} from "../../lib/NESTRequest";
// import FuturesNotice from "./Components/FuturesNotice";
import { getQueryVariable } from "../../lib/queryVaribale";
import FuturesNotice from "./Components/FuturesNotice";
import useNEST from "../../hooks/useNEST";
import { FuturesHistoryService } from "../../hooks/useFuturesHistory";

export interface FuturesPrice {
  [key: string]: BigNumber;
}
const UPDATE_PRICE = 15;
export const priceToken = ["ETH", "BTC", "BNB", "MATIC", "ADA", "DOGE", "XRP"];
const Futures: FC = () => {
  const { width, isBigMobile } = useWindowWidth();
  const { account, chainsData, signature } = useNEST();
  const defaultTokenPair = useMemo(() => {
    let code = getQueryVariable("pt");
    if (code) {
      const num = priceToken.filter(
        (item) => item.toLocaleLowerCase() === code!.toLocaleLowerCase()
      );
      if (num && num.length > 0) {
        return code.toLocaleUpperCase();
      }
    }
    return "ETH";
  }, []);
  const [tokenPair, setTokenPair] = useState(defaultTokenPair);
  const [basePrice, setBasePrice] = useState<FuturesPrice>();
  const [orderPrice, setOrderPrice] = useState<FuturesPrice>();
  const [pOrderListV2, setPOrderListV2] = useState<Array<FuturesOrderService>>(
    []
  );
  const [limitOrderList, setLimitOrderList] = useState<
    Array<FuturesOrderService>
  >([]);
  const [historyList, setHistoryList] = useState<Array<FuturesHistoryService>>(
    []
  );
  const [showNotice, setShowNotice] = useState<boolean>(true);

  const getPrice = useCallback(async () => {
    const listPriceBase: { [key: string]: any } = await getPriceList();

    const ETHPrice = listPriceBase
      ? listPriceBase["value"]["ETHUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const BTCPrice = listPriceBase
      ? listPriceBase["value"]["BTCUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const BNBPrice = listPriceBase
      ? listPriceBase["value"]["BNBUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const MATICPrice = listPriceBase
      ? listPriceBase["value"]["MATICUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const ADAPrice = listPriceBase
      ? listPriceBase["value"]["ADAUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const DOGEPrice = listPriceBase
      ? listPriceBase["value"]["DOGEUSDT"].toString().stringToBigNumber(18)
      : undefined;
    const XRPPrice = listPriceBase
      ? listPriceBase["value"]["XRPUSDT"].toString().stringToBigNumber(18)
      : undefined;

    if (
      ETHPrice &&
      BTCPrice &&
      BNBPrice &&
      MATICPrice &&
      ADAPrice &&
      DOGEPrice &&
      XRPPrice
    ) {
      const newPrice: FuturesPrice = {
        ETH: ETHPrice,
        BTC: BTCPrice,
        BNB: BNBPrice,
        MATIC: MATICPrice,
        ADA: ADAPrice,
        DOGE: DOGEPrice,
        XRP: XRPPrice,
      };
      return newPrice;
    } else {
      return undefined;
    }
  }, []);

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
        setLimitOrderList(orderList);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account.address, chainsData.chainId, signature]);
  const getHistoryList = useCallback(async () => {
    try {
      if (!chainsData.chainId || !account.address || !signature) {
        return;
      }
      const baseList = await futuresHistory(
        account.address,
        chainsData.chainId
      );
      console.log(baseList);
      if (Number(baseList["errorCode"]) === 0) {
        const list: Array<FuturesHistoryService> = baseList["value"].map(
          (item: { [x: string]: any }) => {
            return {
              actualMargin: item["actualMargin"],
              actualRate: item["actualRate"],
              appendMargin: item["appendMargin"],
              index: item["index"],
              initialMargin: item["initialMargin"],
              lastPrice: item["lastPrice"],
              leverage: item["leverage"],
              openPrice: item["openPrice"],
              orderType: item["orderType"],
              orientation: item["orientation"],
              owner: item["owner"],
              sl: item["sl"],
              sp: item["sp"],
              time: item["time"],
              tokenPair: item["tokenPair"],
            };
          }
        );
        setHistoryList(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account.address, chainsData.chainId, signature]);
  const handleUpdateList = useCallback(() => {
    getList();
    getHistoryList();
  }, [getHistoryList, getList]);

  // update base price 1s
  useEffect(() => {
    const time = setInterval(() => {
      (async () => {
        const newPrice = await getPrice();
        setBasePrice(newPrice);
      })();
    }, 1000);
    return () => {
      clearInterval(time);
    };
  }, [getPrice]);
  // update order price 15s
  useEffect(() => {
    const getOrderPrice = async () => {
      const newPrice = await getPrice();
      setOrderPrice(newPrice);
    };
    getOrderPrice();
    const time = setInterval(() => {
      getOrderPrice();
    }, UPDATE_PRICE * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getPrice]);
  // update list
  useEffect(() => {
    getList();
    getHistoryList();
    const time = setInterval(() => {
      getList();
      getHistoryList();
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getHistoryList, getList]);

  const paddingY = useMemo(() => {
    return isBigMobile ? 0 : 24;
  }, [isBigMobile]);
  const paddingX = useMemo(() => {
    return isBigMobile ? 0 : 40;
  }, [isBigMobile]);

  const exchangeTvChart = useCallback(() => {
    return (
      <ExchangeTVChart
        tokenPair={tokenPair}
        basePrice={basePrice}
        changeTokenPair={(value: string) => setTokenPair(value)}
      />
    );
  }, [tokenPair, basePrice]);

  const orderList = useCallback(() => {
    return (
      <FuturesOrderList
        price={orderPrice}
        pOrderListV2={pOrderListV2}
        limitOrderList={limitOrderList}
        historyList={historyList}
        updateList={handleUpdateList}
      />
    );
  }, [handleUpdateList, historyList, limitOrderList, orderPrice, pOrderListV2]);
  const newOrder = useCallback(() => {
    return (
      <FuturesNewOrder
        price={basePrice}
        tokenPair={tokenPair}
        updateList={handleUpdateList}
      />
    );
  }, [basePrice, handleUpdateList, tokenPair]);
  const moreInfo = useCallback(() => {
    return <FuturesMoreInfo />;
  }, []);
  const notice = useMemo(() => {
    return !showNotice ? (
      <></>
    ) : (
      <FuturesNotice
        onClose={() => {
          setShowNotice(false);
        }}
      />
    );
  }, [showNotice]);

  const mainView = useMemo(() => {
    switch (width) {
      case WidthType.xl:
      case WidthType.xxl:
        return (
          <Stack direction={"row"} justifyContent={"center"} paddingX={"40px"}>
            <Stack
              spacing={"16px"}
              width={"100%"}
              maxWidth={"1600px"}
              paddingY={`${paddingY}px`}
            >
              {notice}
              <Stack
                direction={"row"}
                spacing={"16px"}
                width={"100%"}
                maxWidth={"1600px"}
              >
                <Stack spacing={"16px"} width={"100%"}>
                  {exchangeTvChart()}
                  {orderList()}
                </Stack>
                <Stack spacing={"16px"} width={"450px"}>
                  {newOrder()}
                  {moreInfo()}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        );
      default:
        return (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            paddingX={`${paddingX}px`}
          >
            <Stack spacing={"16px"} width={"100%"} paddingY={`${paddingY}px`}>
              {notice}

              {exchangeTvChart()}
              {newOrder()}
              {isBigMobile ? <></> : moreInfo()}
              {orderList()}
            </Stack>
          </Stack>
        );
    }
  }, [
    width,
    paddingY,
    notice,
    exchangeTvChart,
    orderList,
    newOrder,
    moreInfo,
    paddingX,
    isBigMobile,
  ]);

  return <>{mainView}</>;
};

export default Futures;
