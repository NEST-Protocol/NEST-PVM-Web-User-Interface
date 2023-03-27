import {TVDataProvider} from "../components/TVChartContainer/TVDataProvider";
import {useChainId} from "wagmi";
import {useEffect, useMemo, useRef} from "react";
import {
  Bar,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SubscribeBarsCallback
} from "../charting_library";

export const SUPPORTED_RESOLUTIONS = { 5: "5m", 15: "15m", 60: "1h", 240: "4h", "1D": "1d" };

export type SymbolInfo = LibrarySymbolInfo & {
  isStable: boolean;
};

const configurationData = {
  supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS),
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  reset_cache_timeout: 100,
};

type Props = {
  dataProvider?: TVDataProvider;
};

export default function useTVDatafeed({ dataProvider }: Props) {
  const chainId = useChainId();
  const resetCacheRef = useRef<() => void | undefined>();
  const tvDataProvider = useRef<TVDataProvider>();
  const activeTicker = useRef<string | undefined>();
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
        // resolve symbol info by symbol name
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
            isStable: true,
          };
          setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        },

        async getBars(
          symbolInfo: SymbolInfo,
          resolution: ResolutionString,
          periodParams: PeriodParams,
          onHistoryCallback: HistoryCallback,
          onErrorCallback: (error: string) => void
        ) {
          const { ticker, isStable } = symbolInfo;
          if (activeTicker.current !== ticker) {
            activeTicker.current = ticker;
          }
          try {
            if (!ticker) {
              onErrorCallback("Invalid ticker!");
              return;
            }
            const bars = await tvDataProvider.current?.getBars(
              chainId,
              ticker,
              resolution,
              isStable,
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
          symbolInfo: SymbolInfo,
          resolution: ResolutionString,
          onRealtimeCallback: SubscribeBarsCallback,
          _subscribeUID: any,
          onResetCacheNeededCallback: () => void
        ) {

        },
        unsubscribeBars: (
          subscriberUID: any
        ) => {

        },
      },
    };
  }, [chainId]);
}