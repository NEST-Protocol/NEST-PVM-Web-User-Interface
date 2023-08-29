import { Trans, t } from "@lingui/macro";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FC, useCallback, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Sector, Cell } from "recharts";
import useTheme from "../../../hooks/useTheme";
import SelectTime from "./SelectTime";
import {
  EarningsListModel,
  PerformanceModel,
  PerformanceSymbolModel,
} from "../Hooks/useTrader";

const COLORS = [
  "#EAAA00",
  "#3577FF",
  "#9F00EA",
  "#EA0062",
  "#36C56E",
  "#EF8839",
  "#00B2EA",
];

interface TraderChartViewProps {
  time1: number;
  setTime1: (num: number) => void;
  earningsData: EarningsListModel[];
  time2: number;
  setTime2: (num: number) => void;
  performanceData: PerformanceModel | undefined;
  time3: number;
  setTime3: (num: number) => void;
  performanceSymbolData: PerformanceSymbolModel[];
}

const TraderChartView: FC<TraderChartViewProps> = ({ ...props }) => {
  const { nowTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const pnlRatio = props.performanceData
    ? `${props.performanceData.pnlRatio.floor(2)}%`
    : String().placeHolder;
  const ordersNumber = props.performanceData
    ? `${props.performanceData.ordersNumber}`
    : String().placeHolder;
  const cumulativeTraders = props.performanceData
    ? `${props.performanceData.cumlativeTraders}`
    : String().placeHolder;
  const losingTraders = props.performanceData
    ? `${props.performanceData.losingTraders}`
    : String().placeHolder;
  const winningTraders = props.performanceData
    ? `${props.performanceData.winningTraders}`
    : String().placeHolder;
  const aum = props.performanceData
    ? `${props.performanceData.aum.floor(2)}`
    : String().placeHolder;
  const winRate = props.performanceData
    ? `${props.performanceData.winRate.floor(2)}%`
    : String().placeHolder;
  const traderPnl = props.performanceData
    ? `${props.performanceData.traderPnl.floor(2)}`
    : String().placeHolder;

  const percent = useMemo(() => {
    if (props.performanceData) {
      const all =
        props.performanceData.winningTraders +
        props.performanceData.losingTraders;
      if (all > 0) {
        return [
          `${((props.performanceData.winningTraders / all) * 100).floor(2)}%`,
          `${((props.performanceData.losingTraders / all) * 100).floor(2)}%`,
        ];
      }
    }
    return ["0%", "100%"];
  }, [props.performanceData]);

  const performanceInfo = useCallback((title: string, info: string) => {
    return (
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text2,
          })}
        >
          {title}
        </Box>
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text0,
          })}
        >
          {info}
        </Box>
      </Stack>
    );
  }, []);
  const TokenPercent = useCallback(
    (index: number, value: string) => {
      return (
        <Stack direction={"row"} spacing={"12px"} alignItems={"center"}>
          <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
            <Box
              sx={(theme) => ({
                width: "12px",
                height: "12px",
                borderRadius: "6px",
                background: `${COLORS[index]}`,
              })}
            ></Box>
            <Box
              sx={(theme) => ({
                fontWeight: "400px",
                fontHeight: "14px",
                lineHeight: "20px",
                color: theme.normal.text2,
              })}
            >
              {props.performanceSymbolData[index].name}
            </Box>
          </Stack>
          <Box
            sx={(theme) => ({
              fontWeight: "400px",
              fontHeight: "14px",
              lineHeight: "20px",
              color: theme.normal.text0,
            })}
          >
            {`${value}%`}
          </Box>
        </Stack>
      );
    },
    [props.performanceSymbolData]
  );

  const emptySymbol = useMemo(() => {
    return props.performanceSymbolData
      .map((item) => {
        return item.value;
      })
      .every((e) => e === 0);
  }, [props.performanceSymbolData]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack
        padding={"20px"}
        spacing={"12px"}
        sx={(theme) => {
          const border = `1px solid ${theme.normal.border}`;
          return {
            borderBottom: border,
            borderTop: ["0px", "0px", "0px", "0px", border],
            borderLeft: ["0px", "0px", "0px", "0px", border],
            borderRight: ["0px", "0px", "0px", "0px", border],
            borderRadius: ["0px", "0px", "0px", "0px", "12px"],
          };
        }}
        height={"350px"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text0,
            })}
          >
            <Trans>Earnings</Trans>
          </Box>
          <SelectTime
            nowValue={props.time1}
            dataStart={1}
            dataRange={4}
            selectCallBack={props.setTime1}
          />
        </Stack>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={props.earningsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={nowTheme.normal.border}
            />
            <XAxis
              dataKey="date"
              scale="auto"
              axisLine={false}
              tickLine={false}
              tickSize={4}
              tick={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId={"left"}
              orientation={"left"}
              axisLine={false}
              tickLine={false}
              width={30}
              tick={{ fontSize: "10px", strokeWidth: 1 }}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              yAxisId={"right"}
              orientation={"right"}
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{ fontSize: "10px", strokeWidth: 1 }}
            />
            {/* <Tooltip /> */}
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="roi"
              stroke={nowTheme.normal.success}
              dot={false}
              strokeWidth={"2"}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pnl"
              stroke={nowTheme.normal.primary}
              dot={false}
              strokeWidth={"2"}
            />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
      <Stack
        direction={["column", "column", "column", "column", "row"]}
        gap={"24px"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          spacing={"12px"}
          width={"100%"}
          sx={(theme) => {
            const border = `1px solid ${theme.normal.border}`;
            return {
              padding: "20px",
              borderBottom: border,
              borderTop: ["0px", "0px", "0px", "0px", border],
              borderLeft: ["0px", "0px", "0px", "0px", border],
              borderRight: ["0px", "0px", "0px", "0px", border],
              borderRadius: ["0px", "0px", "0px", "0px", "12px"],
            };
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "20px",
                color: theme.normal.text0,
              })}
            >
              <Trans>Performance</Trans>
            </Box>
            <SelectTime
              nowValue={props.time2}
              dataStart={0}
              dataRange={4}
              selectCallBack={(num) => props.setTime2(num)}
            />
          </Stack>
          <Stack spacing={"24px"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={(theme) => ({
                padding: "40px 20px",
                borderRadius: "12px",
                background: theme.normal.bg1,
              })}
            >
              <Stack
                spacing={"4px"}
                alignItems={"center"}
                width={"100%"}
                sx={(theme) => ({
                  borderRight: `1px solid ${theme.normal.border}`,
                })}
              >
                <Box
                  sx={(theme) => ({
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: theme.normal.success,
                  })}
                >
                  {winRate}
                </Box>
                <Box
                  sx={(theme) => ({
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: theme.normal.text2,
                  })}
                >
                  <Trans>Win Rate</Trans>
                </Box>
              </Stack>
              <Stack spacing={"4px"} alignItems={"center"} width={"100%"}>
                <Box
                  sx={(theme) => ({
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: theme.normal.text0,
                  })}
                >
                  {pnlRatio}
                </Box>
                <Box
                  sx={(theme) => ({
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: theme.normal.text2,
                  })}
                >
                  <Trans>PnL Ratio</Trans>
                </Box>
              </Stack>
            </Stack>

            <Stack spacing={"12px"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={(theme) => ({
                  fontWeight: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                  color: theme.normal.text2,
                })}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
                  <Box>
                    <Trans>Winning Trades</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      color: theme.normal.success,
                    })}
                  >
                    {winningTraders}
                  </Box>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  spacing={"4px"}
                >
                  <Box>
                    <Trans>Losing Trades</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      color: theme.normal.text0,
                    })}
                  >
                    {losingTraders}
                  </Box>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                spacing={"2px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box
                  width={percent[0]}
                  sx={(theme) => ({
                    background: theme.normal.success,
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    height: "12px",
                  })}
                ></Box>
                <Box
                  width={percent[1]}
                  sx={(theme) => ({
                    background: theme.normal.bg3,
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                    height: "12px",
                  })}
                ></Box>
              </Stack>
            </Stack>

            <Stack spacing={"16px"} paddingBottom={"12px"}>
              {performanceInfo(t`Number of Orders`, ordersNumber)}
              {performanceInfo(t`Cumulative Copy Traders`, cumulativeTraders)}
              {performanceInfo(t`Copy Traders’ PnL (NEST)`, traderPnl)}
              {performanceInfo(t`AUM (NEST)`, aum)}
            </Stack>
          </Stack>
        </Stack>
        <Stack
          spacing={"12px"}
          width={"100%"}
          height={"460px"}
          sx={(theme) => ({
            borderRadius: "12px",
            border: [
              "0px",
              "0px",
              "0px",
              "0px",
              `1px solid ${theme.normal.border}`,
            ],
            padding: "20px",
          })}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "20px",
                color: theme.normal.text0,
              })}
            >
              <Trans>Symbol Preference</Trans>
            </Box>
            <SelectTime
              nowValue={props.time3}
              dataStart={0}
              dataRange={4}
              selectCallBack={(num) => props.setTime3(num)}
            />
          </Stack>
          {emptySymbol ? (
            <Stack justifyContent={"center"}
            alignItems={"center"}
            sx={(theme) => ({
              width:"100%",
              height:"100%",
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text2
            })}>
              <Trans>No Records Found</Trans>
            </Stack>
          ) : (
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              paddingTop={"10px"}
              spacing={"20px"}
            >
              <PieChart width={180} height={180}>
                <Pie
                  data={props.performanceSymbolData}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  stroke="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={(e) => {
                    const props = {
                      ...e,
                      titleColor: nowTheme.normal.text2,
                      valueColor: nowTheme.normal.text0,
                    };
                    return renderActiveShape(props);
                  }}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {props.performanceSymbolData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>

              <Stack
                direction={"row"}
                justifyContent={"space-around"}
                width={"100%"}
              >
                {props.performanceSymbolData.length > 0 ? (
                  <>
                    <Stack spacing={"16px"}>
                      {TokenPercent(
                        0,
                        props.performanceSymbolData[0].value.floor(2)
                      )}
                      {TokenPercent(
                        1,
                        props.performanceSymbolData[1].value.floor(2)
                      )}
                      {TokenPercent(
                        2,
                        props.performanceSymbolData[2].value.floor(2)
                      )}
                      {TokenPercent(
                        3,
                        props.performanceSymbolData[3].value.floor(2)
                      )}
                    </Stack>
                    <Stack spacing={"16px"}>
                      {TokenPercent(
                        4,
                        props.performanceSymbolData[4].value.floor(2)
                      )}
                      {TokenPercent(
                        5,
                        props.performanceSymbolData[5].value.floor(2)
                      )}
                      {TokenPercent(
                        6,
                        props.performanceSymbolData[6].value.floor(2)
                      )}
                    </Stack>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

const renderActiveShape = ({ ...props }) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    titleColor,
    valueColor,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-2}
        textAnchor="middle"
        fontSize={"12px"}
        fill={titleColor}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={18}
        textAnchor="middle"
        fontSize={"16px"}
        fill={valueColor}
      >
        {(percent * 100).floor(2) + "%"}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius}
        outerRadius={outerRadius + 6}
        fill={fill}
        stroke={fill}
      />
    </g>
  );
};

export default TraderChartView;
