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
import {Stack} from "@mui/system";
import numeral from "numeral";

type ChartsProps = {
  address: string | undefined
  from?: string
  to?: string
  simple?: boolean
}
const ReCharts: FC<ChartsProps> = ({...props}) => {
  const {nowTheme} = useTheme()
  const to = props.to ?? new Date().toLocaleDateString().replaceAll('/', '-')
  const from = props.from ?? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString().replaceAll('/', '-')
  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/yield?address=${props.address}&chainId=56&from=${from}&to=${to}`,
    (url: string) => fetch(url)
      .then((res) => res.json())
      .then((res: any) => res.value))

  return (
    <Stack width={'100%'} height={'100%'}>
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
          } %</Stack>
        )
      }
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          syncId={'personal'}
        >
          {
            !props.simple && (
              <CartesianGrid strokeDasharray="3 3" stroke={nowTheme.normal.border}/>
            )
          }
          <XAxis dataKey="date" scale="auto" axisLine={false} hide={props.simple} tickLine={false}
                 tick={{fontSize: '10px'}}/>
          <YAxis axisLine={false} tickLine={false} hide={props.simple} tick={{fontSize: '10px'}} width={30}
                 tickFormatter={(value, index) => {
                   return numeral(value / 100).format('0%').toUpperCase()
                 }}
          />
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
                  border: `1px solid ${nowTheme.normal.border}`,
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
          <Line type="monotone" dataKey="daily" stroke={nowTheme.normal.primary} dot={false} strokeWidth={2}
                unit={'%'}/>
        </ComposedChart>
      </ResponsiveContainer>
    </Stack>
  )
}

export default ReCharts