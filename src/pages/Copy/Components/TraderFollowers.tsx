import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { Trans, t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { TraderFollowerList } from "../Hooks/useTrader";

const WALLET = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M30.7846 2.26792C31.7412 1.71563 32.9644 2.04338 33.5167 2.99997L38.1291 10.9889C38.4865 11.608 38.4863 12.3709 38.1285 12.9898C37.7707 13.6088 37.1097 13.9896 36.3948 13.9889L17.9798 13.9689C17.075 13.9679 16.2836 13.3596 16.0499 12.4855C15.8162 11.6113 16.1984 10.6892 16.982 10.2368L30.7846 2.26792ZM25.4321 9.97696L32.9307 9.9851L31.0525 6.73201L25.4321 9.97696Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 14C2 11.7908 3.79088 9.99997 6 9.99997H42C44.2092 9.99997 46 11.7908 46 14V42C46 44.2091 44.2092 46 42 46H6C3.79088 46 2 44.2092 2 42V14ZM42 14H6V42H42V14Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M28 28C28 24.0432 31.339 21 35.25 21H44C45.1046 21 46 21.8954 46 23V33C46 34.1045 45.1046 35 44 35H35.25C31.339 35 28 31.9568 28 28ZM35.25 25C33.362 25 32 26.434 32 28C32 29.566 33.362 31 35.25 31H42V25H35.25Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M44 14.5C45.1046 14.5 46 15.3954 46 16.5V40.5C46 41.6045 45.1046 42.5 44 42.5C42.8954 42.5 42 41.6045 42 40.5V16.5C42 15.3954 42.8954 14.5 44 14.5Z"
      fill="#333333"
    />
  </svg>
);

interface TraderFollowersProps {
  list: TraderFollowerList[];
}

const TraderFollowers: FC<TraderFollowersProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();

  const rows = props.list.map((item, index) => {
    return <Row key={`TraderFollowers + ${index}`} data={item} />;
  });

  const noOrder = useMemo(() => {
    return false;
  }, []);

  const mobile = useMemo(() => {
    const items = props.list.map((item, index) => {
      return (
        <Stack
          key={`TraderFollowersMobile + ${index}`}
          spacing={"20px"}
          sx={(theme) => ({
            borderRadius: "12px",
            background: theme.normal.bg1,
            padding: "20px 12px",
          })}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
              <Stack
                justifyContent={"space-around"}
                alignItems={"center"}
                width={"20px"}
                height={"20px"}
                borderRight={"10px"}
                sx={(theme) => ({
                  background: theme.normal.bg0,
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
                  {WALLET}
                </Box>
              </Stack>
              <Box
                sx={(theme) => ({
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "20px",
                  color: theme.normal.text0,
                })}
              >
                {item.walletAddress.showAddress()}
              </Box>
            </Stack>
            <Stack spacing={"4px"} alignItems={"right"}>
              <Box
                sx={(theme) => ({
                  fontSize: "12px",
                  fontWeight: "400",
                  lineHeight: "16px",
                  color: theme.normal.text2,
                })}
              >
                <Trans>Profit(NEST)</Trans>
              </Box>
              <Box
                sx={(theme) => ({
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "20px",
                  color:
                    item.followerProfitLoss >= 0
                      ? theme.normal.success
                      : theme.normal.danger,
                  textAlign: "right",
                })}
              >
                {item.followerProfitLoss.floor(2)}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      );
    });
    return (
      <Stack paddingX={"12px"} spacing={"16px"} paddingBottom={"20px"}>
        {items}
      </Stack>
    );
  }, [props.list]);

  const pc = useMemo(() => {
    return (
      <FuturesTableTitle
        dataArray={[t`Address`, t`Profit(NEST)`]}
        noOrder={noOrder}
        helps={[]}
        noNeedPadding
        freeRight
      >
        {rows}
      </FuturesTableTitle>
    );
  }, [noOrder, rows]);

  return <>{isBigMobile ? mobile : pc}</>;
};

interface RowProps {
  data: TraderFollowerList;
}

const Row: FC<RowProps> = ({ ...props }) => {
  return (
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <TableCell>
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "12px",
            lineHeight: "16px",
            color: theme.normal.text0,
          })}
        >
          {props.data.walletAddress.showAddress()}
        </Box>
      </TableCell>

      <TableCell>
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "12px",
            lineHeight: "16px",
            color:
              props.data.followerProfitLoss >= 0
                ? theme.normal.success
                : theme.normal.danger,
            paddingRight: "20px",
          })}
        >
          {props.data.followerProfitLoss.floor(2)}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TraderFollowers;
