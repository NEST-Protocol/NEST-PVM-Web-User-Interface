import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/asset?address=${props.address}&chainId=56&from=${from}&to=${to}`,
    (url: string) => fetch(url)
      .then((res) => res.json())
      .then((res: any) => res.value))

  return (
    <>
      {
        props.simple && data?.length > 0 && (
          <Stack sx={() => ({
            fontSize: '18px',
            lineHeight: '24px',
            fontWeight: '700',
            color: "#F9F9F9",
          })}>{Number(data[data.length - 1]?.daily ?? 0).toLocaleString('en-US', {
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" scale="auto" axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
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
                  fontSize: '14px',
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
          <Line type="monotone" dataKey="daily" stroke={nowTheme.normal.primary} dot={false} strokeWidth={2} unit={' NEST'}/>
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export default ReCharts