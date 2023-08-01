import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';
import {FC} from "react";
import useSWR from "swr";
import useTheme from "../../../hooks/useTheme";
import {Stack} from "@mui/material";

type ChartsProps = {
  address: string | undefined
  from?: string
  to?: string
  simple?: boolean
}
const ReCharts: FC<ChartsProps> = ({...props}) => {
  const {nowTheme} = useTheme()
  const to = props.to ?? new Date().toLocaleDateString().replaceAll('/', '-')
  // from 为30天之前的日期
  const from = props.from ?? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString().replaceAll('/', '-')

  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/volume?address=${props.address}&chainId=56&from=${from}&to=${to}`,
    (url: string) => fetch(url)
      .then((res) => res.json())
      .then((res: any) => res.value))

  return (
    <>
      {
        props.simple && data?.length > 0 && (
          <Stack position={'absolute'} sx={() => ({
            fontSize: '18px',
            lineHeight: '24px',
            fontWeight: '700',
            color: "#F9F9F9",
          })}>{Number(data[data.length - 1]?.cumulative ?? 0).toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })
          } NEST</Stack>
        )
      }
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          syncId={'personal'}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={nowTheme.normal.border} />
          <XAxis dataKey="date" scale="auto" axisLine={false} hide={props.simple} tickLine={false} tick={{fontSize: '10px'}}/>
          <YAxis yAxisId={'left'} orientation={'left'} hide={props.simple} axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
          <YAxis domain={['dataMin', 'dataMax']} hide={props.simple} yAxisId={'right'} orientation={'right'} axisLine={false}
                 tickLine={false} tick={{fontSize: '10px'}}/>
          {
            !props.simple && (
              <Tooltip
                itemStyle={{
                  fontSize: '12px',
                  color: '#000',
                }}
                contentStyle={{
                  backgroundColor: '#fff',
                  color: '#000',
                  fontWeight: 700,
                  borderRadius: '12px',
                }}
                labelStyle={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#000',
                }}
                formatter={(value: any) => Number(value).toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              />
            )
          }
          {
            !props.simple && (
              <Legend
                wrapperStyle={{
                  fontSize: '14px',
                }}
                formatter={(value: any) => {
                  return value.replace(/[A-Z]/g, ' $&').toLowerCase()
                }}
              />
            )
          }
          <Bar dataKey="longOpen" yAxisId={'left'} barSize={20} fill={nowTheme.normal.success} stackId="a"
               unit={' NEST'} minPointSize={1}
          />
          <Bar dataKey="longClose" yAxisId={'left'} barSize={20} fill={nowTheme.normal.success_light_active}
               stackId="a" unit={' NEST'}/>
          <Bar dataKey="shortOpen" yAxisId={'left'} barSize={20} fill={nowTheme.normal.danger}
               stackId="a" unit={' NEST'}/>
          <Bar dataKey="shortClose" yAxisId={'left'} barSize={20} fill={nowTheme.normal.danger_light_active}
               stackId="a" unit={' NEST'}/>
          <Line type="monotone" yAxisId={'right'} dataKey="cumulative" stroke="#EAAA00" dot={false}
                strokeWidth={2} unit={' NEST'}/>
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export default ReCharts