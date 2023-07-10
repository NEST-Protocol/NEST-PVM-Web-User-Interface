import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers/lib/ethers";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useWindowWidth, { WidthType } from "../../hooks/useWindowWidth";
import FuturesMoreInfo from "./MoreInfo";
import FuturesNewOrder from "./NewOrder";
import FuturesOrderList from "./OrderList";
import ExchangeTVChart from "./ExchangeTVChart";
import { getPriceFromNESTLocal } from "../../lib/NESTRequest";
// import FuturesNotice from "./Components/FuturesNotice";
import { getQueryVariable } from "../../lib/queryVaribale";
import Modal from "@mui/material/Modal";
import StopTransactionModal from "../Share/Modal/StopTransactionModal";
import Box from "@mui/material/Box";
import FuturesNotice from "./Components/FuturesNotice";
import ChangeNewTokenModal from "../Share/Modal/ChangeNewTokenModal";
import useNEST from "../../hooks/useNEST";

export interface FuturesPrice {
  [key: string]: BigNumber;
}
const UPDATE_PRICE = 15;
export const priceToken = ["ETH", "BTC", "BNB", "MATIC", "ADA", "DOGE", "XRP"];
const Futures: FC = () => {
  const { width, isBigMobile } = useWindowWidth();
  const {account} = useNEST()
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
  // const showNoticeDefault = useMemo(() => {
  //   const isShow = localStorage.getItem("FuturesNoticeChangeToken");
  //   return isShow !== "1";
  // }, []);
  const [showNotice, setShowNotice] = useState<boolean>(true);
  // TODO
  const [openModal, setOpenModal] = useState(false);
  const openChangeModalDefault = useMemo(() => {
    if (account) {
      const isShow = localStorage.getItem("ChangeToken");
      return isShow !== "1";
    } else {
      return false
    }
  }, [account]);
  const [openChangeModal, setOpenChangeModal] = useState(
    openChangeModalDefault
  );

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
    const MATICPriceBase: { [key: string]: string } =
      await getPriceFromNESTLocal("matic");
    const ADAPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "ada"
    );
    const DOGEPriceBase: { [key: string]: string } =
      await getPriceFromNESTLocal("doge");
    const XRPPriceBase: { [key: string]: string } = await getPriceFromNESTLocal(
      "xrp"
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
    const MATICPrice = MATICPriceBase
      ? MATICPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const ADAPrice = ADAPriceBase
      ? ADAPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const DOGEPrice = DOGEPriceBase
      ? DOGEPriceBase["value"].toString().stringToBigNumber(18)
      : undefined;
    const XRPPrice = XRPPriceBase
      ? XRPPriceBase["value"].toString().stringToBigNumber(18)
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
  // useEffect(() => {
  //   let code = getQueryVariable("pt");
  //   if (code) {
  //     const num = priceToken.filter(
  //       (item) => item.toLocaleLowerCase() === code!.toLocaleLowerCase()
  //     );
  //     if (num && num.length > 0) {
  //       setTokenPair(code.toLocaleUpperCase());
  //     } else {
  //       setTokenPair('ETH');
  //     }
  //   }
  // }, []);
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

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <StopTransactionModal onClose={() => setOpenModal(false)} />
        </Box>
      </Modal>
      <Modal
        open={openChangeModal}
        onClose={() => setOpenChangeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <ChangeNewTokenModal
            onClose={() => {
              
              setOpenChangeModal(false);
              
            }}
          />
        </Box>
      </Modal>
      {mainView}
    </>
  );
};

export default Futures;
