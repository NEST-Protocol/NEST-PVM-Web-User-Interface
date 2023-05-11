import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers";
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FuturesOrder, FuturesLimitOrder } from "../../components/icons";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import useFuturesOrderList, {
  FuturesOrderV2,
} from "../../hooks/useFuturesOrderList";
import useWindowWidth from "../../hooks/useWindowWidth";
import OrderList from "./Components/OrderList";
import OrderTable from "./Components/OrderTable";
import POrderList, { POrderCloseList } from "./Components/POrderList";
import POrderTable from "./Components/POrderTable";
import { FuturesPrice, priceToken } from "./Futures";
import AddModal from "./Modal/AddModal";
import CloseModal from "./Modal/CloseModal";
import CloseOrderNoticeModal from "./Modal/CloseOrderNoticeModal";
import EditLimitModal from "./Modal/EditLimitModal";
import EditPositionModal from "./Modal/EditPositionModal";
import { styled } from "@mui/material/styles";
import { getQueryVariable } from "../../lib/queryVaribale";
import SharePositionModal from "./Modal/SharePositionModal";
import useNEST from "../../hooks/useNEST";
import { Trans } from "@lingui/macro";

interface FuturesOrderListProps {
  price: FuturesPrice | undefined;
}

export enum FuturesModalType {
  add,
  trigger,
  close,
  editLimit,
  closeLimit,
}
export interface FuturesModalInfo {
  data: FuturesOrderV2;
  type: FuturesModalType;
}

export interface FuturesHideOrderModalInfo {
  orderIndex: BigNumber;
  hash: string;
}

const NoOrderMobile = styled(Box)(({ theme }) => ({
  borderRadius: "12px",
  width: "100%",
  height: "60px",
  lineHeight: "60px",
  textAlign: "center",
  background: theme.normal.bg1,
  color: theme.normal.text2,
  fontWeight: 400,
  fontSize: 12,
}));

const FuturesOrderList: FC<FuturesOrderListProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();
  const [modalInfo, setModalInfo] = useState<FuturesModalInfo>();
  const [hideOrderModalInfo, setHideOrderModalInfo] =
    useState<FuturesHideOrderModalInfo>();
  const setModalInfoValue = (value: FuturesModalInfo) => {
    setModalInfo(value);
  };
  const [tabsValue, setTabsValue] = useState(0);
  const {
    pOrderList,
    orderList: limitOrderList,
    showClosedOrder,
    hideOrder,
  } = useFuturesOrderList();
  const { openedSharePosition, setOpenedSharePosition } = useNEST();
  const [openSharePosition, setOpenSharePosition] = useState<boolean>(false);
  useEffect(() => {
    let code = getQueryVariable("pt");
    if (code) {
      const num = priceToken.filter(
        (item) => item.toLocaleLowerCase() === code!.toLocaleLowerCase()
      );
      if (num && num.length > 0 && !openedSharePosition) {
        setOpenSharePosition(true);
        setTabsValue(1);
      }
    }
  }, [openedSharePosition]);

  const sharePositionModal = useMemo(() => {
    return (
      <SharePositionModal
        open={openSharePosition}
        price={props.price}
        onClose={() => {
          setOpenSharePosition(false);
          setOpenedSharePosition(true);
        }}
      />
    );
  }, [openSharePosition, props.price, setOpenedSharePosition]);
  /**
   * this width
   */
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current["offsetWidth"]);
    }
  }, []);

  const showHideAlert = useCallback((orderIndex: BigNumber, hash: string) => {
    setHideOrderModalInfo({
      orderIndex: orderIndex,
      hash: hash,
    });
  }, []);

  const orderList = useMemo(() => {
    if (tabsValue === 0 && width > 890) {
      return (
        <POrderTable
          dataArray={pOrderList}
          closeOrder={showClosedOrder}
          hideOrder={showHideAlert}
          price={props.price}
          buttonCallBack={setModalInfoValue}
        />
      );
    } else if (tabsValue === 1 && width > 890) {
      return (
        <OrderTable
          dataArray={limitOrderList}
          buttonCallBack={setModalInfoValue}
        />
      );
    } else if (tabsValue === 0) {
      const noOrder = pOrderList.length === 0 && showClosedOrder.length === 0;
      return (
        <Stack
          spacing={"16px"}
          sx={{
            marginTop: "16px",
            paddingX: isBigMobile ? "20px" : "0px",
            paddingBottom: "24px",
          }}
        >
          {pOrderList.map((item, index) => {
            return (
              <POrderList
                key={`POrderList + ${index}`}
                data={item}
                price={props.price}
                buttonCallBack={setModalInfoValue}
              />
            );
          })}
          {showClosedOrder.map((item, index) => {
            return (
              <POrderCloseList
                key={`POrderCloseList + ${index}`}
                data={item}
                price={props.price}
                hideOrder={showHideAlert}
              />
            );
          })}
          {noOrder ? (
            <NoOrderMobile>
              <Trans>No Order</Trans>
            </NoOrderMobile>
          ) : (
            <></>
          )}
        </Stack>
      );
    } else if (tabsValue === 1) {
      const noOrder = limitOrderList.length === 0;
      return (
        <Stack
          spacing={"16px"}
          sx={{
            marginTop: "16px",
            paddingX: isBigMobile ? "20px" : "0px",
            paddingBottom: "24px",
          }}
        >
          {limitOrderList.map((item, index) => {
            return (
              <OrderList
                key={`OrderList + ${index}`}
                data={item}
                buttonCallBack={setModalInfoValue}
              />
            );
          })}
          {noOrder ? (
            <NoOrderMobile>
              <Trans>No Order</Trans>
            </NoOrderMobile>
          ) : (
            <></>
          )}
        </Stack>
      );
    }
  }, [
    isBigMobile,
    limitOrderList,
    pOrderList,
    props.price,
    showClosedOrder,
    showHideAlert,
    tabsValue,
    width,
  ]);

  const tabs = useMemo(() => {
    const orderTabsData = [
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <FuturesOrder />
        <p>
          <Trans>Positions</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <FuturesLimitOrder />
        <p>
          <Trans>Order</Trans>
        </p>
      </Stack>,
    ];
    return (
      <NESTTabs
        value={tabsValue}
        className={"FuturesOrderTabs"}
        datArray={orderTabsData}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={isBigMobile}
      />
    );
  }, [isBigMobile, tabsValue]);

  const addModal = useMemo(() => {
    if (modalInfo && modalInfo.type === FuturesModalType.close) {
      return (
        <CloseModal
          data={modalInfo.data}
          price={props.price}
          open={true}
          onClose={() => setModalInfo(undefined)}
        />
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.add) {
      return (
        <AddModal
          data={modalInfo.data}
          price={props.price}
          open={true}
          onClose={() => setModalInfo(undefined)}
        />
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.editLimit) {
      return (
        <EditLimitModal
          data={modalInfo.data}
          open={true}
          onClose={() => setModalInfo(undefined)}
        />
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.trigger) {
      return (
        <EditPositionModal
          data={modalInfo.data}
          price={props.price}
          open={true}
          onClose={() => setModalInfo(undefined)}
        />
      );
    } else {
      return <></>;
    }
  }, [modalInfo, props.price]);
  return (
    <Stack spacing={"16px"} width={"100%"} ref={ref}>
      {sharePositionModal}
      {addModal}
      <Modal
        open={hideOrderModalInfo !== undefined}
        onClose={() => setHideOrderModalInfo(undefined)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CloseOrderNoticeModal
            hideOrder={hideOrder}
            onClose={() => setHideOrderModalInfo(undefined)}
            orderIndex={hideOrderModalInfo?.orderIndex}
            hash={hideOrderModalInfo?.hash}
          />
        </Box>
      </Modal>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        sx={(theme) => ({
          paddingX: "20px",
          height: "44px",
          width: "100%",
          borderBottom: `1px solid ${theme.normal.border}`,
          boxSizing: "border-box",
        })}
      >
        {tabs}
      </Stack>
      {orderList}
    </Stack>
  );
};

export default FuturesOrderList;
