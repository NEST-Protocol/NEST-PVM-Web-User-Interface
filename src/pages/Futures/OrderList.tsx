import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers";
import { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  FuturesOrder,
  FuturesLimitOrder,
  HistoryIcon,
} from "../../components/icons";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import useWindowWidth from "../../hooks/useWindowWidth";
import OrderList from "./Components/OrderList";
import OrderTable from "./Components/OrderTable";
import POrderList from "./Components/POrderList";
import POrderTable from "./Components/POrderTable";
import { FuturesPrice } from "./Futures";
import AddModal from "./Modal/AddModal";
import CloseModal from "./Modal/CloseModal";
import EditLimitModal from "./Modal/EditLimitModal";
import EditPositionModal from "./Modal/EditPositionModal";
import { styled } from "@mui/material/styles";
import { Trans } from "@lingui/macro";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "../../hooks/useTransactionReceipt";
import { SnackBarType } from "../../components/SnackBar/NormalSnackBar";
import HistoryTable from "./Components/HistoryTable";
import { FuturesHistoryService } from "../../hooks/useFuturesHistory";
import HistoryList from "./Components/HistoryList";

export interface FuturesOrderService {
  id: number;
  timestamp: number;
  walletAddress: string;
  chainId: number;
  product: string;
  leverage: number;
  orderPrice: number;
  limitPrice: number;
  direction: boolean;
  margin: number;
  append: number;
  balance: number;
  fees: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  status: number;
  copy: boolean;
}

interface FuturesOrderListProps {
  price: FuturesPrice | undefined;
  pOrderListV2: FuturesOrderService[];
  limitOrderList: FuturesOrderService[];
  historyList: FuturesHistoryService[];
  updateList: () => void;
}

export enum FuturesModalType {
  add,
  trigger,
  close,
  editLimit,
  closeLimit,
}
export interface FuturesModalInfo {
  data: FuturesOrderService;
  type: FuturesModalType;
}

export interface FuturesHideOrderModalInfo {
  orderIndex: BigNumber;
  hash: string;
}

export const NoOrderMobile = styled(Box)(({ theme }) => ({
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
  const setModalInfoValue = (value: FuturesModalInfo) => {
    setModalInfo(value);
  };
  const [tabsValue, setTabsValue] = useState(0);
  const { addTransactionNotice } = usePendingTransactionsBase();
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

  const orderList = useMemo(() => {
    if (tabsValue === 0 && width > 890) {
      return (
        <POrderTable
          dataArray={props.pOrderListV2}
          closeOrder={[]}
          price={props.price}
          buttonCallBack={setModalInfoValue}
        />
      );
    } else if (tabsValue === 1 && width > 890) {
      return (
        <OrderTable
          dataArray={props.limitOrderList}
          buttonCallBack={setModalInfoValue}
          updateList={props.updateList}
        />
      );
    } else if (tabsValue === 2 && width > 890) {
      return (
        <HistoryTable dataArray={props.historyList} buttonCallBack={() => {}} />
      );
    } else if (tabsValue === 0) {
      const noOrder = props.pOrderListV2.length === 0;
      return (
        <Stack
          spacing={"16px"}
          sx={{
            marginTop: "16px",
            paddingX: isBigMobile ? "20px" : "0px",
            paddingBottom: "24px",
          }}
        >
          {props.pOrderListV2.map((item, index) => {
            return (
              <POrderList
                key={`POrderList + ${index}`}
                data={item}
                price={props.price}
                buttonCallBack={setModalInfoValue}
              />
            );
          })}
          {noOrder ? (
            <NoOrderMobile>
              <Trans>No Orders</Trans>
            </NoOrderMobile>
          ) : (
            <></>
          )}
        </Stack>
      );
    } else if (tabsValue === 1) {
      const noOrder = props.limitOrderList.length === 0;
      return (
        <Stack
          spacing={"16px"}
          sx={{
            marginTop: "16px",
            paddingX: isBigMobile ? "20px" : "0px",
            paddingBottom: "24px",
          }}
        >
          {props.limitOrderList.map((item, index) => {
            return (
              <OrderList
                key={`OrderList + ${index}`}
                data={item}
                buttonCallBack={setModalInfoValue}
                updateList={props.updateList}
              />
            );
          })}
          {noOrder ? (
            <NoOrderMobile>
              <Trans>No Orders</Trans>
            </NoOrderMobile>
          ) : (
            <></>
          )}
        </Stack>
      );
    } else if (tabsValue === 2) {
      const noOrder = props.historyList.length === 0;
      return (
        <Stack
          spacing={"16px"}
          sx={{
            marginTop: "16px",
            paddingX: isBigMobile ? "20px" : "0px",
            paddingBottom: "24px",
          }}
        >
          {props.historyList.map((item, index) => {
            return (
              <HistoryList
                key={`HistoryList + ${index}`}
                data={item}
                buttonCallBack={setModalInfoValue}
              />
            );
          })}
          {noOrder ? (
            <NoOrderMobile>
              <Trans>No Orders</Trans>
            </NoOrderMobile>
          ) : (
            <></>
          )}
        </Stack>
      );
    }
  }, [
    isBigMobile,
    props.historyList,
    props.limitOrderList,
    props.pOrderListV2,
    props.price,
    props.updateList,
    tabsValue,
    width,
  ]);

  const tabs = useMemo(() => {
    const orderTabsData = [
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        {/* <FuturesOrder /> */}
        <p>
          <Trans>Positions</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        {/* <FuturesLimitOrder /> */}
        <p>
          <Trans>Orders</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        {/* <HistoryIcon /> */}
        <p>
          <Trans>History</Trans>
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
        isFull={false}
      />
    );
  }, [tabsValue]);

  const addModal = useMemo(() => {
    if (modalInfo && modalInfo.type === FuturesModalType.close) {
      return (
        <>
          <CloseModal
            data={modalInfo.data}
            price={props.price}
            open={true}
            onClose={(res?: boolean) => {
              if (res !== undefined) {
                addTransactionNotice({
                  type: TransactionType.futures_sell,
                  info: "",
                  result: res ? SnackBarType.success : SnackBarType.fail,
                });
                props.updateList();
              }
              setModalInfo(undefined);
            }}
          />
        </>
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.add) {
      return (
        <AddModal
          data={modalInfo.data}
          price={props.price}
          open={true}
          onClose={(res?: boolean) => {
            if (res !== undefined) {
              addTransactionNotice({
                type: TransactionType.futures_add,
                info: "",
                result: res ? SnackBarType.success : SnackBarType.fail,
              });
              props.updateList();
            }
            setModalInfo(undefined);
          }}
        />
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.editLimit) {
      return (
        <EditLimitModal
          data={modalInfo.data}
          open={true}
          onClose={(res?: boolean) => {
            if (res !== undefined) {
              addTransactionNotice({
                type: TransactionType.futures_editLimit,
                info: "",
                result: res ? SnackBarType.success : SnackBarType.fail,
              });
              props.updateList();
            }
            setModalInfo(undefined);
          }}
        />
      );
    } else if (modalInfo && modalInfo.type === FuturesModalType.trigger) {
      return (
        <EditPositionModal
          data={modalInfo.data}
          price={props.price}
          open={true}
          onClose={(res?: boolean) => {
            if (res !== undefined) {
              addTransactionNotice({
                type: TransactionType.futures_editPosition,
                info: "",
                result: res ? SnackBarType.success : SnackBarType.fail,
              });
              props.updateList();
            }
            setModalInfo(undefined);
          }}
        />
      );
    } else {
      return <></>;
    }
  }, [addTransactionNotice, modalInfo, props]);
  return (
    <Stack spacing={"16px"} width={"100%"} ref={ref}>
      {addModal}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
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
