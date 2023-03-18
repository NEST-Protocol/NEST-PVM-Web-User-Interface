import {Box, Stack, styled} from "@mui/material";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {createChart, LineStyle} from "lightweight-charts";
import useTheme from "../../../hooks/useTheme";

interface TVChartProps {
  title1: string;
  value1: string;
  title2: string;
  value2: string;
  data: {
    time: Date,
    value: number
  }[];
}

const TVChartDiv = styled(Stack)(({theme}) => ({
  width: '100%',
  padding: '20px',
}))

const Title1 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2
}))

const Value1 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "32px",
  lineHeight: "44px",
  color: theme.normal.text0,
  'span': {
    fontSize: '28px',
    lineHeight: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "24px",
    lineHeight: "32px",
    'span': {
      fontSize: '18px',
      lineHeight: '24px',
    }
  }
}))

const Title2 = styled("div")(({theme}) => ({
  paddingTop: '4px',
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2,
  [theme.breakpoints.down('sm')]: {
    fontWeight: "400",
    textAlign: 'end',
  }
}))

const Value2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "28px",
  lineHeight: "40px",
  color: theme.normal.text0,
  'span': {
    fontSize: "28px",
    lineHeight: "40px",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'end',
    'span': {
      fontSize: "14px",
      lineHeight: "20px",
      textAlign: 'end',
    }
  }
}))

const TVChart: FC<TVChartProps> = ({...props}) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const [currentChart, setCurrentChart] = useState<any>(null);
  const [currentSeries, setCurrentSeries] = useState<any>(null);
  const [chartInited, setChartInited] = useState(false);
  const [select, setSelect] = useState({
    time: '',
    value: 0,
  });
  const {nowTheme} = useTheme();

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
        priceFormatter: (price: number) => {
          return `${(price).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}`;
        }
      },
      layout: {
        background: {
          type: "solid",
          color: "transparent",
        },
        textColor: nowTheme.normal.text2,
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
      crosshair: {
        vertLine: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.text2,
        },
        horzLine: {
          style: LineStyle.Dashed,
          color: nowTheme.normal.text2,
        }
      }
    }),
    [nowTheme]
  );

  const scaleChart = useCallback(() => {
    const from = Date.now() / 1000 - 7 * 86400;
    const to = Date.now() / 1000;
    currentChart.timeScale().setVisibleRange({from, to});
  }, [currentChart]);

  useEffect(() => {
    if (currentSeries && props.data?.length) {
      currentSeries.setData(props.data);
      if (!chartInited) {
        scaleChart();
        setChartInited(true);
      }
    }
  }, [chartInited, currentSeries, props.data, currentChart]);

  const onCrosshairMove = useCallback((param: any) => {
      // @ts-ignore
      if (param.point === undefined || !currentSeries || !param.time || param.point.x < 0 || param.point.x > chartRef.current.offsetWidth || param.point.y < 0 || param.point.y > chartRef.current.offsetWidth) {
        // @ts-ignore
        tooltipRef.current.style.display = "none";
      } else {
        // @ts-ignore
        tooltipRef.current.style.display = "block";
        const coordinateY = param.point.y;
        const coordinateX = param.point.x;
        const toolTipWidth = 80;
        const toolTipHeight = 80;
        const toolTipMargin = 15;
        // @ts-ignore
        tooltipRef.current.style.left = coordinateX + toolTipWidth + toolTipMargin > chartRef.current.offsetWidth ? coordinateX - toolTipWidth - toolTipMargin + "px" : coordinateX + toolTipMargin + "px";
        // @ts-ignore
        tooltipRef.current.style.top = coordinateY + toolTipHeight + toolTipMargin > chartRef.current.offsetHeight ? coordinateY - toolTipHeight - toolTipMargin + "px" : coordinateY + toolTipMargin + "px";
        const value = param.seriesData.get(currentSeries).value;
        const time = param.time;
        setSelect({
          time: time,
          value: value,
        })
      }
    },
    [chartRef, currentSeries, tooltipRef]
  );

  useEffect(() => {
    if (!ref.current || currentChart) {
      return;
    }
    const chart = createChart(
      // @ts-ignore
      chartRef.current,
      // @ts-ignore
      getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
    );
    // @ts-ignore
    const series = chart.addAreaSeries({
      topColor: 'rgba(54, 197, 110, 0.38)',
      bottomColor: 'rgba(54, 197, 110, 0)',
      lineColor: 'rgba(54, 197, 110, 1)',
      lineWidth: 2
    });
    setCurrentChart(chart);
    setCurrentSeries(series);
  }, [currentChart, onCrosshairMove]);

  useEffect(() => {
    if (currentChart) {
      currentChart.subscribeCrosshairMove(onCrosshairMove);
    }
  }, [currentChart, onCrosshairMove])

  useEffect(() => {
    if (currentChart) {
      currentChart.applyOptions(
        // @ts-ignore
        getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
      );
    }
  }, [ref, currentChart, getChartOptions]);

  return (
    <TVChartDiv>
      <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
        <Title1>{props.title1}</Title1>
        <Title2>{props.title2}</Title2>
      </Stack>
      <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} pt={'8px'}>
        <Value1>{props.value1} <span>NEST</span></Value1>
        <Value2>{props.value2} <span>NEST</span></Value2>
      </Stack>
      <Stack width={'100%'} height={['134px', '134px', '200px']} ref={ref} position={'relative'}>
        <div ref={chartRef} style={{width: '100%', height: '100%', zIndex: 0}}/>
        <Box ref={tooltipRef} sx={(theme) => ({
          zIndex: 1,
          position: 'absolute',
          padding: '8px 12px',
          borderRadius: '6px',
          background: theme.normal.text0,
          display: 'none',
          color: theme.normal.bg0,
          fontSize: '12px',
          lineHeight: '16px',
        })}>
          <div style={{fontWeight: 400}}>{select.time}</div>
          <div style={{fontWeight: 700}}>{select.value.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })} NEST</div>
        </Box>
      </Stack>
    </TVChartDiv>
  )
}

export default TVChart