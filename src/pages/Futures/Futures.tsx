import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers/lib/ethers";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useReadFuturesPrice from "../../contracts/Read/useReadFutureContract";
import useNEST from "../../hooks/useNEST";
import useWindowWidth, { WidthType } from "../../hooks/useWindowWidth";
import { getQueryVariable } from "../../lib/queryVaribale";
import SharePositionModal from "./Modal/SharePositionModal";
import FuturesMoreInfo from "./MoreInfo";
import FuturesNewOrder from "./NewOrder";
import FuturesOrderList from "./OrderList";
import FuturesPriceTable from "./PriceTable";

export interface FuturesPrice {
  [key: string]: BigNumber;
}
const UPDATE_PRICE = 30;
export const priceToken = ["ETH", "BTC", "BNB"];
const Futures: FC = () => {
  const { account } = useNEST();
  const { width, isBigMobile } = useWindowWidth();
  const [tokenPair, setTokenPair] = useState("ETH");
  const [openSharePosition, setOpenSharePosition] = useState<boolean>(false);
  const priceToken = useMemo(() => {
    return ["ETH", "BTC", "BNB"];
  }, []);
  const { futuresPrice: ETHPrice, futuresPriceRefetch: ETHPriceRefetch } =
    useReadFuturesPrice(priceToken.indexOf("ETH"));
  const { futuresPrice: BTCPrice, futuresPriceRefetch: BTCPriceRefetch } =
    useReadFuturesPrice(priceToken.indexOf("BTC"));
  const { futuresPrice: BNBPrice, futuresPriceRefetch: BNBPriceRefetch } =
    useReadFuturesPrice(priceToken.indexOf("BNB"));
  const price = useMemo(() => {
    if (ETHPrice && BTCPrice && BNBPrice) {
      const newPrice: FuturesPrice = {
        ETH: ETHPrice,
        BTC: BTCPrice,
        BNB: BNBPrice,
      };
      return newPrice;
    } else {
      return undefined;
    }
  }, [BNBPrice, BTCPrice, ETHPrice]);
  useEffect(() => {
    const time = setInterval(() => {
      ETHPriceRefetch();
      BTCPriceRefetch();
      BNBPriceRefetch();
    }, UPDATE_PRICE * 1000);
    return () => {
      clearInterval(time);
    };
  }, [BNBPriceRefetch, BTCPriceRefetch, ETHPriceRefetch, account.address]);
  useEffect(() => {
    let code = getQueryVariable("pt");
    if (code) {
      const num = priceToken.filter(
        (item) => item.toLocaleLowerCase() === code!.toLocaleLowerCase()
      );
      if (num && num.length > 0) {
        setOpenSharePosition(true);
      }
    }
  }, [priceToken]);
  const paddingY = useMemo(() => {
    return isBigMobile ? 0 : 24;
  }, [isBigMobile]);
  const paddingX = useMemo(() => {
    return isBigMobile ? 0 : 40;
  }, [isBigMobile]);
  const priceTable = useCallback(() => {
    return (
      <FuturesPriceTable
        price={price}
        tokenPair={tokenPair}
        changeTokenPair={(value: string) => setTokenPair(value)}
      />
    );
  }, [price, tokenPair]);
  const orderList = useCallback(() => {
    return <FuturesOrderList price={price} />;
  }, [price]);
  const newOrder = useCallback(() => {
    return <FuturesNewOrder price={price} tokenPair={tokenPair} />;
  }, [price, tokenPair]);
  const moreInfo = useCallback(() => {
    return <FuturesMoreInfo />;
  }, []);
  const sharePositionModal = useMemo(() => {
    return (
      <SharePositionModal
        open={openSharePosition}
        price={price}
        onClose={() => setOpenSharePosition(false)}
      />
    );
  }, [openSharePosition, price]);

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
                {priceTable()}
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
              {priceTable()}
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
    priceTable,
    width,
  ]);
  return (
    <>
      {sharePositionModal}
      {mainView}
    </>
  );
};

export default Futures;
