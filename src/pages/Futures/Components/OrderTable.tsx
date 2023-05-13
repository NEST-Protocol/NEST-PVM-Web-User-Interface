import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, useMemo } from "react";
import { Share } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import useFuturesOrder from "../../../hooks/useFuturesOrder";
import { FuturesOrderV2 } from "../../../hooks/useFuturesOrderList";
import ShareNewOrderModal from "../../Dashboard/Modal/ShareNewOrderModal";
import { FuturesModalInfo, FuturesModalType } from "../OrderList";
import FuturesOrderShare from "./FuturesOrderShare";
import OrderTablePosition from "./OrderTablePosition";
import FuturesTableTitle from "./TableTitle";
import { Trans, t } from "@lingui/macro";

interface FuturesOrderListProps {
  dataArray: Array<FuturesOrderV2>;
  buttonCallBack: (value: FuturesModalInfo) => void;
  style?: React.CSSProperties;
}

const OrderTable: FC<FuturesOrderListProps> = ({ ...props }) => {
  const rows = props.dataArray.map((item, index) => {
    return (
      <OrderTableRow
        key={`OrderTable + ${index}`}
        data={item}
        buttonCallBack={props.buttonCallBack}
      />
    );
  });
  const noOrder = useMemo(() => {
    if (props.dataArray.length === 0) {
      return true;
    }
    return false;
  }, [props.dataArray.length]);
  return (
    <FuturesTableTitle
      dataArray={[
        t`Symbol`,
        t`Actual Margin`,
        t`Open Price`,
        t`Stop Order`,
        t`Operate`,
      ]}
      style={props.style}
      noOrder={noOrder}
    >
      {rows}
    </FuturesTableTitle>
  );
};

interface OrderTableRowProps {
  data: FuturesOrderV2;
  buttonCallBack: (value: FuturesModalInfo) => void;
}

const OrderTableRow: FC<OrderTableRowProps> = ({ ...props }) => {
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
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <ShareNewOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
      />
      <TableCell>
        <OrderTablePosition
          tokenName={tokenName}
          isLong={isLong}
          lever={lever}
        />
      </TableCell>
      <TableCell>
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
          })}
        >
          <p>{showBalance}NEST</p>
        </Stack>
      </TableCell>
      <TableCell>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showLimitPrice}USDT
        </Box>
      </TableCell>
      <TableCell>
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
      <TableCell>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
          <MainButton
            title={t`Edit`}
            onClick={() =>
              props.buttonCallBack({
                data: props.data,
                type: FuturesModalType.editLimit,
              })
            }
            style={{
              width: "auto",
              height: "36px",
              minWidth: "65px",
              fontSize: 12,
              paddingLeft: `12px`,
              paddingRight: `12px`,
            }}
          />
          <MainButton
            title={mainButtonTitle}
            isLoading={mainButtonLoading}
            disable={mainButtonDis}
            onClick={mainButtonAction}
            style={{
              width: "auto",
              height: "36px",
              minWidth: "65px",
              fontSize: 12,
              paddingLeft: `12px`,
              paddingRight: `12px`,
            }}
          />
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

export default OrderTable;
