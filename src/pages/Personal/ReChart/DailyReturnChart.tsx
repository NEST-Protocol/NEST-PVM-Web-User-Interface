import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {FC} from "react";
import useSWR from "swr";
import useTheme from "../../../hooks/useTheme";
import {CustomTooltip} from "./CustomTooltip";

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

  const {data} = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/return?address=${props.address}&chainId=56&from=${from}&to=${to}`,
    (url: string) => fetch(url)
      .then((res) => res.json())
      .then((res: any) => res.value.map((item: any) => ({
        date: item.date,
        get: item.daily >= 0 ? item.daily : 0,
        loss: item.daily < 0 ? item.daily : 0,
      }))))

  return (
    <>
      <div></div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          syncId={'personal'}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={nowTheme.normal.border} />
          <XAxis dataKey="date" scale="auto" axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: '10px'}}/>
          {
            !props.simple && (
              <Tooltip content={<CustomTooltip />} />
            )
          }
          <Bar dataKey="get" barSize={20} fill={nowTheme.normal.success} unit={' NEST'} minPointSize={1} stackId={'a'}/>
          <Bar dataKey="loss" barSize={20} fill={nowTheme.normal.danger} unit={' NEST'} stackId={'a'}/>
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export default ReCharts