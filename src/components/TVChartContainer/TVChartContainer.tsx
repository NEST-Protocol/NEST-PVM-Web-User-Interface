import {TVDataProvider} from "./TVDataProvider";
import {useLocalStorageSerializeKey} from "../../lib/localStorage";
import {DEFAULT_PERIOD, defaultChartProps, disabledFeaturesOnMobile} from "./constants";
import {useCallback, useEffect, useRef, useState} from "react";
import {ChartData, IChartingLibraryWidget, IPositionLineAdapter} from "../../charting_library";
import {useLocalStorage, useMedia} from "react-use";
import useTVDatafeed, {SUPPORTED_RESOLUTIONS} from "../../hooks/useTVDatafeed";

export const TV_CHART_RELOAD_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function getObjectKeyFromValue(value: any, object: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

export const CHART_PERIODS = {
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
};

type ChartLine = {
  price: number;
  title: string;
};

type Props = {
  symbol: string;
  chainId: number;
  savedShouldShowPositionLines: boolean;
  chartLines: ChartLine[];
  onSelectToken: () => void;
  dataProvider?: TVDataProvider;
};

export default function TVChartContainer(
  {
    symbol,
    chainId,
    savedShouldShowPositionLines,
    chartLines,
    onSelectToken,
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
  const isMobile = useMedia("(max-width: 550px)");
  const symbolRef = useRef(symbol);


  const drawLineOnChart = useCallback(
    (title: string, price: number) => {
      if (chartReady && tvWidgetRef.current?.activeChart?.().dataReady()) {
        const chart = tvWidgetRef.current.activeChart();
        const positionLine = chart.createPositionLine({ disableUndo: true });

        return positionLine
          .setText(title)
          .setPrice(price)
          .setQuantity("")
          .setLineStyle(1)
          .setLineLength(1)
          .setBodyFont(`normal 12pt "Relative", sans-serif`)
          .setBodyTextColor("#fff")
          .setLineColor("#3a3e5e")
          .setBodyBackgroundColor("#3a3e5e")
          .setBodyBorderColor("#3a3e5e");
      }
    },
    [chartReady]
  );


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

  useEffect(
    function updateLines() {
      const lines: (IPositionLineAdapter | undefined)[] = [];
      if (savedShouldShowPositionLines) {
        chartLines.forEach((order) => {
          lines.push(drawLineOnChart(order.title, order.price));
        });
      }
      return () => {
        lines.forEach((line) => line?.remove());
      };
    },
    [chartLines, savedShouldShowPositionLines, drawLineOnChart]
  );

  useEffect(() => {
    if (chartReady && tvWidgetRef.current && symbol !== tvWidgetRef.current?.activeChart?.().symbol()) {
      tvWidgetRef.current.setSymbol(symbol, tvWidgetRef.current.activeChart().resolution(), () => {})
    }
  }, [symbol, chartReady, period, chainId]);

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: symbolRef.current, // Using ref to avoid unnecessary re-renders on symbol change and still have access to the latest symbol
      datafeed: datafeed,
      theme: defaultChartProps.theme,
      container: chartContainerRef.current,
      library_path: defaultChartProps.library_path,
      locale: defaultChartProps.locale,
      loading_screen: defaultChartProps.loading_screen,
      enabled_features: defaultChartProps.enabled_features,
      disabled_features: isMobile
        ? defaultChartProps.disabled_features.concat(disabledFeaturesOnMobile)
        : defaultChartProps.disabled_features,
      client_id: defaultChartProps.clientId,
      user_id: defaultChartProps.userId,
      fullscreen: defaultChartProps.fullscreen,
      autosize: defaultChartProps.autosize,
      custom_css_url: defaultChartProps.custom_css_url,
      overrides: defaultChartProps.overrides,
      interval: getObjectKeyFromValue(period, SUPPORTED_RESOLUTIONS),
      favorites: defaultChartProps.favorites,
      custom_formatters: defaultChartProps.custom_formatters,
      // save_load_adapter: new SaveLoadAdapter(chainId, tvCharts, setTvCharts, onSelectToken),
    };
    // @ts-ignore
    tvWidgetRef.current = new window.TradingView.widget(widgetOptions);
    tvWidgetRef.current!.onChartReady(function () {
      setChartReady(true);
      tvWidgetRef.current!.applyOverrides({
        "paneProperties.background": "#16182e",
        "paneProperties.backgroundType": "solid",
      });
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
  }, [chainId]);


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
    }}>
      <div
        style={{position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
        ref={chartContainerRef}
      />
    </div>
  )
}