import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {createChart, LineStyle, UTCTimestamp} from "lightweight-charts";
import useNEST from "../../hooks/useNEST";
import Box from "@mui/material/Box";
import Stack from "@mui/system/Stack";
import { styled } from "@mui/material/styles";
import useTheme from "../../hooks/useTheme";
import useWindowWidth from "../../hooks/useWindowWidth";

type TVChartProps = {
  tokenPair: string;
  period: string;
  close: number;
};

function timeToLocal(originalTime: number) {
  const d = new Date(originalTime * 1000);
  return (
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    ) / 1000
  );
}

const TVChart: FC<TVChartProps> = ({ tokenPair, period, close }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState<any>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState(null);
  const [priceData, setPriceData] = useState<{ [key: string]: any[] }>({});
  const [currentSeries, setCurrentSeries] = useState<any>();
  const [chartInitialized, setChartInitialized] = useState(false);
  const { chainsData } = useNEST();
  const { nowTheme } = useTheme();
  const { isMobile, isPCPad } = useWindowWidth();

  const chainId = useMemo(() => {
    return chainsData.chainId ?? 56;
  }, [chainsData.chainId]);

  const getPriceData = useCallback(async () => {
    try {
      const dataCount = () => {
        switch (period) {
          case "K_15S":
            return 1000;
          case "K_1M":
            return 1000;
          case "K_5M":
            return 200;
          default:
            return 100;
        }
      };
      const k_data = await fetch(
        `https://api.nestfi.net/api/oracle/get_cur_kline/${
          chainId?.toString() || 56
        }/0/${tokenPair.toLocaleLowerCase() + "usdt"}/${period}/${dataCount()}`
      );
      const k_data_value = await k_data.json();
      const data = { ...priceData };
      data[`${period}${tokenPair}`] = k_data_value["value"].map(
        (item: any) => ({
          close: Number(item.close.toFixed(2)),
          high: Math.max(
            Number(item.open.toFixed(2)),
            Number(item.close.toFixed(2))
          ),
          low: Math.min(
            Number(item.open.toFixed(2)),
            Number(item.close.toFixed(2))
          ),
          open: Number(item.open.toFixed(2)),
          time: timeToLocal(item.timestamp) as UTCTimestamp,
        })
      );
      setPriceData(data);
    } catch (error) {
      console.log(error);
    }
  }, [chainId, tokenPair, period]);

  const updateClose = useCallback(() => {
    if (
      close &&
      priceData[`${period}${tokenPair}`] &&
      priceData[`${period}${tokenPair}`].length
    ) {
      const data = { ...priceData };
      data[`${period}${tokenPair}`][
        priceData[`${period}${tokenPair}`].length - 1
      ].close = close;
      setPriceData(data);
    }
  }, [close, period, tokenPair]);

  useEffect(() => {
    updateClose();
  }, [updateClose]);

  useEffect(() => {
    getPriceData();
    const internal = setInterval(() => {
      getPriceData();
    }, 15_000);
    return () => clearInterval(internal);
  }, [getPriceData]);

  const getSeriesOptions = useMemo(
    () => ({
      downColor: nowTheme.normal.danger,
      wickDownColor: nowTheme.normal.danger,
      upColor: nowTheme.normal.success,
      wickUpColor: nowTheme.normal.success,
      borderVisible: false,
    }),
    [nowTheme.normal.danger, nowTheme.normal.success]
  );

  const getChartOptions = useCallback(
    (width: number, height: number) => ({
      width,
      height,
      layout: {
        background: {
          type: "solid",
          color: "transparent",
        },
        textColor: nowTheme.normal.text2,
        fontFamily: "Open Sans",
      },
      localization: {
        locale: "en-US",
      },
      grid: {
        vertLines: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.border,
        },
        horzLines: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.border,
        },
      },
      timeScale: {
        visible: true,
        rightOffset: 5,
        borderVisible: false,
        barSpacing: 5,
        timeVisible: true,
        secondsVisible: true,
        fixLeftEdge: true,
        shiftVisibleRangeOnNewBar: true,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.text2,
        },
        vertLine: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.text2,
        },
        mode: 0,
      },
    }),
    [nowTheme]
  );

  const onCrosshairMove = useCallback(
    (evt: any) => {
      if (!evt.time || !evt.seriesData) {
        setHoveredCandlestick(null);
        return;
      }
      const value = evt.seriesData.get(currentSeries);
      setHoveredCandlestick(value);
    },
    [currentSeries]
  );

  useEffect(() => {
    if (
      currentSeries &&
      priceData[`${period}${tokenPair}`] &&
      priceData[`${period}${tokenPair}`].length
    ) {
      currentSeries.setData(priceData[`${period}${tokenPair}`]);

      if (!chartInitialized) {
        setChartInitialized(true);
      }
    }
  }, [chartInitialized, currentSeries, period, priceData, tokenPair]);

  useEffect(() => {
    if (
      !ref.current ||
      !priceData[`${period}${tokenPair}`] ||
      !priceData[`${period}${tokenPair}`].length ||
      currentChart
    ) {
      return;
    }
    const chart = createChart(
      // @ts-ignore
      chartRef.current,
      // @ts-ignore
      getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
    );

    const series = chart.addCandlestickSeries(getSeriesOptions);

    setCurrentChart(chart);
    setCurrentSeries(series);
  }, [
    ref,
    priceData,
    currentChart,
    onCrosshairMove,
    getChartOptions,
    period,
    tokenPair,
    getSeriesOptions,
  ]);

  useEffect(() => {
    if (currentChart) {
      currentChart.subscribeCrosshairMove(onCrosshairMove);
    }
  }, [currentChart, onCrosshairMove])

  useEffect(() => {
    if (currentChart) {
      currentChart.applyOptions(
        // @ts-ignore
        getChartOptions(chartRef.current.offsetWidth)
      );
    }
  }, [currentChart, getChartOptions, nowTheme.isLight]);

  const candlestick = useMemo(() => {
    const data = priceData[`${period}${tokenPair}`];
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

  const InfoStack = styled(Stack)(({ theme }) => ({
    padding: isPCPad ? "0 24px" : isMobile ? "0 12px" : "0 20px",
    height: "30px",
    "& div": {
      "& a": {
        fontWeight: 400,
        fontSize: 10,
        color: theme.normal.text2,
      },
      "& a + a": {
        color:
          parseFloat(candlestick?.close) > parseFloat(candlestick?.open)
            ? theme.normal.success
            : theme.normal.danger,
        marginLeft: "4px",
      },
    },
  }));

  return (
    <Box
      ref={ref}
      sx={(theme) => {
        return {
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%"
        };
      }}
      component={"div"}
    >
      <InfoStack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={"12px"}
      >
        <div>
          <Box component={"a"}>O:</Box>
          <Box component={"a"}>{candlestick?.open}</Box>
        </div>
        <div>
          <Box component={"a"}>C:</Box>
          <Box component={"a"}>{candlestick?.close}</Box>
        </div>
        <div>
          <Box component={"a"}>L:</Box>
          <Box component={"a"}>{candlestick?.low}</Box>
        </div>
        <div>
          <Box component={"a"}>H:</Box>
          <Box component={"a"}>{candlestick?.high}</Box>
        </div>
      </InfoStack>
      <div
        ref={chartRef}
        style={{ height: "100%", width: "100%" }}
        className="TVChart-mainView"
      ></div>
    </Box>
  );
};

export default TVChart;
