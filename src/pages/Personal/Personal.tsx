import {useParams} from "react-router-dom";
import {useMemo, useState} from "react";
import ShareMyDealModal from "../Dashboard/Modal/ShareMyDealModal";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import {Grid} from "@mui/material";
import Divider from "@mui/material/Divider";
import VolumeChart from "./ReChart/VolumeChart";
import TotalAssetValue from "./ReChart/TotalAssetValueChart";
import DailyReturnChart from "./ReChart/DailyReturnChart";
import CumulativeReturnChart from "./ReChart/CumulativeReturnChart";
import {Share} from "../../components/icons";
import Box from "@mui/material/Box";
import {DateRange, Range} from "react-date-range";
import useTheme from "../../hooks/useTheme";
import {Trans} from "@lingui/macro";
import useWindowWidth from "../../hooks/useWindowWidth";
import {useAccount} from "wagmi";

const Personal = () => {
  const {address} = useParams()
  const {address: user} = useAccount()
  const {isBigMobile} = useWindowWidth()
  const [showShareMyDealModal, setShareMyDealModal] = useState(false);
  const [range, setRange] = useState<Range>({
    startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    key: 'selection'
  });
  const [showrdr, setShowrdr] = useState(false);
  const {nowTheme} = useTheme()

  const {
    data: positons,
  } = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/positons?address=${address ?? user}&chainId=56`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {
    data: trading,
  } = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/trading?address=${address ?? user}&chainId=56`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {data: isKol} = useSWR(address ? `https://api.nestfi.net/api/invite/is-kol-whitelist/${address ?? user}` : undefined, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value))

  const shareMyDealModal = useMemo(() => {
    return (
      <ShareMyDealModal
        value={{
          address: address ?? user,
          totalProfitLoss: positons?.totalProfitAndLoss ?? 0,
          totalRate: positons?.totalRate ?? 0,
          todayPNL: positons?.todayPnl ?? 0,
          todayRate: positons?.todayRate ?? 0,
          _7daysPNL: positons?.days7Pnl ?? 0,
          _7daysRate: positons?.days7Rate ?? 0,
          _30daysPNL: positons?.days30Pnl ?? 0,
          _30daysRate: positons?.days30Rate ?? 0,
          from: range.startDate?.toLocaleDateString().replaceAll('/', '-'),
          to: range.endDate?.toLocaleDateString().replaceAll('/', '-'),
        }}
        open={showShareMyDealModal}
        onClose={() => {
          setShareMyDealModal(false);
        }}
      />
    );
  }, [showShareMyDealModal]);

  return (
    <Stack alignItems={"center"}>
      {shareMyDealModal}
      {
        isKol && (
          <Stack direction={'row'} width={'100%'} justifyContent={"center"} spacing={'32px'} sx={(theme) => ({
            color: theme.normal.text0,
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '22px',
            background: theme.normal.bg1,
            borderBottom: `1px solid ${theme.normal.border}`,
            borderTop: `1px solid ${theme.normal.border}`,
            padding: '0 20px',
          })}>
            <Stack sx={(theme) => ({
              paddingY: '11px',
              alignItems: 'center',
              width: isBigMobile ? '100%' : 'auto',
              borderBottom: `2px solid ${theme.normal.primary}`,
              a: {
                color: theme.normal.primary,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })}>
              <a href={`/#/user`}>
                <Trans>Personal</Trans>
              </a>
            </Stack>
            <Stack sx={(theme) => ({
              paddingY: '11px',
              alignItems: 'center',
              width: isBigMobile ? '100%' : 'auto',
              a: {
                color: theme.normal.text0,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })}>
              <a href={`/#/referral`}>
                <Trans>Referral</Trans>
              </a>
            </Stack>
          </Stack>
        )
      }
      <Stack maxWidth={'1600px'} width={'100%'} mt={['20px', '40px']}>
        <Stack px={'20px'} direction={'row'} justifyContent={'space-between'} alignItems={"center"}>
          <Stack sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
              color: theme.normal.text2,
              fontSize: '14px',
              lineHeight: '20px',
            },
            [theme.breakpoints.up('md')]: {
              color: theme.normal.text0,
              fontSize: '20px',
              lineHeight: '28px',
            },
            fontWeight: 'bold',
          })}>
            Dashboard / Personal
          </Stack>
          <Stack sx={(theme) => ({
            border: `1px solid ${theme.normal.border}`,
            padding: '8px',
            borderRadius: '8px',
            [theme.breakpoints.down('md')]: {
              'svg': {
                "path": {
                  fill: theme.normal.text2,
                },
                width: '16px',
                height: '16px',
              }
            },
            [theme.breakpoints.up('md')]: {
              'svg': {
                "path": {
                  fill: theme.normal.text2,
                },
                width: '24px',
                height: '24px',
              }
            },
            "&:hover": {
              cursor: "pointer",
              backgroundColor: theme.normal.grey_hover,
              color: theme.normal.text0,
              "& a": {
                color: theme.normal.text0,
              },
              "& svg path": {
                fill: theme.normal.text0,
              },
            },
            "&:active": {
              color: theme.normal.text0,
              backgroundColor: theme.normal.grey_hover,
              "& a": {
                color: theme.normal.text0,
              },
              "& svg path": {
                fill: theme.normal.text0,
              },
            },
          })} onClick={() => setShareMyDealModal(true)}>
            <Share/>
          </Stack>
        </Stack>
        {/*PC My Trading*/}
        <Stack px={'20px'}>
          <Stack mt={'24px'} sx={(theme) => ({
            border: `1px solid ${theme.normal.border}`,
            padding: '20px',
            borderRadius: '12px',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            }
          })}>
            <Stack sx={(theme) => ({
              color: theme.normal.text2,
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '20px',
            })}>
              My Trading
            </Stack>
            <Stack alignItems={"center"} spacing={'12px'} my={'40px'}>
              <Stack sx={(theme) => ({
                color: theme.normal.text2,
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '22px',
              })}>balance</Stack>
              <Stack direction={'row'} alignItems={'end'} sx={(theme) => ({
                color: theme.normal.text0,
                '& span:first-of-type': {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  lineHeight: '44px',
                },
                '& span:last-of-type': {
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: '40px',
                  marginLeft: '8px',
                },
              })}>
              <span>{Number(trading?.balance ?? 0).toLocaleString('en-US', {
                maximumFractionDigits: 2
              })}</span>
                <span>NEST</span>
              </Stack>
            </Stack>
            <Grid container spacing={'16px'}>
              {
                [
                  {
                    title: 'Total trading volume',
                    value: trading?.volume,
                    unit: ' NEST',
                  },
                  {
                    title: 'Total asset value',
                    value: trading?.assetValue,
                    unit: ' NEST',
                  },
                  {
                    title: 'Total number of trades',
                    value: trading?.trades,
                    unit: '',
                  },
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Stack spacing={'12px'} sx={(theme) => ({
                      backgroundColor: theme.normal.bg1,
                      padding: '40px',
                      borderRadius: '12px',
                    })}>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text2,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        lineHeight: '20px',
                      })}>{item.title}</Stack>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text0,
                        fontSize: '28px',
                        fontWeight: 'bold',
                        lineHeight: '40px',
                      })}>{Number(item?.value ?? 0).toLocaleString('en-US', {
                        maximumFractionDigits: 2
                      })}{item.unit}</Stack>
                    </Stack>
                  </Grid>
                ))
              }
            </Grid>
          </Stack>
        </Stack>

        {/*Mobile My Trading*/}
        <Stack px={'20px'}>
          <Stack mt={'16px'} sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
            padding: '20px 12px',
            backgroundColor: theme.normal.bg1,
            borderRadius: '12px',
          })}>
            <Stack spacing={'4px'}>
              <Stack sx={(theme) => ({
                color: theme.normal.text1,
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: '20px',
              })}>balance</Stack>
              <Stack sx={(theme) => ({
                color: theme.normal.text0,
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '32px',
              })}>{Number(trading?.balance ?? 0).toLocaleString('en-US', {
                maximumFractionDigits: 2
              }) ?? 0} NEST</Stack>
            </Stack>
            <Divider sx={(theme) => ({
              backgroundColor: theme.normal.border,
              margin: '20px 0',
            })}/>
            {
              [
                {
                  title: 'Total trading volume',
                  value: trading?.volume,
                  unit: ' NEST',
                },
                {
                  title: 'Total asset value',
                  value: trading?.assetValue,
                  unit: ' NEST',
                },
                {
                  title: 'Total number of trades',
                  value: trading?.trades,
                  unit: '',
                },
              ].map((item, index) => (
                <Stack direction={'row'} justifyContent={'space-between'} mb={'20px'} key={index}>
                  <Stack sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '20px',
                  })}>{item.title}</Stack>
                  <Stack sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '22px',
                  })}>{Number(item?.value ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2
                  })}{item.unit}</Stack>
                </Stack>
              ))
            }
          </Stack>
        </Stack>

        {/*PC My Positions*/}
        <Stack px={'20px'}>
          <Stack px={'20px'} mt={'24px'} sx={(theme) => ({
            border: `1px solid ${theme.normal.border}`,
            padding: '20px',
            borderRadius: '12px',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            }
          })}>
            <Stack sx={(theme) => ({
              color: theme.normal.text2,
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '20px',
            })}>
              My Positions
            </Stack>
            <Stack alignItems={"center"} spacing={'12px'} my={'40px'}>
              <Stack sx={(theme) => ({
                color: theme.normal.text2,
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '22px',
              })}>Total Profit & Loss</Stack>
              <Stack direction={'row'} alignItems={'end'} sx={(theme) => ({
                '& span:first-of-type': {
                  color: theme.normal.text0,
                  fontSize: '32px',
                  fontWeight: 'bold',
                  lineHeight: '44px',
                },
                '& span:nth-of-type(2)': {
                  color: theme.normal.text0,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: '40px',
                  marginLeft: '8px',
                },
                '& span:last-of-type': {
                  color: positons?.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: '40px',
                  marginLeft: '8px',
                }
              })}>
              <span>{Number(positons?.totalProfitAndLoss ?? 0).toLocaleString('en-US', {
                maximumFractionDigits: 2
              })}</span>
                <span>NEST</span>
                <span>{positons?.totalRate >= 0 ? '+' : ''}{Number(positons?.totalRate ?? 0).toLocaleString('en-US', {
                  maximumFractionDigits: 2
                })} %</span>
              </Stack>
            </Stack>
            <Grid container spacing={'16px'}>
              {
                [
                  {
                    title: 'Today\'s PNL',
                    value: positons?.todayPnl,
                    rate: positons?.todayRate,
                  },
                  {
                    title: '7 Days\' PNL',
                    value: positons?.days7Pnl,
                    rate: positons?.days7Rate,
                  },
                  {
                    title: '30 Days\' PNL',
                    value: positons?.days30Pnl,
                    rate: positons?.days30Rate,
                  },
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Stack spacing={'12px'} sx={(theme) => ({
                      backgroundColor: theme.normal.bg1,
                      padding: '40px',
                      borderRadius: '12px',
                    })}>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text2,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        lineHeight: '20px',
                      })}>{item.title}</Stack>
                      <Stack sx={(theme) => ({
                        '& span:first-of-type': {
                          color: theme.normal.text0,
                          fontSize: '28px',
                          fontWeight: 'bold',
                          lineHeight: '40px',
                          whiteSpace: 'nowrap',
                        },
                        '& span:last-of-type': {
                          color: item?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                          fontSize: '24px',
                          fontWeight: 'bold',
                          lineHeight: '32px',
                          whiteSpace: 'nowrap',
                        }
                      })} direction={'row'} spacing={'4px'} alignItems={'end'}>
                      <span>{Number(item?.value ?? 0).toLocaleString('en-US', {
                        maximumFractionDigits: 2
                      })} NEST</span>
                        <span>{item?.rate > 0 ? '+' : ''}{Number(item?.rate ?? 0).toLocaleString('en-US', {
                          maximumFractionDigits: 2
                        })}%</span>
                      </Stack>
                    </Stack>
                  </Grid>
                ))
              }
            </Grid>
          </Stack>
        </Stack>
        {/*Mobile My Positions*/}
        <Stack px={'20px'}>
          <Stack mt={'16px'} sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
            padding: '20px 12px',
            backgroundColor: theme.normal.bg1,
            borderRadius: '12px',
          })}>
            <Stack spacing={'4px'}>
              <Stack sx={(theme) => ({
                color: theme.normal.text1,
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: '20px',
              })}>Total Profit & Loss</Stack>
              <Stack sx={(theme) => ({
                '& span:first-of-type': {
                  color: theme.normal.text0,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  lineHeight: '32px',
                },
                '& span:last-of-type': {
                  color: positons?.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '28px',
                },
              })} spacing={'4px'} alignItems={'end'} direction={'row'}>
              <span>{Number(positons?.totalProfitAndLoss ?? 0).toLocaleString('en-US', {
                maximumFractionDigits: 2
              }) ?? 0} NEST</span>
                <span>{positons?.totalRate > 0 ? '+' : ''}{Number(positons?.totalRate ?? 0).toLocaleString('en-US', {
                  maximumFractionDigits: 2
                })}%</span>
              </Stack>
            </Stack>
            <Divider sx={(theme) => ({
              backgroundColor: theme.normal.border,
              margin: '20px 0',
            })}/>
            {
              [
                {
                  title: 'Today\'s PNL',
                  value: positons?.todayPnl,
                  rate: positons?.todayRate,
                },
                {
                  title: '7 Days\' PNL',
                  value: positons?.days7Pnl,
                  rate: positons?.days7Rate,
                },
                {
                  title: '30 Days\' PNL',
                  value: positons?.days30Pnl,
                  rate: positons?.days30Rate,
                },
              ].map((item, index) => (
                <Stack key={index} direction={'row'} justifyContent={'space-between'} mb={'20px'}>
                  <Stack sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '20px',
                  })}>{item.title}</Stack>
                  <Stack direction={'row'} alignItems={"end"} sx={(theme) => ({
                    '& span:first-of-type': {
                      color: theme.normal.text0,
                      fontSize: '16px',
                      fontWeight: '700',
                      lineHeight: '22px',
                    },
                    '& span:last-of-type': {
                      color: item?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                      fontSize: '12px',
                      fontWeight: '400',
                      lineHeight: '16px',
                    },
                  })} spacing={'4px'}>
                  <span>{Number(item?.value ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2
                  })} NEST</span>
                    <span>{item.rate > 0 ? `+${item?.rate}` : item?.rate}%</span>
                  </Stack>
                </Stack>
              ))
            }
          </Stack>
        </Stack>

        <Stack
          mt={['16px', '40px']} mb={['20px', '24px']} px={'20px'}
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
        <Grid container spacing={'24px'}>
          {
            [
              {
                title: 'Volume',
                chart: <VolumeChart address={address} from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                    to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>,
              },
              {
                title: 'Total asset value',
                chart: <TotalAssetValue address={address}
                                        from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                        to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
              {
                title: 'Daily return',
                chart: <DailyReturnChart address={address}
                                         from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                         to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
              {
                title: 'Cumulative return',
                chart: <CumulativeReturnChart address={address}
                                              from={range.startDate?.toLocaleDateString().replaceAll('/', '-')}
                                              to={range.endDate?.toLocaleDateString().replaceAll('/', '-')}/>
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Stack sx={(theme) => ({
                  [theme.breakpoints.down('md')]: {
                    height: '340px',
                    width: '100%',
                    paddingBottom: '20px',
                    borderBottom: `1px solid ${theme.normal.border}`,
                  },
                  [theme.breakpoints.up('md')]: {
                    height: '306px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.normal.border}`,
                    padding: '20px',
                  },
                })} spacing={'12px'}>
                  <Stack px={'20px'} sx={(theme) => ({
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
  )
}

export default Personal