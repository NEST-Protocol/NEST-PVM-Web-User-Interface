import { Trans, t } from "@lingui/macro";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, useCallback, useEffect, useMemo } from "react";
import MainButton from "../../components/MainButton/MainButton";
import useWindowWidth from "../../hooks/useWindowWidth";
import KolItem from "./Components/kolItem";
import Grid from "@mui/material/Grid";
import useCopy from "./Hooks/useCopy";
import Pagination from "@mui/material/Pagination";
import useTheme from "../../hooks/useTheme";
import { LJ1, LJ2 } from "../../components/icons";

const MY_COPY_ICON = (
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
      d="M35 25V28.0385V36C35 37.6569 36.3431 39 38 39C39.6569 39 41 37.6569 41 36V25H35ZM31 28.0385V25V21V9H9V35C9 37.2091 10.7909 39 13 39H31.6736C31.2417 38.0907 31 37.0736 31 36V28.0385ZM38 43H32H13C8.58172 43 5 39.4183 5 35V7C5 5.89543 5.89543 5 7 5H33C34.1046 5 35 5.89543 35 7V21H43C44.1046 21 45 21.8954 45 23V36C45 39.866 41.866 43 38 43ZM14 17C14 16.4477 14.4477 16 15 16H25C25.5523 16 26 16.4477 26 17V19C26 19.5523 25.5523 20 25 20H15C14.4477 20 14 19.5523 14 19V17ZM15 24C14.4477 24 14 24.4477 14 25V27C14 27.5523 14.4477 28 15 28H25C25.5523 28 26 27.5523 26 27V25C26 24.4477 25.5523 24 25 24H15Z"
      fill="#131212"
    />
  </svg>
);
const MY_COPY_ICON2 = (
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

const NEXT = (
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
      d="M34.1334 23.293C34.5239 23.6836 34.5239 24.3167 34.1334 24.7072L17.1628 41.6778C16.7723 42.0683 16.1391 42.0683 15.7486 41.6778L14.2928 40.222C13.9023 39.8315 13.9023 39.1983 14.2928 38.8078L29.1004 24.0001L14.2928 9.19249C13.9023 8.80197 13.9023 8.16881 14.2928 7.77828L15.7486 6.32247C16.1391 5.93195 16.7723 5.93195 17.1628 6.32247L34.1334 23.293Z"
      fill="#131212"
    />
  </svg>
);

const HOW_TO_USE_1 = (
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
      d="M14.9999 13C14.9999 8.02944 19.0293 4 23.9999 4C28.9705 4 32.9999 8.02944 32.9999 13C32.9999 17.9706 28.9705 22 23.9999 22C19.0293 22 14.9999 17.9706 14.9999 13ZM23.9999 8C21.2385 8 18.9999 10.2386 18.9999 13C18.9999 15.7614 21.2385 18 23.9999 18C26.7613 18 28.9999 15.7614 28.9999 13C28.9999 10.2386 26.7613 8 23.9999 8Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.6403 6.11069C14.2722 7.01664 14.0501 8.26333 13.1441 8.89525C11.8439 9.8022 10.9999 11.3027 10.9999 13.0002C10.9999 14.8166 11.9673 16.4091 13.4245 17.2872C14.3706 17.8572 14.6754 19.0863 14.1054 20.0324C13.5353 20.9785 12.3062 21.2833 11.3601 20.7132C8.75172 19.1415 6.99991 16.2764 6.99991 13.0002C6.99991 9.94006 8.52896 7.23746 10.8557 5.61451C11.7617 4.98259 13.0084 5.20474 13.6403 6.11069Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M34.3595 6.11069C34.9915 5.20474 36.2381 4.98259 37.1441 5.61451C39.4709 7.23746 40.9999 9.94006 40.9999 13.0002C40.9999 16.0602 39.4709 18.763 37.1441 20.3859C36.2381 21.0178 34.9914 20.7956 34.3595 19.8897C33.7276 18.9837 33.9498 17.737 34.8558 17.1051C36.1559 16.1982 36.9999 14.6976 36.9999 13.0002C36.9999 11.3027 36.156 9.8022 34.8557 8.89525C33.9498 8.26333 33.7276 7.01664 34.3595 6.11069Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.5713 44C11.1512 44 9.99991 42.8487 9.99991 41.4286C9.99991 36.6361 9.99991 34.2398 10.7104 32.3495C11.6576 29.8292 13.4746 27.8269 15.7615 26.783C17.4767 26 19.6512 26 23.9999 26C28.3487 26 30.5231 26 32.2383 26.783C34.5252 27.8269 36.3422 29.8292 37.2894 32.3495C37.9999 34.2398 37.9999 36.6361 37.9999 41.4286C37.9999 42.8487 36.8486 44 35.4285 44H12.5713ZM13.9999 40V38.5714C13.9999 35.9089 13.9999 34.5776 14.5074 33.5275C15.184 32.1274 16.4818 31.0149 18.1153 30.435C19.3405 30 20.8937 30 23.9999 30C27.1061 30 28.6593 30 29.8845 30.435C31.518 31.0149 32.8158 32.1274 33.4924 33.5275C33.9999 34.5776 33.9999 35.9089 33.9999 38.5714V40H13.9999Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.1501 27.9641C10.6515 28.9483 10.2602 30.1526 9.27607 30.6541C8.14706 31.2294 7.22918 32.1472 6.65397 33.2762C6.38559 33.8029 6.20124 34.4983 6.10235 35.7086C6.00156 36.9423 6 38.5269 6 40.8001V42.0001C6 43.1047 5.10457 44.0001 4 44.0001C2.89543 44.0001 2 43.1047 2 42.0001L2 40.7145C1.99998 38.5469 1.99996 36.7986 2.11564 35.3829C2.23474 33.9252 2.48636 32.6448 3.08993 31.4602C4.04868 29.5786 5.5785 28.0488 7.46007 27.0901C8.44425 26.5886 9.6486 26.9799 10.1501 27.9641Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M38.2087 28.0842C37.7293 29.061 38.1034 30.2564 39.0442 30.7541C40.1235 31.325 41.001 32.236 41.5509 33.3565C41.8074 33.8792 41.9837 34.5694 42.0782 35.7707C42.1746 36.9951 42.176 38.5678 42.176 40.824V42.015C42.176 43.1113 43.032 44 44.088 44C45.1439 44 45.9999 43.1113 45.9999 42.015V40.739C45.9999 38.5877 45.9999 36.8525 45.8894 35.4474C45.7755 34.0006 45.535 32.7298 44.958 31.5541C44.0414 29.6866 42.579 28.1683 40.7803 27.2168C39.8394 26.7191 38.6881 27.1074 38.2087 28.0842Z"
      fill="#333333"
    />
  </svg>
);
const HOW_TO_USE_2 = (
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
      d="M27.5 4C28.6046 4 29.5 4.89543 29.5 6V14C29.5 15.1046 28.6046 16 27.5 16C26.3954 16 25.5 15.1046 25.5 14V12H5.5C4.39543 12 3.5 11.1046 3.5 10C3.5 8.89543 4.39543 8 5.5 8H25.5V6C25.5 4.89543 26.3954 4 27.5 4ZM33.5 10C33.5 8.89543 34.3954 8 35.5 8H41.5C42.6046 8 43.5 8.89543 43.5 10C43.5 11.1046 42.6046 12 41.5 12H35.5C34.3954 12 33.5 11.1046 33.5 10ZM21.5 18C22.6046 18 23.5 18.8954 23.5 20V22H43.5C44.6046 22 45.5 22.8954 45.5 24C45.5 25.1046 44.6046 26 43.5 26H23.5V28C23.5 29.1046 22.6046 30 21.5 30C20.3954 30 19.5 29.1046 19.5 28V20C19.5 18.8954 20.3954 18 21.5 18ZM3.5 24C3.5 22.8954 4.39543 22 5.5 22H13.5C14.6046 22 15.5 22.8954 15.5 24C15.5 25.1046 14.6046 26 13.5 26H5.5C4.39543 26 3.5 25.1046 3.5 24ZM27.5 32C28.6046 32 29.5 32.8954 29.5 34V42C29.5 43.1046 28.6046 44 27.5 44C26.3954 44 25.5 43.1046 25.5 42V40H5.5C4.39543 40 3.5 39.1046 3.5 38C3.5 36.8954 4.39543 36 5.5 36H25.5V34C25.5 32.8954 26.3954 32 27.5 32ZM33.5 38C33.5 36.8954 34.3954 36 35.5 36H41.5C42.6046 36 43.5 36.8954 43.5 38C43.5 39.1046 42.6046 40 41.5 40H35.5C34.3954 40 33.5 39.1046 33.5 38Z"
      fill="#333333"
    />
  </svg>
);
const HOW_TO_USE_3 = (
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
      d="M11 4.00001C11 2.89544 11.8954 2.00001 13 2.00001H30C31.1046 2.00001 32 2.89544 32 4.00001V14H41C42.1046 14 43 14.8954 43 16V38C43 39.1046 42.1046 40 41 40H13C11.8954 40 11 39.1046 11 38V4.00001ZM15 6.00001V36H39V18H30C28.8954 18 28 17.1046 28 16V6.00001H15Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M28.6486 2.5257C29.4628 1.77932 30.7279 1.83432 31.4743 2.64856L42.4743 14.6486C43.2207 15.4628 43.1657 16.7279 42.3514 17.4743C41.5372 18.2207 40.2721 18.1657 39.5257 17.3515L28.5257 5.35146C27.7793 4.53722 27.8343 3.27209 28.6486 2.5257Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7 18C8.10457 18 9 18.8954 9 20V42H28C29.1046 42 30 42.8954 30 44C30 45.1046 29.1046 46 28 46H7C5.89543 46 5 45.1046 5 44V20C5 18.8954 5.89543 18 7 18Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17 20C17 18.8954 17.8954 18 19 18H23C24.1046 18 25 18.8954 25 20C25 21.1046 24.1046 22 23 22H19C17.8954 22 17 21.1046 17 20Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17 28C17 26.8954 17.8954 26 19 26H31C32.1046 26 33 26.8954 33 28C33 29.1046 32.1046 30 31 30H19C17.8954 30 17 29.1046 17 28Z"
      fill="#333333"
    />
  </svg>
);

const Copy: FC = () => {
  const { isBigMobile } = useWindowWidth();
  const { nowTheme } = useTheme();
  const {
    kolList,
    myTradeInfo: myInfo,
    setPage,
    allPage,
    hideMyTrade,
  } = useCopy();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const myTradeInfo = useCallback((title: string, num: string) => {
    return (
      <Stack spacing={"4px"}>
        <Box
          sx={(theme) => ({
            fontSize: "20px",
            fontWeight: "700",
            lineHeight: "28px",
            color: theme.normal.text0,
          })}
        >
          {num}
        </Box>
        <Box
          sx={(theme) => ({
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: theme.normal.text2,
          })}
        >
          {title}
        </Box>
      </Stack>
    );
  }, []);

  const myTrades = useMemo(() => {
    const title = (
      <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
        <Stack
          justifyContent={"space-around"}
          alignItems={"center"}
          sx={(theme) => ({
            width: "38px",
            height: "38px",
            borderRadius: "19px",
            background: theme.normal.bg0,
          })}
        >
          <Box
            sx={(theme) => ({
              width: "14px",
              height: "14px",
              "& svg": {
                width: "14px",
                height: "14px",
                display: "block",
                "& path": {
                  fill: theme.normal.text0,
                },
              },
            })}
          >
            {MY_COPY_ICON2}
          </Box>
        </Stack>
        <Box
          sx={(theme) => ({
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "22px",
            color: theme.normal.text0,
          })}
        >
          <Trans>My Trades</Trans>
        </Box>
      </Stack>
    );
    if (isBigMobile) {
      return (
        <Stack
          direction={"row"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingY={"24px"}
          paddingX={"10.5px"}
          sx={(theme) => ({
            background: theme.normal.bg1,
            borderRadius: "12px",
          })}
          component={"button"}
          onClick={() => {
            window.location.href = "/#/myCopies";
          }}
        >
          {title}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={"8px"}
          >
            <Stack spacing={"4px"}>
              <Box
                sx={(theme) => ({
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "28px",
                  color: theme.normal.text0,
                })}
              >
                {parseFloat((myInfo ? myInfo.profit : 0).floor(2))}
              </Box>
              <Box
                sx={(theme) => ({
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "20px",
                  color: theme.normal.text2,
                })}
              >
                <Trans>Profit(NEST)</Trans>
              </Box>
            </Stack>
            <Box
              sx={(theme) => ({
                width: "16px",
                height: "16px",
                "& svg": {
                  width: "16px",
                  height: "16px",
                  display: "block",
                  "& path": {
                    fill: theme.normal.text2,
                  },
                },
              })}
            >
              {NEXT}
            </Box>
          </Stack>
        </Stack>
      );
    } else {
      return (
        <Stack
          maxWidth={"1200px"}
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"24px"}
          marginTop={"40px"}
          sx={(theme) => ({
            background: theme.normal.bg1,
            borderRadius: "12px",
          })}
        >
          <Stack spacing={"24px"}>
            {title}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={"64px"}
            >
              {myTradeInfo(
                t`Copy Trading Total Amount (NEST)`,
                (myInfo ? myInfo.assets : 0).floor(2)
              )}
              {myTradeInfo(
                t`Profit (NEST)`,
                (myInfo ? myInfo.profit : 0).floor(2)
              )}
              {myTradeInfo(
                t`Unrealized PnL (NEST)`,
                (myInfo ? myInfo.unRealizedPnl : 0).floor(2)
              )}
              {myTradeInfo(
                t`Copy Orders`,
                (myInfo ? myInfo.copyOrders : 0).floor(2)
              )}
            </Stack>
          </Stack>

          <Stack
            direction={"row"}
            spacing={"12px"}
            justifyContent={"space-around"}
            alignItems={"center"}
            padding={"13px 24px"}
            borderRadius={"12px"}
            sx={(theme) => ({
              background: theme.normal.grey_active,
              color: theme.normal.text1,
              "&:hover": {
                cursor: "pointer",
                background: theme.normal.grey_hover,
              },
              "&:active": {
                background: theme.normal.grey_active,
              },
              "& svg path": {
                fill: theme.normal.text1,
              },
            })}
            component={"button"}
            onClick={() => {
              window.location.href = "/#/myCopies";
            }}
          >
            <Box
              width={"20px"}
              height={"20px"}
              sx={{
                "& svg": { width: "20px", height: "20px", display: "block" },
              }}
            >
              {MY_COPY_ICON}
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "22px",
              }}
            >
              <Trans>My Copies</Trans>
            </Box>
          </Stack>
        </Stack>
      );
    }
  }, [isBigMobile, myInfo, myTradeInfo]);
  const howToUse = useCallback(
    (title: string, info: string, icon: JSX.Element) => {
      return (
        <Stack
          spacing={"24px"}
          paddingY={["20px", "20px", "40px"]}
          paddingX={"20px"}
          width={"100%"}
          sx={(theme) => ({
            borderRadius: "20px",
            background: theme.normal.bg1,
          })}
        >
          <Box
            sx={(theme) => ({
              width: ["48px", "48px", "64px"],
              height: ["48px", "48px", "64px"],
              "& svg": {
                width: ["48px", "48px", "64px"],
                height: ["48px", "48px", "64px"],
                display: "block",
                "& path": {
                  fill: theme.normal.primary,
                },
              },
            })}
          >
            {icon}
          </Box>
          <Stack spacing={"12px"}>
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: ["16px", "16px", "20px"],
                lineHeight: ["22px", "22px", "28px"],
                color: theme.normal.text0,
              })}
            >
              {title}
            </Box>
            <Box
              sx={(theme) => ({
                fontWeight: "400",
                fontSize: ["14px", "14px", "16px"],
                lineHeight: ["20px", "20px", "22px"],
                color: theme.normal.text2,
              })}
            >
              {info}
            </Box>
          </Stack>
        </Stack>
      );
    },
    []
  );
  const kols = useMemo(() => {
    return (
      <Stack
        maxWidth={"1200px"}
        gap={["16px", "16px", "32px"]}
        marginTop={"40px"}
        width={"100%"}
      >
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: ["24px", "24px", "32px"],
            lineHeight: ["32px", "32px", "44px"],
            color: theme.normal.text0,
          })}
        >
          <Trans>All Traders</Trans>
        </Box>

        <Grid container spacing={"12px"}>
          {kolList.map((item) => {
            return <KolItem data={item} />;
          })}
        </Grid>

        <Stack
          spacing={"10px"}
          direction={"row"}
          justifyContent={["center", "center", "flex-end"]}
          alignItems={"center"}
          width={"100%"}
          sx={(theme) => ({
            "& ul": {
              "& li": {
                "& .MuiPaginationItem-ellipsis": {
                  color: theme.normal.text2,
                },
                "& button": {
                  background: theme.normal.bg1,
                  borderRadius: "8px",
                  opacity: 1,
                  border: 0,
                  color: theme.normal.text2,
                  "&.Mui-selected": {
                    background: theme.normal.primary,
                    color: theme.normal.bg1,
                    "&:hover": {
                      background: theme.normal.primary,
                      color: theme.normal.bg1,
                    },
                  },
                },
              },
              "& li:first-child": {
                "& button": {},

                "& button svg path": {
                  fill: theme.normal.text2,
                },
              },
              "& li:last-child": {
                "& button": {},
                "& button svg path": {
                  fill: theme.normal.text2,
                },
              },
            },
          })}
        >
          <Pagination
            count={allPage}
            variant="outlined"
            shape="rounded"
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              setPage(value);
            }}
          />
        </Stack>
      </Stack>
    );
  }, [allPage, kolList, setPage]);
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      <Stack width={"100%"} alignItems={"center"}>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-around"}
          height={["fit-content", "fit-content", "448px"]}
          paddingBottom={["60px", "60px", "80px"]}
          sx={{
            backgroundImage: nowTheme.isLight
              ? `url('/images/LJBG1.svg')`
              : `url('/images/LJBG2.svg')`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Stack
            maxWidth={"1200px"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={["0px", "0px", "40px"]}
            paddingX={["20px", "20px", "20px", "20px", "0"]}
          >
            <Box
              paddingY={["80px", "80px", "60px"]}
              textAlign={["center", "center", "left"]}
              sx={(theme) => ({
                fontSize: ["28px", "28px", "48px"],
                fontWeight: "700",
                lineHeight: ["40px", "40px", "60px"],
                color: theme.normal.text0,
              })}
            >
              <Trans>Follow top trading strategies on NESTFi</Trans>
            </Box>
            <Box
              sx={{
                width: "392px",
                height: "169px",
                "& svg": {
                  width: "392px",
                  height: "169px",
                  display: "block",
                },
              }}
              display={["none", "none", "block"]}
            >
              {nowTheme.isLight ? <LJ1 /> : <LJ2 />}
            </Box>
          </Stack>
        </Stack>
        <Stack
          width={"100%"}
          alignItems={"center"}
          paddingX={["20px", "20px", "20px", "20px", "0"]}
          marginTop={["-50px", "-50px", "-122px"]}
        >
          {hideMyTrade ? <></> : myTrades}

          {kols}

          <Stack
            maxWidth={"1200px"}
            spacing={["16px", "16px", "32px"]}
            marginTop={["40px", "40px", "80px"]}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box
                sx={(theme) => ({
                  fontWeight: "700",
                  fontSize: ["20px", "20px", "32px"],
                  lineHeight: ["28px", "28px", "44px"],
                  color: theme.normal.text0,
                })}
              >
                <Trans>Copy Trading Effortlessly</Trans>
              </Box>
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                spacing={"4px"}
                onClick={() => {
                  window.open(
                    "https://www.nestprotocol.org/blogs/guide-on-copy-trading-service"
                  );
                }}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={(theme) => ({
                    fontSize: "16px",
                    fontWeight: "400",
                    lineHeight: "22px",
                    color: theme.normal.text2,
                  })}
                >
                  <Trans>More</Trans>
                </Box>
                <Box
                  width={"16px"}
                  height={"16px"}
                  sx={(theme) => ({
                    "& svg": {
                      width: "16px",
                      height: "16px",
                      display: "block",
                      "& path": {
                        fill: theme.normal.text2,
                      },
                    },
                  })}
                >
                  {NEXT}
                </Box>
              </Stack>
            </Stack>
            <Stack
              direction={["column", "column", "row"]}
              gap={"24px"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {howToUse(
                t`Select KOL`,
                t`You can freely choose the KOL that suits you in the leaderboards.`,
                HOW_TO_USE_1
              )}
              {howToUse(
                t`Custom Copy Trading`,
                t`Set the margin for each order as well as the overall copy trading amount.`,
                HOW_TO_USE_2
              )}
              {howToUse(
                t`Align With Traders`,
                t`A professional trader's position will be automatically copied and executed for you.`,
                HOW_TO_USE_3
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack
          maxWidth={"100%"}
          marginTop={["24px", "24px", "102px"]}
          gap={["24px", "24px", "40px"]}
          paddingY={["40px", "40px", "80px"]}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            backgroundImage: `url('/images/CopyBG.svg')`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "32px",
              lineHeight: "44px",
              color: theme.normal.text0,
              textAlign: "center",
              paddingX: "20px",
            })}
          >
            <Trans>
              Boost your earning and influence by becoming copy traders.
            </Trans>
          </Box>
          <MainButton
            title={t`Become Elite Traders >`}
            onClick={() => {
              window.open("https://t.me/Sally_NEST");
            }}
            style={{
              fontWeight: "700",
              fontSize: "16px",
              height: "48px",
              width: "fit-content",
              padding: "0 30px 0 30px",
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Copy;
