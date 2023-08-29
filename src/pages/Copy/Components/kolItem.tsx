import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import useWindowWidth, { WidthType } from "../../../hooks/useWindowWidth";
import Box from "@mui/material/Box";
import { Trans } from "@lingui/macro";
import MainButton from "../../../components/MainButton/MainButton";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import useTheme from "../../../hooks/useTheme";
import { AllKOLModel } from "../Hooks/useCopy";
import { DefaultKolIcon } from "../../../components/icons";

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

const NUM = (
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

// const testData = [
//   {
//     name: "1",
//     value: 1000,
//   },
//   {
//     name: "2",
//     value: -4000,
//   },
//   {
//     name: "3",
//     value: 2000,
//   },
//   {
//     name: "4",
//     value: -2000,
//   },
//   {
//     name: "5",
//     value: 1000,
//   },
//   {
//     name: "6",
//     value: 2000,
//   },
//   {
//     name: "7",
//     value: -1000,
//   },
//   {
//     name: "8",
//     value: -2000,
//   },
// ];

interface KolItemProps {
  data: AllKOLModel;
}

const KolItem: FC<KolItemProps> = ({ ...props }) => {
  const { width } = useWindowWidth();
  const { nowTheme } = useTheme();
  const itemSize = useMemo(() => {
    switch (width) {
      case WidthType.ssm | WidthType.sm:
        return 12;
      case WidthType.md:
        return 6;
      case WidthType.lg:
        return 4;
      default:
        return 3;
    }
  }, [width]);

  const chartData = useMemo(() => {
    return props.data.roiList.map((item, index) => {
      return { name: `${index}`, value: parseFloat(item.floor(2)) };
    });
  }, [props.data.roiList]);

  // DefaultKolIcon
  const kolIcon = useMemo(() => {
    if (props.data.avatar !== "-") {
      return <></>;
    } else {
      return (
        <Box
          width={"64px"}
          height={"64px"}
          sx={(theme) => ({
            borderRadius: "32px",
            background: theme.normal.bg3,
          })}
        >
          <DefaultKolIcon />
        </Box>
      );
    }
  }, [props.data.avatar]);

  const stop = useMemo(() => {
    const green = props.data.kolProfitLossRate >= 0;
    return (
      <ResponsiveContainer width="60%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={nowTheme.normal.success}
                stopOpacity={0.5}
              />
              <stop
                offset={`95%`}
                stopColor={nowTheme.normal.success}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={`5%`}
                stopColor={nowTheme.normal.danger}
                stopOpacity={0}
              />
              <stop
                offset="95%"
                stopColor={nowTheme.normal.danger}
                stopOpacity={0.5}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            baseLine={0}
            stroke={green ? nowTheme.normal.success : nowTheme.normal.danger}
            strokeWidth={"1px"}
            fillOpacity={1}
            fill={green ? "url(#colorUv)" : "url(#colorUv2)"}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }, [
    chartData,
    nowTheme.normal.danger,
    nowTheme.normal.success,
    props.data.kolProfitLossRate,
  ]);
  return (
    <Grid xs={itemSize} item>
      <Stack
        spacing={"20px"}
        sx={(theme) => ({
          padding: "24px 20px",
          borderRadius: "12px",
          background: theme.normal.bg1,
        })}
      >
        <Stack
          direction={"row"}
          spacing={"12px"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          {kolIcon}
          <Stack spacing={"4px"}>
            <Box
              sx={(theme) => ({
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "22px",
                color: theme.normal.text0,
              })}
            >
              {props.data.nickName}
            </Box>
            <Stack
              direction={"row"}
              spacing={"4px"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Stack
                justifyContent={"space-around"}
                alignItems={"center"}
                sx={(theme) => ({
                  width: "20px",
                  height: "20px",
                  borderRadius: "10px",
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
                  fontSize: "12px",
                  fontWeight: "400",
                  lineHeight: "16px",
                  color: theme.normal.text1,
                })}
              >
                {props.data.walletAddress.showAddress()}
              </Box>
            </Stack>
            <Stack
              direction={"row"}
              spacing={"4px"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Stack
                justifyContent={"space-around"}
                alignItems={"center"}
                sx={(theme) => ({
                  width: "20px",
                  height: "20px",
                  borderRadius: "10px",
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
                  {NUM}
                </Box>
              </Stack>
              <Box
                sx={(theme) => ({
                  fontSize: "12px",
                  fontWeight: "400",
                  lineHeight: "16px",
                  color: theme.normal.text1,
                })}
              >
                {props.data.currentFollowers}
              </Box>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={"20px"}
          width={"100%"}
          height={"48px"}
        >
          <Stack spacing={"4px"} width={"35%"}>
            <Box
              sx={(theme) => ({
                fontSize: "24px",
                fontWeight: "700",
                lineHeight: "32px",
                color:
                  props.data.kolProfitLossRate >= 0
                    ? theme.normal.success
                    : theme.normal.danger,
              })}
            >
              {`${parseFloat(props.data.kolProfitLossRate.floor(2))}%`}
            </Box>
            <Box
              sx={(theme) => ({
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "16px",
                color: theme.normal.text2,
              })}
            >
              ROI
            </Box>
          </Stack>

          {stop}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack spacing={"4px"}>
            <Box
              sx={(theme) => ({
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: "20px",
                color: theme.normal.text0,
              })}
            >
              {parseFloat(props.data.kolProfitLoss.floor(2))}
            </Box>
            <Box
              sx={(theme) => ({
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "16px",
                color: theme.normal.text2,
              })}
            >
              <Trans>7D PnL</Trans>
            </Box>
          </Stack>

          <Stack spacing={"4px"} alignItems={"flex-end"}>
            <Box
              sx={(theme) => ({
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: "20px",
                color: theme.normal.text0,
              })}
            >
              {parseFloat(props.data.followerProfitLoss.floor(2))}
            </Box>
            <Box
              sx={(theme) => ({
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "16px",
                color: theme.normal.text2,
              })}
            >
              <Trans>7D Followers PnL</Trans>
            </Box>
          </Stack>
        </Stack>
        <MainButton
          title={"Copy"}
          onClick={() => {
            window.location.href = `/#/trader/${props.data.walletAddress}`;
          }}
          style={{ height: "40px", width: "100%", fontSize: "14px" }}
        />
      </Stack>
    </Grid>
  );
};

export default KolItem;
