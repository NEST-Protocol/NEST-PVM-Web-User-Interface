import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, useMemo } from "react";
import { Share } from "../../../components/icons";
import ShareMyOrderModal from "../../Dashboard/Modal/ShareMyOrderModal";
import { FuturesModalInfo } from "../OrderList";
import FuturesOrderShare from "./FuturesOrderShare";
import OrderTablePosition from "./OrderTablePosition";
import FuturesTableTitle from "./TableTitle";
import { Trans, t } from "@lingui/macro";
import useFuturesHistory, {
  FuturesHistoryService,
} from "../../../hooks/useFuturesHistory";

interface FuturesHistoryListProps {
  dataArray: Array<FuturesHistoryService>;
  buttonCallBack: (value: FuturesModalInfo) => void;
  style?: React.CSSProperties;
}

const HistoryTable: FC<FuturesHistoryListProps> = ({ ...props }) => {
  const rows = props.dataArray.map((item, index) => {
    return (
      <HistoryTableRow
        key={`HistoryTable + ${index}`}
        data={item}
        buttonCallBack={props.buttonCallBack}
      />
    );
  });
  const noOrder = useMemo(() => {
    return props.dataArray.length === 0;
  }, [props.dataArray.length]);

  return (
    <FuturesTableTitle
      dataArray={[
        t`Symbol`,
        t`Actual Margin`,
        t`Liq Price`,
        t`Stop Order`,
        t`Close Price`,
        t`Time`,
        t`Operate`,
      ]}
      noOrder={noOrder}
      helps={[]}
      style={props.style}
      noNeedPadding
    >
      {rows}
    </FuturesTableTitle>
  );
};

const tdNoPadding = {
  padding: "0px !important",
};

interface HistoryTableRowProps {
  data: FuturesHistoryService;
  buttonCallBack: (value: FuturesModalInfo) => void;
}
const HistoryTableRow: FC<HistoryTableRowProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    tp,
    sl,
    showLiqPrice,
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
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <ShareMyOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
        isClosed={false}
      />
      <TableCell>
        <OrderTablePosition
          tokenName={tokenName}
          isLong={isLong}
          lever={lever}
        />
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          direction={"row"}
          spacing={"4px"}
          alignItems={"flex-end"}
          sx={(theme) => ({
            "& p": {
              fontWeight: 700,
              fontSize: 14,
              color: theme.normal.text0,
            },
            "& span": {
              display: "block",
              fontWeight: 400,
              fontSize: 10,
              color: isRed ? theme.normal.danger : theme.normal.success,
            },
          })}
        >
          <p>{showMarginAssets}NEST</p>
          <span>{showPercent}%</span>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showLiqPrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          spacing={"4px"}
          sx={(theme) => ({
            "& p": {
              fontSize: 12,
              fontWeight: 400,
              color: theme.normal.text0,
            },
            "& span": { marginRight: "4px", color: theme.normal.text2 },
          })}
        >
          <Box component={"p"}>
            <span>
              <Trans>TP</Trans>
            </span>
            {tp}USDT
          </Box>
          <Box component={"p"}>
            <span>
              <Trans>SL</Trans>
            </span>
            {sl}USDT
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack direction={"row"}>
          <Stack spacing={"4px"}>
            <Box
              component={"p"}
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: 14,
                color: theme.normal.text0,
              })}
            >
              {showClosePrice}USDT
            </Box>
            <Box
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: "10px",
                lineHeight: "14px",
                padding: "3px 4px",
                border: "1px solid",
                width: "auto",
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
              {props.data.orderType === "Liquidated" && (
                <Trans>Liquidated</Trans>
              )}
              {props.data.orderType === "TP Executed" && (
                <Trans>TP Executed</Trans>
              )}
              {props.data.orderType === "SL Executed" && (
                <Trans>SL Executed</Trans>
              )}
            </Box>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 400,
            fontSize: 12,
            color: theme.normal.text0,
          })}
        >
          {time}
        </Box>
      </TableCell>
      <TableCell>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
          <FuturesOrderShare
            component={"button"}
            onClick={() => setShowShareOrderModal(true)}
          >
            <Share />
          </FuturesOrderShare>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default HistoryTable;
