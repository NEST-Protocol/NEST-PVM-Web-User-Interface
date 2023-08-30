import Stack from "@mui/material/Stack";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import CopyRoute from "./Components/CopyRoute";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import MyCopiesCurrent from "./Components/MyCopiesCurrent";
import MyCopiesHistory from "./Components/MyCopiesHistory";
import MyCopiesMyTraders from "./Components/MyCopiesMyTraders";
import CopySettingModal from "./Components/CopySettingModal";
import CopyStopModal from "./Components/CopyStopModal";
import useMyCopies from "./Hooks/useMyCopies";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "../../hooks/useTransactionReceipt";
import { SnackBarType } from "../../components/SnackBar/NormalSnackBar";
import { useSearchParams } from "react-router-dom";

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

const MyCopies: FC = () => {
  const [tabsValue, setTabsValue] = useState(0);
  const [openCopyModal, setOpenCopyModal] = useState<Array<string>>([]);
  const [openStopModal, setOpenStopModal] = useState<string>();
  const { addTransactionNotice } = usePendingTransactionsBase();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let tab = searchParams.get("tab");
    setTabsValue(Number(tab ?? "0"));
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const {
    myTradeInfo,
    myCopiesList,
    myCopiesHistoryList,
    myCopiesMyTradersList,
    getMyCopiesMyTraderList,
    updateCurrent,
  } = useMyCopies();
  const profit = (myTradeInfo ? myTradeInfo.profit : 0).floor(2);
  const assets = (myTradeInfo ? myTradeInfo.assets : 0).floor(2);
  const unRealizedPnl = (myTradeInfo ? myTradeInfo.unRealizedPnl : 0).floor(2);
  const copyOrders = (myTradeInfo ? myTradeInfo.copyOrders : 0).floor(2);

  const tabs = useMemo(() => {
    const data = [
      <Box>
        <Trans>Current</Trans>
      </Box>,
      <Box>
        <Trans>History</Trans>
      </Box>,
      <Box>
        <Trans>My Traders</Trans>
      </Box>,
    ];
    return (
      <NESTTabs
        value={tabsValue}
        className={"MyCopiesTabs"}
        datArray={data}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={false}
      />
    );
  }, [tabsValue]);

  const tabsView = useMemo(() => {
    if (tabsValue === 0) {
      return <MyCopiesCurrent list={myCopiesList} updateList={updateCurrent} />;
    } else if (tabsValue === 1) {
      return <MyCopiesHistory list={myCopiesHistoryList} />;
    } else if (tabsValue === 2) {
      return (
        <MyCopiesMyTraders
          copyCallBack={(name: string, address: string) =>
            setOpenCopyModal([name, address])
          }
          stopCallBack={(address: string) => setOpenStopModal(address)}
          list={myCopiesMyTradersList}
        />
      );
    } else {
      return <></>;
    }
  }, [
    myCopiesHistoryList,
    myCopiesList,
    myCopiesMyTradersList,
    tabsValue,
    updateCurrent,
  ]);
  const topInfo = useCallback((title: string, info: string) => {
    return (
      <Stack spacing={"4px"}>
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "28px",
            color: theme.normal.text0,
          })}
        >
          {info}
        </Box>
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text2,
            whiteSpace: "nowrap",
          })}
        >
          {title}
        </Box>
      </Stack>
    );
  }, []);

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      <CopySettingModal
        open={openCopyModal.length !== 0}
        name={openCopyModal[0]}
        address={openCopyModal[1]}
        onClose={(res?: boolean) => {
          if (res !== undefined) {
            addTransactionNotice({
              type: TransactionType.editCopy,
              info: "",
              result: res ? SnackBarType.success : SnackBarType.fail,
            });
          }
          getMyCopiesMyTraderList();
          setOpenCopyModal([]);
        }}
      />
      <CopyStopModal
        open={!(openStopModal === undefined)}
        onClose={(res?: boolean) => {
          if (res !== undefined) {
            addTransactionNotice({
              type: TransactionType.closeCopy,
              info: "",
              result: res ? SnackBarType.success : SnackBarType.fail,
            });
          }
          getMyCopiesMyTraderList();
          setOpenStopModal(undefined);
        }}
        address={openStopModal}
      />
      <Stack maxWidth={"1200px"} spacing={"24px"} width={"100%"}>
        <CopyRoute title={t`My Copies`} link={"/#/copy"} />
        <Stack paddingX={["20px", "20px", "0px"]}>
          <Stack
            direction={["column", "column", "row"]}
            alignItems={["flex-start", "flex-start", "center"]}
            paddingX={"24px"}
            paddingY={["24px", "24px", "40px"]}
            borderRadius={"12px"}
            gap={["24px", "24px", "40px"]}
            sx={(theme) => ({ background: theme.normal.bg1 })}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={"4px"}
              paddingY={"7px"}
              paddingRight={["0", "0", "40px"]}
              sx={(theme) => ({
                borderRight: ["0px", "0px", `1px solid ${theme.normal.border}`],
              })}
            >
              <Stack
                display={["none", "none", "flex"]}
                direction={"row"}
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
                        fill: theme.normal.text1,
                      },
                    },
                  })}
                >
                  {WALLET}
                </Box>
              </Stack>

              <Box
                sx={(theme) => ({
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "22px",
                  color: theme.normal.text0,
                })}
              >
                <Trans>My Trades</Trans>
              </Box>
            </Stack>

            <Stack
              direction={["column", "column", "row"]}
              alignItems={"center"}
              gap={["24px", "24px", "64px"]}
              width={["100%", "100%", "fit-content"]}
            >
              <Stack
                direction={"row"}
                justifyContent={[
                  "space-between",
                  "space-between",
                  "flex-start",
                ]}
                width={"100%"}
                alignItems={"center"}
                gap={["none", "none", "64px"]}
                sx={() => ({
                  "& p": {
                    textAlign: ["right", "right", "left"],
                  },
                })}
              >
                {topInfo(t`Copy Trading Assets(NEST)`, `${assets}`)}
                <Box
                  sx={() => ({
                    textAlign: ["right", "right", "left"],
                  })}
                >
                  {topInfo(t`Profit(NEST)`, `${profit}`)}
                </Box>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={[
                  "space-between",
                  "space-between",
                  "flex-start",
                ]}
                width={"100%"}
                alignItems={"center"}
                gap={["none", "none", "64px"]}
              >
                {topInfo(t`Unrealized PnL(NEST)`, `${unRealizedPnl}`)}
                <Box
                  sx={() => ({
                    textAlign: ["right", "right", "left"],
                  })}
                >
                  {topInfo(t`Copy Orders`, `${copyOrders}`)}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={"24px"}>
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            paddingX={"20px"}
            width={"100%"}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.normal.border}`,
            })}
          >
            {tabs}
          </Stack>
          {tabsView}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MyCopies;
