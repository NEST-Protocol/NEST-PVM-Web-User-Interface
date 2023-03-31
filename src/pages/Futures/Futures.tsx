import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers/lib/ethers";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useWindowWidth, { WidthType } from "../../hooks/useWindowWidth";
import FuturesMoreInfo from "./MoreInfo";
import FuturesNewOrder from "./NewOrder";
import FuturesOrderList from "./OrderList";
import ExchangeTVChart from "./ExchangeTVChart";
import { getPriceFromNESTLocal } from "../../lib/NESTRequest";

export interface FuturesPrice {
  [key: string]: BigNumber;
}
const UPDATE_PRICE = 15;
export const priceToken = ["ETH", "BTC", "BNB"];
const Futures: FC = () => {
  const { width, isBigMobile } = useWindowWidth();
  const [tokenPair, setTokenPair] = useState("ETH");
  const [basePrice, setBasePrice] = useState<FuturesPrice>();
  const [orderPrice, setOrderPrice] = useState<FuturesPrice>();
  const getPrice = useCallback(async () => {
    const ETHPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "eth"
    );
    const BTCPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "btc"
    );
    const BNBPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "bnb"
    );
    const ETHPrice = ETHPriceBase
      ? ETHPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const BTCPrice = BTCPriceBase
      ? BTCPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const BNBPrice = BNBPriceBase
      ? BNBPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;

    if (ETHPrice && BTCPrice && BNBPrice) {
      const newPrice: FuturesPrice = {
        ETH: ETHPrice,
        BTC: BTCPrice,
        BNB: BNBPrice,
      };
      setBasePrice(newPrice);
    } else {
      setBasePrice(undefined);
    }
  }, []);
  // update base price 2s
  useEffect(() => {
    const time = setInterval(() => {
      getPrice();
    }, 2000);
    return () => {
      clearInterval(time);
    };
  }, [getPrice]);
  // update order price 15s
  useEffect(() => {
    const time = setInterval(() => {
      setOrderPrice(basePrice);
    }, UPDATE_PRICE * 1000);
    return () => {
      clearInterval(time);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return <FuturesOrderList price={orderPrice} />;
  }, [orderPrice]);
  const newOrder = useCallback(() => {
    return <FuturesNewOrder price={basePrice} tokenPair={tokenPair} />;
  }, [basePrice, tokenPair]);
  const moreInfo = useCallback(() => {
    return <FuturesMoreInfo />;
  }, []);

  const mainView = useMemo(() => {
    switch (width) {
      case WidthType.xl:
      case WidthType.xxl:
        return (
          <Stack direction={"row"} justifyContent={"center"} paddingX={"40px"}>
            <Stack
              direction={"row"}
              spacing={"16px"}
              width={"100%"}
              maxWidth={"1600px"}
              paddingY={`${paddingY}px`}
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
        );
      default:
        return (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            paddingX={`${paddingX}px`}
          >
            <Stack spacing={"16px"} width={"100%"} paddingY={`${paddingY}px`}>
              {exchangeTvChart()}
              {newOrder()}
              {isBigMobile ? <></> : moreInfo()}
              {orderList()}
            </Stack>
          </Stack>
        );
    }
  }, [
    isBigMobile,
    moreInfo,
    newOrder,
    orderList,
    paddingX,
    paddingY,
    exchangeTvChart,
    width,
  ]);
  return <>{mainView}</>;
};

export default Futures;
