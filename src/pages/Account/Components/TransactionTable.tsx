import { FC } from "react";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Deposit } from "../../../components/icons";

interface TransactionTableProps {
  style?: React.CSSProperties;
}

const TransactionTable: FC<TransactionTableProps> = ({ ...props }) => {
  const rows = [1, 2, 3, 4, 5, 6].map((item, index) => {
    return (
      <TransactionTableRow
        key={`TransactionTableRow + ${index}`}
        text={"11"}
        time={"22"}
        state={"33"}
        link={"44"}
      />
    );
  });
  return (
    <FuturesTableTitle
      dataArray={[t`操作`, t`时间`]}
      noOrder={true}
      helps={[]}
      style={props.style}
      noNeedPadding
    >
      {rows}
    </FuturesTableTitle>
  );
};

export default TransactionTable;

interface TransactionTableRowProps {
  text: string;
  time: string;
  state: string;
  link: string;
}

const TransactionTableRow: FC<TransactionTableRowProps> = ({ ...props }) => {
  return (
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <TableCell>
        <Stack direction={"row"} spacing={"12px"} alignItems={"center"}>
          <Box
            sx={{
              width: "16px",
              height: "16px",
              "& svg": {
                width: "16px",
                height: "16px",
              },
            }}
          >
            <Deposit />
          </Box>
          <Box
            sx={(theme) => ({
              fontSize: "12px",
              fontWeight: "700",
              lineHeight: "16px",
              color: theme.normal.text0,
            })}
          >
            Cancel Limit Order
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
            <Box>2023-04-45 10:44:33</Box>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
