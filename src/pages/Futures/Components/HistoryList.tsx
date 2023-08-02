import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import NESTLine from "../../../components/NESTLine";
import ShareMyOrderModal from "../../Dashboard/Modal/ShareMyOrderModal";
import { FuturesModalInfo } from "../OrderList";
import FuturesOrderListInfo, {
  FuturesOrderListInfoMain,
} from "./FuturesOrderListInfo";
import OrderListPosition from "./OrderListPosition";
import { Trans } from "@lingui/macro";
import useFuturesHistory, {
  FuturesHistoryService,
} from "../../../hooks/useFuturesHistory";

interface HistoryListProps {
  data: FuturesHistoryService;
  buttonCallBack: (value: FuturesModalInfo) => void;
}

const HistoryList: FC<HistoryListProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    tp,
    sl,
    showOpenPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
    time,
    showClosePrice,
  } = useFuturesHistory(props.data);

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
      <ShareMyOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
        isClosed={true}
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
            <Box component={"p"}>{showOpenPrice}USDT</Box>
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
              <span>{showMarginAssets}NEST</span>
              <span className={isRed ? "Short" : "Long"}>{showPercent}%</span>
            </Stack>
          </FuturesOrderListInfoMain>
        </Stack>
        <NESTLine />
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

        <Stack direction={"row"} justifyContent={"space-around"}>
          <FuturesOrderListInfo
            direction={"row"}
            spacing={"4px"}
            width={"100%"}
          >
            <Stack
              direction={"row"}
              spacing={"4px"}
              alignItems={"center"}
              component={"p"}
            >
              <Box component={"p"}>
                <Trans>Close Price</Trans>
              </Box>
            </Stack>
            <Box component={"p"}>{showClosePrice}USDT</Box>
          </FuturesOrderListInfo>
          <FuturesOrderListInfo
            direction={"row"}
            spacing={"4px"}
            width={"100%"}
          >
            <Stack
              direction={"row"}
              spacing={"4px"}
              alignItems={"center"}
              component={"p"}
            >
              <Box component={"p"}>
                <Trans>Time</Trans>
              </Box>
            </Stack>
            <Box component={"p"}>{time}</Box>
          </FuturesOrderListInfo>
        </Stack>
        <Stack direction={"row"} justifyContent={"flex-start"}>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "10px",
              lineHeight: "14px",
              padding: "3px 4px",
              border: "1px solid",
              width: "fit-content",
              borderColor:
                props.data.orderType === "Closed"
                  ? theme.normal.border
                  : props.data.orderType === "Liquidated"
                  ? theme.normal.danger_light_hover
                  : theme.normal.success_light_hover,
              color:
                props.data.orderType === "Closed"
                  ? theme.normal.text2
                  : props.data.orderType === "Liquidated"
                  ? theme.normal.danger
                  : theme.normal.success,
              borderRadius: "4px",
            })}
          >
            {props.data.orderType === "Closed" && <Trans>Closed</Trans>}
            {props.data.orderType === "Liquidated" && <Trans>Liquidated</Trans>}
            {props.data.orderType === "TP Executed" && (
              <Trans>TP Executed</Trans>
            )}
            {props.data.orderType === "SL Executed" && (
              <Trans>SL Executed</Trans>
            )}
          </Box>
          <Box>{""}</Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HistoryList;
