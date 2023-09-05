import { FC, useMemo } from "react";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { NEXT } from "../../../components/icons";
import { AccountListData } from "../../../hooks/useAccount";
import { AccountListType } from "./MobileList";

interface MoneyTableProps {
  list: Array<AccountListData>;
  type: AccountListType;
  style?: React.CSSProperties;
}

const MoneyTable: FC<MoneyTableProps> = ({ ...props }) => {
  const rows = props.list.map((item, index) => {
    const time =
      item.status === 0 || item.status === 255
        ? new Date((item.applyTime ?? 0) * 1000)
        : new Date(item.time * 1000);
        const showLink = () => {
    return (item.ordertype === "DEPOSIT" ||
      item.ordertype === "WITHDRAW") && !item.hash?.includes('-')
  };
    return (
      <MoneyTableRow
        key={`MoneyTableRow + ${index}`}
        text={item.text}
        time={`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}
        state={item.status}
        link={item.hash && showLink() ? item.hash.hashToChainScan(item.chainId) : undefined}
        type={props.type}
        orderType={item.orderTypeString}
      />
    );
  });
  return (
    <FuturesTableTitle
      dataArray={[t`Amount`, t`Type`, t`Time`, t`Status`, ""]}
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
  orderType: string;
  time: string;
  state: number;
  type: AccountListType;
  link?: string;
}

const MoneyTableRow: FC<MoneyTableRowProps> = ({ ...props }) => {
  const state = useMemo(() => {
    if (props.state === -1) {
      return t`Fail`;
    } else if (props.state === 0 || props.state === 255) {
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
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={(theme) => ({
              background: theme.normal.grey_hover,
              borderRadius: "2px",
              width: "16px",
              height: "16px",
              "& svg": {
                width: "12px",
                height: "12px",
                path: {
                  fill: theme.normal.text2,
                },
              },
            })}
          >
            {props.type === AccountListType.deposit ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5 5.5C10.7761 5.5 11 5.72386 11 6V10.5C11 10.7761 10.7761 11 10.5 11H1.5C1.22386 11 1 10.7761 1 10.5V6.00208C1 5.72593 1.22386 5.50208 1.5 5.50208C1.77614 5.50208 2 5.72593 2 6.00208V10H10V6C10 5.72386 10.2239 5.5 10.5 5.5Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.39645 5.39645C3.59171 5.20118 3.90829 5.20118 4.10355 5.39645L6 7.29289L7.89645 5.39645C8.09171 5.20118 8.40829 5.20118 8.60355 5.39645C8.79882 5.59171 8.79882 5.90829 8.60355 6.10355L6.35355 8.35355C6.15829 8.54882 5.84171 8.54882 5.64645 8.35355L3.39645 6.10355C3.20118 5.90829 3.20118 5.59171 3.39645 5.39645Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99792 1C6.27407 1 6.49792 1.22386 6.49792 1.5V8C6.49792 8.27614 6.27407 8.5 5.99792 8.5C5.72178 8.5 5.49792 8.27614 5.49792 8V1.5C5.49792 1.22386 5.72178 1 5.99792 1Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5 5.5C10.7761 5.5 11 5.72386 11 6V10.5C11 10.7761 10.7761 11 10.5 11H1.5C1.22386 11 1 10.7761 1 10.5V6.00208C1 5.72593 1.22386 5.50208 1.5 5.50208C1.77614 5.50208 2 5.72593 2 6.00208V10H10V6C10 5.72386 10.2239 5.5 10.5 5.5Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.39645 4.10355C3.20118 3.90829 3.20118 3.59171 3.39645 3.39645L5.64645 1.14645C5.84171 0.951184 6.15829 0.951184 6.35355 1.14645L8.60355 3.39645C8.79882 3.59171 8.79882 3.90829 8.60355 4.10355C8.40829 4.29882 8.09171 4.29882 7.89645 4.10355L6 2.20711L4.10355 4.10355C3.90829 4.29882 3.59171 4.29882 3.39645 4.10355Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99792 8.5C5.72178 8.5 5.49792 8.27614 5.49792 8V1.5C5.49792 1.22386 5.72178 1 5.99792 1C6.27407 1 6.49792 1.22386 6.49792 1.5V8C6.49792 8.27614 6.27407 8.5 5.99792 8.5Z"
                  fill="#F9F9F9"
                  fillOpacity="0.6"
                />
              </svg>
            )}
          </Stack>
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
        {props.orderType}
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
                  : props.state === 0 || props.state === 255
                  ? theme.normal.primary
                  : theme.normal.success;
              const borderColor =
                props.state === -1
                  ? theme.normal.danger_light_hover
                  : props.state === 0 || props.state === 255
                  ? theme.normal.primary_light_hover
                  : theme.normal.success_light_hover;
              return {
                padding: "4px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "700",
                lineHeight: "14px",
                border: `1px solid ${borderColor}`,
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
          {props.link ? (
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
          ) : (
            <></>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
};
