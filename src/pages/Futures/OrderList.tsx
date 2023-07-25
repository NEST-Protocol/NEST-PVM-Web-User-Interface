import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers";
import { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FuturesOrder, FuturesLimitOrder } from "../../components/icons";
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
}

interface FuturesOrderListProps {
  price: FuturesPrice | undefined;
  pOrderListV2: FuturesOrderService[];
  limitOrderList: FuturesOrderService[];
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
        />
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
              <Trans>No Order</Trans>
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
    props.limitOrderList,
    props.pOrderListV2,
    props.price,
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
