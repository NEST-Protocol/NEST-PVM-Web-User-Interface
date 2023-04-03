import {
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SubscribeBarsCallback
} from "../../charting_library";
import { SUPPORTED_RESOLUTIONS } from "../../config/tradingview";
import { useEffect, useMemo, useRef } from "react";
import { TVDataProvider } from "./TVDataProvider";
import { formatTimeInBarToMs } from "./utils";

const configurationData = {
  supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS),
  has_intraday: true,
  has_seconds: true,
  seconds_multipliers: ["1"],
  intraday_multipliers: ["1", "2"],
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  reset_cache_timeout: 100,
};

type Props = {
  dataProvider?: TVDataProvider;
};

export default function useTVDatafeed({ dataProvider }: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const resetCacheRef = useRef<() => void | undefined>();
  const activeTicker = useRef<string | undefined>();
  const tvDataProvider = useRef<TVDataProvider>();
  const shouldRefetchBars = useRef<boolean>(false);

  useEffect(() => {
    if (dataProvider && tvDataProvider.current !== dataProvider) {
      tvDataProvider.current = dataProvider;
    }
  }, [dataProvider]);

  return useMemo(() => {
    return {
      resetCache: function () {
        shouldRefetchBars.current = true;
        resetCacheRef.current?.();
        shouldRefetchBars.current = false;
      },
      datafeed: {
        onReady: (callback: any) => {
          setTimeout(() => callback(configurationData));
        },
        resolveSymbol(symbolName: string, onSymbolResolvedCallback: any) {
          const symbolInfo = {
            name: symbolName,
            type: "crypto",
            description: symbolName + " / USD",
            ticker: symbolName,
            session: "24x7",
            minmov: 1,
            pricescale: 100,
            timezone: "Etc/UTC",
            has_intraday: true,
            has_daily: true,
            currency_code: "USD",
            visible_plots_set: "ohlc",
            data_status: "streaming",
          };
          setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        },

        async getBars(
          symbolInfo: LibrarySymbolInfo,
          resolution: ResolutionString,
          periodParams: PeriodParams,
          onHistoryCallback: HistoryCallback,
          onErrorCallback: (error: string) => void
        ) {
          // @ts-ignore
          if (!SUPPORTED_RESOLUTIONS[resolution]) {
            return onErrorCallback("[getBars] Invalid resolution");
          }
          const { ticker } = symbolInfo;
          if (activeTicker.current !== ticker) {
            activeTicker.current = ticker;
          }

          try {
            if (!ticker) {
              onErrorCallback("Invalid ticker!");
              return;
            }
            const bars = await tvDataProvider.current?.getBars(
              ticker,
              resolution,
              periodParams,
              shouldRefetchBars.current
            );
            const noData = !bars || bars.length === 0;
            // @ts-ignore
            onHistoryCallback(bars, { noData });
          } catch {
            onErrorCallback("Unable to load historical data!");
          }
        },
        async subscribeBars(
          symbolInfo: LibrarySymbolInfo,
          resolution: ResolutionString,
          onRealtimeCallback: SubscribeBarsCallback,
          _subscribeUID: any,
          onResetCacheNeededCallback: () => void
        ) {
          const { ticker } = symbolInfo;
          if (!ticker) {
            return;
          }
          intervalRef.current && clearInterval(intervalRef.current);
          resetCacheRef.current = onResetCacheNeededCallback;
          intervalRef.current = setInterval(function () {
            tvDataProvider.current?.getLiveBar(ticker, resolution).then((bar) => {
              if (bar && ticker === activeTicker.current) {
                onRealtimeCallback(formatTimeInBarToMs(bar));
              }
            });
          }, 1000);
        },
        unsubscribeBars: () => {
          intervalRef.current && clearInterval(intervalRef.current);
        },
      },
    };
  }, []);
}
