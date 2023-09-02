import Stack from "@mui/material/Stack";
import { FC, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import TraderCurrent from "./Components/TraderCurrent";
import TraderFollowers from "./Components/TraderFollowers";
import CopyRoute from "./Components/CopyRoute";
import TraderChartView from "./Components/TraderChartView";
import KolInfo from "./Components/KolInfo";
import useTrader from "./Hooks/useTrader";
import { useParams } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

const Trader: FC = () => {
  const { address } = useParams();
  const {nowTheme} = useTheme()
  const {
    kolInfo,
    earningsDay,
    setEarningsDay,
    tabsValue,
    setTabsValue,
    earningsData,
    performanceData,
    performanceDay,
    setPerformanceDay,
    performanceSymbolDay,
    setPerformanceSymbolDay,
    performanceSymbolData,
    traderOrderList,
    traderOrderHistoryList,
    traderFollowerList,
  } = useTrader(address ?? "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const tabs = useMemo(() => {
    const data = [
      <Box>
        <Trans>Analysis</Trans>
      </Box>,
      <Box>
        <Trans>Current</Trans>
      </Box>,
      <Box>
        <Trans>History</Trans>
      </Box>,
      // <Box>
      //   <Trans>Followers</Trans>
      // </Box>,
    ];
    return (
      <NESTTabs
        value={tabsValue}
        className={"TraderTabs"}
        datArray={data}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={false}
      />
    );
  }, [setTabsValue, tabsValue]);
  const tabsView = useMemo(() => {
    if (tabsValue === 0) {
      return (
        <TraderChartView
          time1={earningsDay}
          setTime1={(num: number) => {
            setEarningsDay(num);
          }}
          earningsData={earningsData}
          time2={performanceDay}
          setTime2={(num: number) => {
            setPerformanceDay(num);
          }}
          performanceData={performanceData}
          time3={performanceSymbolDay}
          setTime3={(num: number) => {
            setPerformanceSymbolDay(num);
          }}
          performanceSymbolData={performanceSymbolData}
        />
      );
    } else if (tabsValue === 1) {
      return <TraderCurrent list={traderOrderList} />;
    } else if (tabsValue === 2) {
      return <TraderCurrent list={traderOrderHistoryList} history/>;
    } else if (tabsValue === 3) {
      // return <TraderFollowers list={traderFollowerList} />;
      return <></>
    } else {
      return <></>;
    }
  }, [earningsData, earningsDay, performanceData, performanceDay, performanceSymbolData, performanceSymbolDay, setEarningsDay, setPerformanceDay, setPerformanceSymbolDay, tabsValue, traderOrderHistoryList, traderOrderList]);
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      <Stack spacing={"24px"} width={"100%"} paddingBottom={"40px"}>
        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          alignItems={"center"}
          width={"100%"}
          sx={() => {
            const backgroundImage = nowTheme.isLight ? `url('/images/CopyBG2.svg')` : `url('/images/CopyBG3.svg')`
            return {
              backgroundImage: ["", "", backgroundImage],
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
          }}
        >
          <Stack spacing={"24px"} maxWidth={"1200px"} width={"100%"}>
            <CopyRoute title={t`Trader Profile`} link={"/#/copy"} />
            <KolInfo data={kolInfo} />
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          alignItems={"center"}
          width={"100%"}
        >
          <Stack spacing={"24px"} maxWidth={"1200px"} width={"100%"}>
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
    </Stack>
  );
};

export default Trader;
