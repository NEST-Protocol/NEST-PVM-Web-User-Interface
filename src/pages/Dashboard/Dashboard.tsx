import {FC, useState} from "react";
import {Stack, Grid} from "@mui/material";
import VolumeChart from "./ReChart/VolumeChart";
import BurnedChart from "./ReChart/BurnedChart";
import OpenInterestChart from "./ReChart/OpenInterestChart";
import UserChart from "./ReChart/UserChart";
import useSWR from "swr";
import {DateRange, Range} from "react-date-range";
import Box from "@mui/material/Box";
import useTheme from "../../hooks/useTheme";
import {Trans, t} from "@lingui/macro";

export type Order = {
  owner: string;
  leverage: string;
  orientation: string;
  actualRate: number;
  index: number;
  openPrice: number;
  tokenPair: string;
  actualMargin: number;
  initialMargin: number;
  appendMargin?: number;
  lastPrice: number;
  sp: number;
  sl: number;
};
const Dashboard: FC = () => {
  const {data: infoData} = useSWR(`https://api.nestfi.net/api/dashboard/v2/entirety/info?chainId=56`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));
  const [range, setRange] = useState<Range>({
    startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    key: 'selection'
  });
  const [showrdr, setShowrdr] = useState(false);
  const {nowTheme} = useTheme()

  return (
    <Stack alignItems={"center"}>
      <Stack maxWidth={'1600px'} width={'100%'} mt={['20px', '20px', '20px', '40px']}>
        <Stack px={'20px'}>
          <Grid container spacing={'16px'}>
            {
              [
                {
                  title: t`Total Volume`,
                  value: Number(infoData?.totalVolume ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }) ?? '-',
                  unit: 'NEST'
                },
                {
                  title: t`Total Burned`,
                  value: Number(infoData?.totalBurned ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }) ?? '-',
                  unit: 'NEST'
                },
                {
                  title: t`Total User`,
                  value: Number(infoData?.totalUser ?? 0).toLocaleString('en-US') ?? '-',
                  unit: ''
                },
                {
                  title: t`Open Interest`,
                  value: Number(infoData?.openInterest ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }) ?? '-',
                  unit: 'NEST'
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                  <Stack sx={(theme) => ({
                    [theme.breakpoints.down('md')]: {
                      padding: '20px 12px',
                    },
                    [theme.breakpoints.up('md')]: {
                      padding: '40px',
                    },
                    borderRadius: '12px',
                    backgroundColor: theme.normal.bg1,
                  })} spacing={'4px'} height={'100%'}>
                    <Stack sx={(theme) => ({
                      color: theme.normal.text2,
                      fontSize: '14px',
                      fontWeight: 'bold',
                      lineHeight: '20px',
                    })}>{item.title}</Stack>
                    <Stack direction={'row'} gap={['4px', '4px', '4px', '12px']} alignItems={'end'}>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text0,
                        fontSize: ['24px', '28px'],
                        fontWeight: 'bold',
                        lineHeight: ['32px', '40px'],
                      })}>
                        {item.value} {item.unit}
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              ))
            }
          </Grid>
        </Stack>
        <Stack mt={['16px', '16px', '16px', '40px']} mb={['20px', '20px', '20px', '24px']} px={'20px'}
               width={['100%', '280px']}
               position={'relative'}>
          <button style={{
            cursor: 'pointer',
            width: '100%',
          }}
                  onClick={() => {
                    setShowrdr(!showrdr);
                  }}
          >
            <Stack direction={'row'} padding={'8px 12px'} width={'100%'} sx={(theme) => ({
              borderRadius: '8px',
              backgroundColor: theme.normal.bg1,
              border: `1px solid ${theme.normal.border}`,
              color: theme.normal.text0,
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '20px',
              height: '40px',
            })} spacing={'4px'} alignItems={"center"}>
              <Stack>{range?.startDate?.toLocaleDateString()}</Stack>
              <Box>~</Box>
              <Stack>{range?.endDate?.toLocaleDateString()}</Stack>
              <Stack flexGrow={1}></Stack>
              <Stack sx={(theme) => ({
                '& svg': {
                  path: {
                    fill: theme.normal.text2,
                  }
                }
              })}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M4.66667 0.583008C4.98883 0.583008 5.25 0.844175 5.25 1.16634V1.45801H8.75V1.16634C8.75 0.844175 9.01117 0.583008 9.33333 0.583008C9.6555 0.583008 9.91667 0.844175 9.91667 1.16634V1.45801H11.9583C12.6027 1.45801 13.125 1.98035 13.125 2.62467V5.54134V11.6663C13.125 12.3107 12.6027 12.833 11.9583 12.833H2.04167C1.39734 12.833 0.875 12.3107 0.875 11.6663V5.54134V2.62467C0.875 1.98034 1.39733 1.45801 2.04167 1.45801H4.08333V1.16634C4.08333 0.844175 4.3445 0.583008 4.66667 0.583008ZM8.75 2.62467V3.49967C8.75 3.82184 9.01117 4.08301 9.33333 4.08301C9.6555 4.08301 9.91667 3.82184 9.91667 3.49967V2.62467H11.9583V4.95801H2.04167V2.62467H4.08333V3.49967C4.08333 3.82184 4.3445 4.08301 4.66667 4.08301C4.98883 4.08301 5.25 3.82184 5.25 3.49967V2.62467H8.75ZM11.9583 6.12467H2.04167V11.6663H11.9583V6.12467ZM7.58333 9.91634C7.58333 9.59417 7.8445 9.33301 8.16667 9.33301H9.91667C10.2388 9.33301 10.5 9.59417 10.5 9.91634C10.5 10.2385 10.2388 10.4997 9.91667 10.4997H8.16667C7.8445 10.4997 7.58333 10.2385 7.58333 9.91634ZM4.08333 9.33301C3.76117 9.33301 3.5 9.59417 3.5 9.91634C3.5 10.2385 3.76117 10.4997 4.08333 10.4997H5.83333C6.1555 10.4997 6.41667 10.2385 6.41667 9.91634C6.41667 9.59417 6.1555 9.33301 5.83333 9.33301H4.08333ZM7.58333 7.58301C7.58333 7.26084 7.8445 6.99967 8.16667 6.99967H9.91667C10.2388 6.99967 10.5 7.26084 10.5 7.58301C10.5 7.90517 10.2388 8.16634 9.91667 8.16634H8.16667C7.8445 8.16634 7.58333 7.90517 7.58333 7.58301ZM4.08333 6.99967C3.76117 6.99967 3.5 7.26084 3.5 7.58301C3.5 7.90517 3.76117 8.16634 4.08333 8.16634H5.83333C6.1555 8.16634 6.41667 7.90517 6.41667 7.58301C6.41667 7.26084 6.1555 6.99967 5.83333 6.99967H4.08333Z"
                        fill="#F9F9F9" fillOpacity="0.6"/>
                </svg>
              </Stack>
            </Stack>
          </button>
          {
            showrdr && (
              <>
                <Stack width={'fit-content'} position={'absolute'} top={'44px'} zIndex={50}>
                  <DateRange
                    months={1}
                    onChange={item => setRange(item.selection)}
                    moveRangeOnFirstSelection={false}
                    ranges={[range]}
                    showMonthArrow={true}
                    showPreview={false}
                    showDateDisplay={false}
                    showMonthAndYearPickers={false}
                    className={nowTheme.isLight ? '' : 'dark'}
                  />
                </Stack>
                <button style={{
                  width: '100vw',
                  height: '100vh',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  zIndex: 49,
                }} onClick={() => {
                  if (showrdr) {
                    setShowrdr(false);
                  }
                }}></button>
              </>
            )
          }
        </Stack>
        <Grid container spacing={'24px'} px={['0', '0', '0', '20px']}>
          {
            [
              {
                title: t`Volume`,
                chart: <VolumeChart from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                    to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>,
              },
              {
                title: t`Burned`,
                chart: <BurnedChart from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                    to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
              {
                title: t`User`,
                chart: <UserChart from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                  to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
              {
                title: t`Open Interest`,
                chart: <OpenInterestChart from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                          to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Stack sx={(theme) => ({
                  [theme.breakpoints.down('md')]: {
                    height: '340px',
                    width: '100%',
                    borderBottom: `1px solid ${theme.normal.border}`,
                    paddingBottom: '24px',
                  },
                  [theme.breakpoints.up('md')]: {
                    height: '306px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.normal.border}`,
                    padding: '20px',
                  },
                })} spacing={'12px'} px={'20px'}>
                  <Stack sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: '20px',
                  })}>
                    {item.title}
                  </Stack>
                  {item.chart}
                </Stack>
              </Grid>
            ))
          }
        </Grid>
      </Stack>
      <Stack height={'80px'}></Stack>
    </Stack>
  );
};

export default Dashboard;
