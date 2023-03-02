import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createChart, UTCTimestamp } from "lightweight-charts";
import "./styles";
import classNames from "classnames";
import useThemes, { ThemeType } from "../../libs/hooks/useThemes";

type TVChartProps = {
  chainId: number;
  tokenPair: string;
  chartHeight?: number;
  close: number;
};

function timeToLocal(originalTime: number) {
  const d = new Date(originalTime * 1000);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

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

const TVChart: FC<TVChartProps> = ({ chainId, tokenPair, chartHeight, close}) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState<any>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState(null);
  const [period, setPeriod] = useState("K_5M");
  const [priceData, setPriceData] = useState<{[key:string]:any[]}>({});
  const [currentSeries, setCurrentSeries] = useState<any>();
  const [chartInited, setChartInited] = useState(false);
  const { theme } = useThemes();

  const getPriceData = useCallback(async () => {
    try {
      const dataCount = () => {
        if (period === "K_1M") {
          return 1000
        } else if (period === "K_5M") {
          return 200
        } else {
          return 100
        }
      }
      const k_data = await fetch(
        `https://api.nestfi.net/api/oracle/get_cur_kline/${
          chainId?.toString() || 56
        }/0/${tokenPair.toLocaleLowerCase() + "usdt"}/${period}/${dataCount()}`
      );
      const k_data_value = await k_data.json();
      const data = {...priceData}
      data[`${period}${tokenPair}`] = k_data_value["value"].map((item: any) => ({
        close: Number(item.close.toFixed(2)),
        high: Math.max(Number(item.open.toFixed(2)), Number(item.close.toFixed(2))),
        low: Math.min(Number(item.open.toFixed(2)), Number(item.close.toFixed(2))),
        open: Number(item.open.toFixed(2)),
        time: timeToLocal(item.timestamp) as UTCTimestamp,
      }))
      setPriceData(data);
    } catch (error) {
      console.log(error)
    }
  }, [chainId, tokenPair, period]);

  const updateClose = useCallback(() => {
    if (close && priceData[`${period}${tokenPair}`] && priceData[`${period}${tokenPair}`].length) {
      console.log('updated', close)
      const data = {...priceData}
      data[`${period}${tokenPair}`][priceData[`${period}${tokenPair}`].length - 1].close = close
      setPriceData(data)
    }
  }, [close, period, tokenPair])

  useEffect(() => {
    updateClose()
  }, [updateClose])

  useEffect(() => {
    getPriceData();
    const internal = setInterval(() => {
      getPriceData();
    },30 * 1000);
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
        shiftVisibleRangeOnNewBar: true,
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
    if (currentSeries && priceData[`${period}${tokenPair}`] && priceData[`${period}${tokenPair}`].length) {
      currentSeries.setData(priceData[`${period}${tokenPair}`]);

      if (!chartInited) {
        scaleChart();
        setChartInited(true);
      }
    }
  }, [chartInited, currentSeries, period, priceData, scaleChart, tokenPair]);

  useEffect(() => {
    if (!ref.current || !priceData[`${period}${tokenPair}`] || !priceData[`${period}${tokenPair}`].length || currentChart) {
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
  }, [ref, priceData, currentChart, onCrosshairMove, getChartOptions, period, tokenPair]);

  useEffect(() => {
    if (currentChart && chartHeight) {
      currentChart.applyOptions(
        // @ts-ignore
        getChartOptions(chartRef.current.offsetWidth, chartHeight)
      );
    }
  }, [currentChart, getChartOptions, chartHeight, theme]);

  const candlestick = useMemo(() => {
    const data = priceData[`${period}${tokenPair}`]
    if (!data) {
      return null;
    }
    if (hoveredCandlestick) {
      return hoveredCandlestick;
    }
    if (data[data.length - 1]) {
      return data[data.length - 1];
    }
    return null;
  }, [priceData, period, tokenPair, hoveredCandlestick]);

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
