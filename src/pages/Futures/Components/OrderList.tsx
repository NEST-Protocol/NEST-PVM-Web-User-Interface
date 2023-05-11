import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import useFuturesOrder from "../../../hooks/useFuturesOrder";
import { FuturesOrderV2 } from "../../../hooks/useFuturesOrderList";
import ShareNewOrderModal from "../../Dashboard/Modal/ShareNewOrderModal";
import { FuturesModalInfo, FuturesModalType } from "../OrderList";
import FuturesOrderListInfo, {
  FuturesOrderListInfoMain,
} from "./FuturesOrderListInfo";
import OrderListPosition from "./OrderListPosition";
import { Trans, t } from "@lingui/macro";

interface OrderListProps {
  data: FuturesOrderV2;
  buttonCallBack: (value: FuturesModalInfo) => void;
}

const OrderList: FC<OrderListProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    showLimitPrice,
    showBalance,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
    tp,
    sl,
  } = useFuturesOrder(props.data);
  return (
    <Stack
      spacing={"20px"}
      sx={(theme) => ({
        padding: "20px",
        width: "100%",
        borderRadius: "12px",
        background: theme.normal.bg1,
      })}
    >
      <ShareNewOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
      />
      <OrderListPosition
        tokenName={tokenName}
        lever={lever}
        isLong={isLong}
        shareCallBack={() => setShowShareOrderModal(true)}
      />
      <Stack spacing={"8px"}>
        <Stack direction={"row"} justifyContent={"space-around"}>
          <FuturesOrderListInfoMain spacing={"4px"} width={"100%"}>
            <Box component={"p"}>
              <Trans>Open Price</Trans>
            </Box>
            <Box component={"p"}>{showLimitPrice}USDT</Box>
          </FuturesOrderListInfoMain>
          <FuturesOrderListInfoMain spacing={"4px"} width={"100%"}>
            <Box component={"p"}>
              <Trans>Actual Margin</Trans>
            </Box>
            <Stack
              direction={"row"}
              spacing={"4px"}
              alignItems={"flex-end"}
              component={"p"}
            >
              <span>{showBalance}NEST</span>
            </Stack>
          </FuturesOrderListInfoMain>
        </Stack>
      </Stack>
      {!(tp === String().placeHolder && sl === String().placeHolder) ? (
        <Stack direction={"row"} justifyContent={"space-around"}>
          <FuturesOrderListInfo
            direction={"row"}
            spacing={"4px"}
            width={"100%"}
          >
            <Box component={"p"}>
              <Trans>Take Profit</Trans>
            </Box>
            <Box component={"p"}>{tp}USDT</Box>
          </FuturesOrderListInfo>
          <FuturesOrderListInfo
            direction={"row"}
            spacing={"4px"}
            width={"100%"}
          >
            <Box component={"p"}>
              <Trans>Stop Loss</Trans>
            </Box>
            <Box component={"p"}>{sl}USDT</Box>
          </FuturesOrderListInfo>
        </Stack>
      ) : (
        <></>
      )}
      <Stack direction={"row"} spacing={"8px"}>
        <MainButton
          title={t`Edit`}
          onClick={() =>
            props.buttonCallBack({
              data: props.data,
              type: FuturesModalType.editLimit,
            })
          }
          style={{ height: "40px", fontSize: 14 }}
        />
        <MainButton
          title={mainButtonTitle}
          isLoading={mainButtonLoading}
          disable={mainButtonDis}
          onClick={mainButtonAction}
          style={{ height: "40px", fontSize: 14 }}
        />
      </Stack>
    </Stack>
  );
};

export default OrderList;
