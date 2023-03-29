import { useEffect, useRef, useState } from "react";
import { defaultChartProps, DEFAULT_PERIOD } from "./constants";
import useTVDatafeed from "../../domain/tradingview/useTVDatafeed";
import { IChartingLibraryWidget } from "../../charting_library";
import { getObjectKeyFromValue } from "../../domain/tradingview/utils";
import { SUPPORTED_RESOLUTIONS, TV_CHART_RELOAD_INTERVAL } from "../../config/tradingview";
import { isChartAvailabeForToken } from "../../config/tokens";
import { TVDataProvider } from "../../domain/tradingview/TVDataProvider";
import { useLocalStorageSerializeKey } from "../../lib/localStorage";
import { CHART_PERIODS } from "../../lib/legacy";
import {Box, CircularProgress} from "@mui/material";
import useTheme from "../../hooks/useTheme";

type Props = {
  symbol: string;
  chainId: number;
  dataProvider?: TVDataProvider;
};

export default function TVChartContainer({
                                           symbol,
                                           chainId,
                                           dataProvider,
                                         }: Props) {
  let [period, setPeriod] = useLocalStorageSerializeKey([chainId, "Chart-period"], DEFAULT_PERIOD);

  if (!period || !(period in CHART_PERIODS)) {
    period = DEFAULT_PERIOD;
  }

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const { datafeed, resetCache } = useTVDatafeed({ dataProvider });
  const symbolRef = useRef(symbol);
  const { nowTheme } = useTheme();

  /* Tradingview charting library only fetches the historical data once so if the tab is inactive or system is in sleep mode
  for a long time, the historical data will be outdated. */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem("tv-chart-reload-timestamp", Date.now().toString());
      } else {
        const tvReloadTimestamp = Number(localStorage.getItem("tv-chart-reload-timestamp"));
        if (tvReloadTimestamp && Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL) {
          if (resetCache) {
            resetCache();
            tvWidgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    if (chartReady && tvWidgetRef.current && symbol !== tvWidgetRef.current?.activeChart?.().symbol()) {
      if (isChartAvailabeForToken(chainId, symbol)) {
        tvWidgetRef.current.setSymbol(symbol, tvWidgetRef.current.activeChart().resolution(), () => {});
      }
    }
  }, [symbol, chartReady, period, chainId]);

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: symbolRef.current, // Using ref to avoid unnecessary re-renders on symbol change and still have access to the latest symbol
      datafeed: datafeed,
      theme: nowTheme.isLight ? "Light" : "Dark",
      container: chartContainerRef.current,
      library_path: defaultChartProps.library_path,
      locale: defaultChartProps.locale,
      loading_screen: defaultChartProps.loading_screen,
      enabled_features: defaultChartProps.enabled_features,
      disabled_features: defaultChartProps.disabled_features,
      client_id: defaultChartProps.clientId,
      user_id: defaultChartProps.userId,
      fullscreen: defaultChartProps.fullscreen,
      autosize: defaultChartProps.autosize,
      custom_css_url: defaultChartProps.custom_css_url,
      overrides: defaultChartProps.overrides,
      interval: getObjectKeyFromValue(period, SUPPORTED_RESOLUTIONS),
      favorites: defaultChartProps.favorites,
      custom_formatters: defaultChartProps.custom_formatters,
    };
    tvWidgetRef.current = new window.TradingView.widget(widgetOptions);
    tvWidgetRef.current!.onChartReady(function () {
      setChartReady(true);
      tvWidgetRef.current
        ?.activeChart()
        .onIntervalChanged()
        .subscribe(null, (interval) => {
          // @ts-ignore
          if (SUPPORTED_RESOLUTIONS[interval]) {
            // @ts-ignore
            const period = SUPPORTED_RESOLUTIONS[interval];
            setPeriod(period);
          }
        });

      tvWidgetRef.current?.activeChart().dataReady(() => {
        setChartDataLoading(false);
      });
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
        setChartReady(false);
        setChartDataLoading(true);
      }
    };
    // We don't want to re-initialize the chart when the symbol changes. This will make the chart flicker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, nowTheme]);

  return (
    <Box sx={(theme) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
      "& svg": {
        display: "block",
        color: theme.normal.primary,
      }
    })}>
      {chartDataLoading && <CircularProgress size={'44px'}/>}
      <div
        style={{
          visibility: !chartDataLoading ? "visible" : "hidden",
          position: 'absolute', bottom: 0, left: 0, right: 0, top: 0  }}
        ref={chartContainerRef}
      />
    </Box>
  )
}