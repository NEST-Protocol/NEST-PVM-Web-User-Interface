import { FC, useCallback, useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import axios from "axios";

const TVChart: FC = () => {
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState<any>();
  const [currentSeries, setCurrentSeries] = useState<any>();
  const [chartInited, setChartInited] = useState(false);
  const [data, setData] = useState([]);
  const { theme } = useThemes();

  const getData = useCallback(async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const res = await axios({
        method: "get",
        url: `https://api.nestfi.net/api/dashboard/txVolume/list?from=2022-11-28&to=${todayStr}`
      })
      if (res.data) {
        setData(res.data.value.map((item: any) => ({
          time: item.date,
          value: item.value
        })))
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 30_000)
    return () => {
      clearInterval(interval)
    }
  }, [getData]);

  const getChartOptions = useCallback(
    (width: number, height: number) => ({
      width,
      height,
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      localization: {
        locale: "en-US",
      },
      layout: {
        backgroundColor: 'transparent',
        textColor:
          theme === ThemeType.dark ? "rgba(197, 197, 197, 1)" : "black",
        fontFamily: "Montserrat",
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    }),
    [theme]
  );

  useEffect(() => {
    if (currentSeries) {
      currentSeries.setData(data);
      currentChart.timeScale().fitContent();
      if (!chartInited) {
        setChartInited(true);
      }
    }
  }, [chartInited, currentSeries, data, currentChart]);

  useEffect(() => {
    if (currentChart) {
      return;
    }
    const chart = createChart(
      // @ts-ignore
      chartRef.current,
      // @ts-ignore
      getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
    );

    const series = chart.addAreaSeries({
        topColor: 'rgba(33, 150, 243, 0.56)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
        lineWidth: 2
      });

    setCurrentChart(chart);
    setCurrentSeries(series);
  }, [currentChart, getChartOptions]);

  useEffect(() => {
    if (currentChart) {
      currentChart.applyOptions(
        // @ts-ignore
        getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
      );
    }
  }, [currentChart, getChartOptions]);

  return (
    <div
      ref={chartRef}
      style={{ height: "100%", width: "100%", borderRadius: '20px', overflow: 'hidden' }}
      className="TVChart-mainView"
    ></div>
  );
};

export default TVChart;
