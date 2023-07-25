import { FC, useMemo } from "react";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Deposit, NEXT, Withdraw } from "../../../components/icons";
import { AccountListData } from "../../../hooks/useAccount";
import { AccountListType } from "./MobileList";

interface MoneyTableProps {
  list: Array<AccountListData>;
  type: AccountListType;
  style?: React.CSSProperties;
}

const MoneyTable: FC<MoneyTableProps> = ({ ...props }) => {
  const rows = props.list.map((item, index) => {
    const time = new Date(item.time * 1000);
    return (
      <MoneyTableRow
        key={`MoneyTableRow + ${index}`}
        text={item.text}
        time={`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}
        state={item.status}
        link={item.hash ? item.hash.hashToChainScan(item.chainId) : ""}
        type={props.type}
      />
    );
  });
  return (
    <FuturesTableTitle
      dataArray={[t`Amount`, t`Time`, t`Status`, ""]}
      noOrder={props.list.length === 0}
      helps={[]}
      style={props.style}
      noNeedPadding
    >
      {rows}
    </FuturesTableTitle>
  );
};

export default MoneyTable;

interface MoneyTableRowProps {
  text: string;
  time: string;
  state: number;
  link: string;
  type: AccountListType;
}

const MoneyTableRow: FC<MoneyTableRowProps> = ({ ...props }) => {
  const state = useMemo(() => {
    if (props.state === -1) {
      return t`Fail`;
    } else if (props.state === 0) {
      return t`Pending`;
    } else if (props.state === 1) {
      return t`Success`;
    } else {
      return "";
    }
  }, [props.state]);
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
            {props.type === AccountListType.deposit ? (
              <Deposit />
            ) : (
              <Withdraw />
            )}
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
      <TableCell
        sx={(theme) => ({
          padding: "0px !important",
          fontSize: "12px",
          fontWeight: "700",
          lineHeight: "16px",
          color: theme.normal.text0,
        })}
      >
        {props.time}
      </TableCell>
      <TableCell
        sx={{
          padding: "0px !important",
        }}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <Box
            sx={(theme) => {
              const color =
                props.state === -1
                  ? theme.normal.danger
                  : props.state === 0
                  ? theme.normal.primary
                  : theme.normal.success;
              return {
                padding: "4px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "700",
                lineHeight: "14px",
                border: `1px solid ${color}`,
                color: color,
              };
            }}
          >
            {state}
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Stack
            justifyContent={"space-around"}
            alignItems={"center"}
            sx={(theme) => ({
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              border: `1px solid ${theme.normal.border}`,
              "&:hover": {
                cursor: "pointer",
                border: `1px solid ${theme.normal.grey_hover}`,
                background: theme.normal.grey_hover,
                "& svg path": {
                  fill: theme.normal.text0,
                },
              },
              "&:active": {
                border: `1px solid ${theme.normal.grey_active}`,
                background: theme.normal.grey_active,
                "& svg path": {
                  fill: theme.normal.text0,
                },
              },
            })}
            component={"button"}
            onClick={() => {
              if (props.link !== "") {
                window.open(props.link);
              }
            }}
          >
            <Box
              sx={(theme) => ({
                width: "12px",
                height: "12px",
                "& svg": {
                  width: "12px",
                  height: "12px",
                  display: "block",
                  "& path": {
                    fill: theme.normal.text2,
                  },
                },
              })}
            >
              <NEXT />
            </Box>
          </Stack>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
