import { FC } from "react";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { Trans, t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Deposit, NEXT } from "../../../components/icons";

interface MoneyTableProps {
  style?: React.CSSProperties;
}

const MoneyTable: FC<MoneyTableProps> = ({ ...props }) => {
  const rows = [1, 2, 3, 4, 5, 6].map((item, index) => {
    return (
      <MoneyTableRow
        key={`MoneyTableRow + ${index}`}
        text={"11"}
        time={"22"}
        state={"33"}
        link={"44"}
      />
    );
  });
  return (
    <FuturesTableTitle
      dataArray={[t`金额`, t`时间`, t`状态`, ""]}
      noOrder={true}
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
  state: string;
  link: string;
}

const MoneyTableRow: FC<MoneyTableRowProps> = ({ ...props }) => {
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
            100 NEST
          </Box>
        </Stack>
      </TableCell>
      <TableCell
        sx={{
          padding: "0px !important",
        }}
      >
        2023-04-45 10:44:33
      </TableCell>
      <TableCell
        sx={{
          padding: "0px !important",
        }}
      >
        <Stack direction={"row"} alignItems={"center"}>
        <Box
          sx={(theme) => ({
            padding: "4px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "700",
            lineHeight: "14px",
            border: `1px solid ${theme.normal.success}`,
            color: theme.normal.success,
          })}
        >
          <Trans>success</Trans>
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
            })}
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
