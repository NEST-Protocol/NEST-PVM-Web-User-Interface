import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {FC} from "react";
import useSWR from "swr";
import useTheme from "../../../hooks/useTheme";

type ReChartsProps = {
  from?: string
  to?: string
}

const ReCharts: FC<ReChartsProps> = ({...props}) => {
  const {nowTheme} = useTheme()
  const to = props.to ?? new Date().toLocaleDateString().replaceAll('/', '-')
  // from 为30天之前的日期
  const from = props.from ?? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString().replaceAll('/', '-')

  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/entirety/openInterest?chainId=56&from=${from}&to=${to}`,
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
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
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
          formatter={(value: any) => value.toLocaleString('en-US', {
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
        <Bar dataKey="long" barSize={20} fill={nowTheme.normal.success} stackId={'a'} unit={' NEST'}
             minPointSize={1}/>
        <Bar dataKey="short" barSize={20} fill={nowTheme.normal.danger} stackId={'a'} unit={' NEST'}/>
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ReCharts