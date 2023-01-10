import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createChart, UTCTimestamp } from "lightweight-charts";
import { format as formatDateFn } from "date-fns";
import "./styles";
import classNames from "classnames";
import useThemes, { ThemeType } from "../../libs/hooks/useThemes";

type TVChartProps = {
  chainId: number;
  tokenPair: string;
  chartHeight?: number;
};

const PERIOD_TYPE = [
  { label: "1M", value: "K_1M", period: 60 * 1000 },
  { label: "5M", value: "K_5M", period: 5 * 60 * 1000 },
  { label: "15M", value: "K_15M", period: 15 * 60 * 1000 },
  { label: "1H", value: "K_1H", period: 60 * 60 * 1000 },
  { label: "4H", value: "K_4H", period: 4 * 60 * 60 * 1000 },
  { label: "1D", value: "K_DAY", period: 24 * 60 * 60 * 1000 },
];

export const CHART_PERIODS = {
  K_5M: 60 * 5,
  K_15M: 60 * 15,
  K_1H: 60 * 60,
  K_4H: 60 * 60 * 4,
  K_DAY: 60 * 60 * 24,
};

export function formatDateTime(time: number) {
  return formatDateFn(time * 1000, "dd MMM yyyy, h:mm a");
}

const TVChart: FC<TVChartProps> = ({ chainId, tokenPair, chartHeight}) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState<any>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState(null);
  const [period, setPeriod] = useState("K_5M");
  const [priceData, setPriceData] = useState<any[]>([]);
  const [currentSeries, setCurrentSeries] = useState<any>();
  const [chartInited, setChartInited] = useState(false);
  const { theme } = useThemes();

  const getPriceData = useCallback(async () => {
    try {
      const k_data = await fetch(
        `https://api.nestfi.net/api/oracle/get_cur_kline/${
          chainId?.toString() || 56
        }/0/${tokenPair.toLocaleLowerCase() + "usdt"}/${period}/1000`
      );
      const k_data_value = await k_data.json();
      setPriceData(
        k_data_value["value"].map((item: any) => ({
          close: Number(item.close.toFixed(2)),
          high: Math.max(Number(item.open.toFixed(2)), Number(item.close.toFixed(2))),
          low: Math.min(Number(item.open.toFixed(2)), Number(item.close.toFixed(2))),
          open: Number(item.open.toFixed(2)),
          time: item.timestamp as UTCTimestamp,
        }))
      );
    } catch (error) {
      console.log(error)
    }
  }, [chainId, tokenPair, period]);

  useEffect(() => {
    getPriceData();
    const internal = setInterval(() => {
      getPriceData();
    }, 60 * 1000);
    return () => clearInterval(internal);
  }, [getPriceData]);

  const getSeriesOptions = () => ({
    lineColor: "#5472cc",
    topColor: "rgba(49, 69, 131, 0.4)",
    bottomColor: "rgba(42, 64, 103, 0.0)",
    lineWidth: 2,
    priceLineColor: "#3a3e5e",
    downColor: "#fa3c58",
    wickDownColor: "#fa3c58",
    upColor: "#0ecc83",
    wickUpColor: "#0ecc83",
    borderVisible: false,
  });

  const scaleChart = useCallback(() => {
    // @ts-ignore
    const from = Date.now() / 1000 - (7 * 24 * CHART_PERIODS[period]) / 2;
    const to = Date.now() / 1000;
    currentChart.timeScale().setVisibleRange({ from, to });
  }, [currentChart, period]);

  const getChartOptions = useCallback(
    (width: number, height: number) => ({
      width,
      height,
      layout: {
        backgroundColor: "transparent",
        textColor:
          theme === ThemeType.dark ? "rgba(197, 197, 197, 1)" : "black",
        fontFamily: "Montserrat",
      },
      localization: {
        locale: "en-US",
        timeFormatter: (timestamp: number) => {
          return formatDateTime(timestamp);
        },
      },
      grid: {
        vertLines: {
          visible: false,
          color: "rgba(35, 38, 59, 1)",
          style: 2,
        },
        horzLines: {
          visible: false,
          color: "rgba(35, 38, 59, 1)",
          style: 2,
        },
      },
      timeScale: {
        visible: true,
        rightOffset: 5,
        borderVisible: true,
        barSpacing: 5,
        timeVisible: true,
        secondsVisible: true,
        fixLeftEdge: true,
      },
      priceScale: {
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          color: "black",
        },
        vertLine: {
          color: "black",
        },
        mode: 0,
      },
    }),
    [theme]
  );

  const onCrosshairMove = useCallback(
    (evt) => {
      if (!evt.time) {
        setHoveredCandlestick(null);
        return;
      }

      for (const point of evt.seriesPrices.values()) {
        setHoveredCandlestick((hoveredCandlestick: any) => {
          if (hoveredCandlestick && hoveredCandlestick.time === evt.time) {
            // rerender optimisations
            return hoveredCandlestick;
          }
          return {
            time: evt.time,
            ...point,
          };
        });
        break;
      }
    },
    [setHoveredCandlestick]
  );

  useEffect(() => {
    if (currentSeries && priceData && priceData.length) {
      currentSeries.setData(priceData);

      if (!chartInited) {
        scaleChart();
        setChartInited(true);
      }
    }
  }, [priceData, currentSeries, chartInited, scaleChart]);

  useEffect(() => {
    if (!ref.current || !priceData || !priceData.length || currentChart) {
      return;
    }
    const chart = createChart(
      // @ts-ignore
      chartRef.current,
      // @ts-ignore
      getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight
      )
    );

    chart.subscribeCrosshairMove(onCrosshairMove);

    const series = chart.addCandlestickSeries(getSeriesOptions());

    setCurrentChart(chart);
    setCurrentSeries(series);
  }, [ref, priceData, currentChart, onCrosshairMove, getChartOptions]);

  useEffect(() => {
    if (currentChart && chartHeight) {
      currentChart.applyOptions(
        // @ts-ignore
        getChartOptions(chartRef.current.offsetWidth, chartHeight)
      );
    }
  }, [currentChart, getChartOptions, chartHeight]);

  const candlestick = useMemo(() => {
    if (!priceData) {
      return null;
    }
    if (hoveredCandlestick) {
      return hoveredCandlestick;
    }
    if (priceData[priceData.length - 1]) {
      return priceData[priceData.length - 1];
    }
    return null;
  }, [priceData, hoveredCandlestick]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
      className="TVChart"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        className={classNames({
          [`TVChart-topView`]: true,
          [`TVChart-topView-green`]: parseFloat(candlestick?.close) > parseFloat(candlestick?.open)
        })}
      >
        <div>
          <a>O:</a>
          <a>{candlestick?.open}</a>
        </div>
        <div>
          <a>C:</a>
          <a>{candlestick?.close}</a>
        </div>
        <div>
          <a>L:</a>
          <a>{candlestick?.low}</a>
        </div>
        <div>
          <a>H:</a>
          <a>{candlestick?.high}</a>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        className="TVChart-button"
      >
        {PERIOD_TYPE.map((item, index) => (
          <button
            key={index}
            onClick={() => setPeriod(item.value)}
            className={classNames({
              [`selected`]: period === item.value,
            })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        ref={chartRef}
        style={{ height: "100%", width: "100%" }}
        className="TVChart-mainView"
      ></div>
    </div>
  );
};

export default TVChart;
