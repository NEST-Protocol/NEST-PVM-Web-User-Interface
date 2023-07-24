import { FC } from "react";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Fail, Success } from "../../../components/icons";
import { AccountListData } from "../../../hooks/useAccount";

interface TransactionTableProps {
  list: Array<AccountListData>;
  style?: React.CSSProperties;
}

const TransactionTable: FC<TransactionTableProps> = ({ ...props }) => {
  const rows = props.list.map((item, index) => {
    const time = new Date(item.time * 1000);
    return (
      <TransactionTableRow
        key={`TransactionTableRow + ${index}`}
        text={t`${item.text}`}
        time={`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}
        state={item.status}
        link={""}
      />
    );
  });
  return (
    <FuturesTableTitle
      dataArray={[t`Action`, t`Time`]}
      noOrder={props.list.length === 0}
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
  state: number;
  link: string;
}

const TransactionTableRow: FC<TransactionTableRowProps> = ({ ...props }) => {
  const icon = props.state === 1 ? <Success /> : <Fail />;
  return (
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <TableCell>
        <Stack direction={"row"} spacing={"12px"} alignItems={"center"}>
          <Box
            sx={(theme) => {
              const fill =
                props.state === 1 ? theme.normal.success : theme.normal.danger;
              return {
                width: "16px",
                height: "16px",
                "& svg": {
                  width: "16px",
                  height: "16px",
                  "& path": {
                    fill: fill,
                  },
                },
              };
            }}
          >
            {icon}
          </Box>
          <Box
            sx={(theme) => ({
              fontSize: "12px",
              fontWeight: "700",
              lineHeight: "16px",
              color: theme.normal.text0,
            })}
          >
            {props.text}
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box>{props.time}</Box>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
