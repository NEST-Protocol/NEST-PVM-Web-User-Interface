import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers";
import { FC } from "react";
import { Close } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import { NESTTooltipFC } from "../../../components/NESTTooltip/NESTTooltip";
import { FuturesOrderV2 } from "../../../hooks/useFuturesOrderList";
import useFuturesPOrder from "../../../hooks/useFuturesPOrder";
import useFuturesPOrderClose from "../../../hooks/useFuturesPOrderClose";
import ShareMyOrderModal from "../../Dashboard/Modal/ShareMyOrderModal";
import { FuturesPrice } from "../Futures";
import { FuturesModalInfo, FuturesModalType } from "../OrderList";
import FuturesOrderListInfo, {
  FuturesOrderListInfoMain,
} from "./FuturesOrderListInfo";
import OrderListPosition from "./OrderListPosition";
import { Trans, t } from "@lingui/macro";

interface POrderListProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  buttonCallBack: (value: FuturesModalInfo) => void;
}

const POrderList: FC<POrderListProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    showTriggerTitle,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  } = useFuturesPOrder(props.data, props.price);

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
        isClosed={false}
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
            <Box component={"p"}>{showBasePrice}USDT</Box>
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
              <Box component={"p"}>Liq Price</Box>
              <NESTTooltipFC
                title={
                  <p>
                    <Trans>
                      Due to the market volatility, the actual liquidation price
                      may be different from the theoretical liquidation price .
                      Here is the theoretical liquidation price, for reference
                      only.
                    </Trans>
                  </p>
                }
              />
            </Stack>
            <Box component={"p"}>{showLiqPrice}USDT</Box>
          </FuturesOrderListInfo>
        </Stack>
      </Stack>
      <Stack direction={"row"} spacing={"8px"}>
        <MainButton
          title={t`Add`}
          onClick={() =>
            props.buttonCallBack({
              data: props.data,
              type: FuturesModalType.add,
            })
          }
          style={{ height: "40px", fontSize: 14 }}
        />
        <MainButton
          title={showTriggerTitle}
          onClick={() =>
            props.buttonCallBack({
              data: props.data,
              type: FuturesModalType.trigger,
            })
          }
          style={{ height: "40px", fontSize: 14 }}
        />
        <MainButton
          title={t`Close`}
          onClick={() =>
            props.buttonCallBack({
              data: props.data,
              type: FuturesModalType.close,
            })
          }
          style={{ height: "40px", fontSize: 14 }}
        />
      </Stack>
    </Stack>
  );
};

interface POrderCloseListProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  hideOrder: (orderIndex: BigNumber, hash: string) => void;
}

export const POrderCloseList: FC<POrderCloseListProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showTitle,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  } = useFuturesPOrderClose(props.data, props.price);

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
        isClosed={false}
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
            <Box component={"p"}>{showBasePrice}USDT</Box>
          </FuturesOrderListInfoMain>
          <FuturesOrderListInfoMain spacing={"4px"} width={"100%"}>
            <Box component={"p"}>
              <Trans>Actual Margin</Trans>
            </Box>
            <Stack
              direction={"row"}
              spacing={"4px"}
              alignItems={"center"}
              component={"p"}
            >
              <span>{showMarginAssets}NEST</span>
              <span className={isRed ? "Short" : "Long"}>{showPercent}%</span>
            </Stack>
          </FuturesOrderListInfoMain>
        </Stack>
        <NESTLine />
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
        <Stack direction={"row"} justifyContent={"space-around"}>
          <FuturesOrderListInfo
            direction={"row"}
            spacing={"4px"}
            width={"100%"}
          >
            <Box component={"p"}>
              <Trans>Liq Price</Trans>
            </Box>
            <Box component={"p"}>{showLiqPrice}USDT</Box>
          </FuturesOrderListInfo>
        </Stack>
      </Stack>
      <Stack direction={"row"} spacing={"8px"}>
        <Stack
          direction={"row"}
          spacing={"8px"}
          alignItems={"center"}
          justifyContent={"center"}
          component={"button"}
          onClick={() =>
            props.hideOrder(props.data.index, props.data.closeHash ?? "")
          }
          sx={(theme) => ({
            border: `1px solid ${theme.normal.primary_light_active}`,
            borderRadius: "8px",
            width: "100%",
            height: "48px",
            paddingX: "12px",
            fontWeight: 700,
            fontSize: "12px",
            color: theme.normal.primary,
            "& svg": {
              width: "14px",
              height: "14px",
              display: "block",
              "& path": {
                fill: theme.normal.primary,
              },
            },
            "&:hover": {
              cursor: "pointer",
              color: theme.normal.highDark,
              background: theme.normal.primary_hover,
              "& svg path": {
                fill: theme.normal.highDark,
              },
            },
            "&:active": {
              color: theme.normal.highDark,
              background: theme.normal.primary_active,
              "& svg path": {
                fill: theme.normal.highDark,
              },
            },
          })}
        >
          <p>{showTitle}</p>
          <Close />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default POrderList;
