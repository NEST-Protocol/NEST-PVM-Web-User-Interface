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
import numeral from "numeral";

type ReChartsProps = {
  from?: string
  to?: string
}

const ReCharts: FC<ReChartsProps> = ({...props}) => {
  const {nowTheme} = useTheme()
  const to = props.to ?? new Date().toLocaleDateString().replaceAll('/', '-')
  const from = props.from ?? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString().replaceAll('/', '-')

  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/entirety/user?chainId=56&from=${from}&to=${to}`,
    (url) => fetch(url)
      .then((res) => res.json())
      .then((res: any) => res.value))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        syncId={'dashboard'}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={nowTheme.normal.border} />
        <XAxis dataKey="date" scale="auto" axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
        <YAxis yAxisId={'left'} orientation={'left'} axisLine={false} tickLine={false}
               tickFormatter={(value, index) => {
                 return numeral(value).format('0a').toUpperCase()
               }} width={30}
               tick={{fontSize: '10px'}}/>
        <YAxis domain={['dataMin', 'dataMax']} yAxisId={'right'} orientation={'right'}
               tickFormatter={(value, index) => {
                 return numeral(value).format('0a').toUpperCase()
               }} width={30}
               axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
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
        <Legend
          wrapperStyle={{
            fontSize: '14px',
          }}
          formatter={(value: any) => {
            return value.replace(/[A-Z]/g, ' $&').toLowerCase()
          }}
        />
        <Bar yAxisId={'left'} dataKey="daily" barSize={20} fill={nowTheme.normal.success} stackId="a"
             minPointSize={1}/>
        <Line yAxisId={'right'} type="monotone" dataKey="cumulative" dot={false} stroke={nowTheme.normal.primary} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ReCharts