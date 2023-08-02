import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import ShareMyDealModal from "../Dashboard/Modal/ShareMyDealModal";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import {Grid} from "@mui/material";
import VolumeChart from "./ReChart/VolumeChart";
import TotalAssetValue from "./ReChart/TotalAssetValueChart";
import DailyReturnChart from "./ReChart/DailyReturnChart";
import CumulativeReturnChart from "./ReChart/CumulativeReturnChart";
import {Copy, Share} from "../../components/icons";
import Box from "@mui/material/Box";
import {DateRange, Range} from "react-date-range";
import useTheme from "../../hooks/useTheme";
import {t, Trans} from "@lingui/macro";
import useWindowWidth from "../../hooks/useWindowWidth";
import useAccount from "../../hooks/useAccount";
import DepositModal from "../Share/Modal/DepositModal";
import WithDrawModal from "../Share/Modal/WithdrawModal";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "../../hooks/useTransactionReceipt";
import {SnackBarType} from "../../components/SnackBar/NormalSnackBar";
import useNEST from "../../hooks/useNEST";
import useWalletIcon from "../../hooks/uswWalletIcon";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../hooks/useNESTSnackBar";
import {useLocalStorage} from "react-use";

const Personal = () => {
  const {address} = useParams()
  const {account, checkSigned} = useNEST();
  const {isBigMobile} = useWindowWidth()
  const [showShareMyDealModal, setShareMyDealModal] = useState(false);
  const [range, setRange] = useState<Range[]>([{
    startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [showrdr, setShowrdr] = useState(false);
  const {nowTheme} = useTheme()
  const {addTransactionNotice} = usePendingTransactionsBase();
  const {
    showDeposit,
    setShowDeposit,
    showWithdraw,
    setShowWithdraw,
    showBalance,
    getAssetsList,
    moneyList,
  } = useAccount();
  const walletIcon = useWalletIcon();
  const {messageSnackBar} = useNESTSnackBar();
  const [messagesStr,] = useLocalStorage(`nest.messages`, '{}');

  const {
    data: positions,
  } = useSWR(`https://api.nestfi.net/api/dashboard/v2/personal/positons?address=${address ?? account.address}&chainId=56`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value), {
    refreshInterval: 3_000,
  });

  const {data: isKol} = useSWR((address || account.address) ? `https://api.nestfi.net/api/invite/is-kol-whitelist/${address ?? account.address}` : undefined, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const isNotice = useMemo(() => {
    if (!address && !account.address) {
      return false;
    }
    const messages = JSON.parse(messagesStr ?? '{}')
    const lastReads = messages?.[`${address ?? account.address}`] ?? [0, 0]
    const depositLength = moneyList.filter((item) => item.ordertype === 'DEPOSIT').length
    const withdrawLength = moneyList.filter((item) => item.ordertype === 'WITHDRAW').length
    if (lastReads[0] < depositLength) {
      return 'deposit'
    } else if (lastReads[1] < withdrawLength) {
      return 'withdraw'
    }
    return false;
  }, [moneyList.length, messagesStr, account.address, address])

  const NESTIcon = useMemo(() => {
    return "NEST".getToken()!.icon;
  }, []);

  const shareMyDealModal = useMemo(() => {
    return (
      <ShareMyDealModal
        value={{
          address: address ?? account.address,
          totalProfitLoss: positions?.totalProfitAndLoss ?? 0,
          totalRate: positions?.totalRate ?? 0,
          todayPNL: positions?.todayPnl ?? 0,
          todayRate: positions?.todayRate ?? 0,
          _7daysPNL: positions?.days7Pnl ?? 0,
          _7daysRate: positions?.days7Rate ?? 0,
          _30daysPNL: positions?.days30Pnl ?? 0,
          _30daysRate: positions?.days30Rate ?? 0,
          from: range?.[0]?.startDate?.toISOString().slice(0,10),
          to: range?.[0]?.endDate?.toISOString().slice(0,10),
        }}
        open={showShareMyDealModal}
        onClose={() => {
          setShareMyDealModal(false);
        }}
      />
    );
  }, [address, account.address, positions?.totalProfitAndLoss, positions?.totalRate, positions?.todayPnl,
    positions?.todayRate, positions?.days7Pnl, positions?.days7Rate, positions?.days30Pnl, positions?.days30Rate,
    range?.[0]?.startDate, range?.[0]?.endDate, showShareMyDealModal]);

  const addModal = useMemo(() => {
    return (
      <>
        {showDeposit ? (
          <DepositModal open={true} onClose={() => setShowDeposit(false)}/>
        ) : (
          <></>
        )}
        {showWithdraw ? (
          <WithDrawModal
            open={true}
            onClose={(res?: boolean) => {
              if (res !== undefined) {
                addTransactionNotice({
                  type: TransactionType.withdraw,
                  info: "",
                  result: res ? SnackBarType.success : SnackBarType.fail,
                });
                getAssetsList();
              }
              setShowWithdraw(false);
            }}
          />
        ) : (
          <></>
        )}
      </>
    );
  }, [
    addTransactionNotice,
    getAssetsList,
    setShowDeposit,
    setShowWithdraw,
    showDeposit,
    showWithdraw,
  ]);

  useEffect(() => {
    if (!checkSigned) {
      window.location.replace('/#/futures')
    }
  }, [checkSigned])

  return (
    <Stack alignItems={"center"}>
      {shareMyDealModal}
      {addModal}
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
              borderBottom: `2px solid ${theme.normal.primary}`,
              a: {
                color: theme.normal.primary,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })} width={['100%', '100%', '100%', 'auto']}>
              <a href={`/#/account`}>
                <Trans>Personal</Trans>
              </a>
            </Stack>
            <Stack sx={(theme) => ({
              paddingY: '11px',
              alignItems: 'center',
              a: {
                color: theme.normal.text0,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })} width={['100%', '100%', '100%', 'auto']}>
              <a href={`/#/referral`}>
                <Trans>Referral</Trans>
              </a>
            </Stack>
          </Stack>
        )
      }
      <Stack maxWidth={'1600px'} width={'100%'} mt={['20px', '20px', '20px', '40px']}>
        <Stack px={'20px'} pb={['26px', '26px', '26px', '44px']}>
          <Stack direction={['column', 'column', 'column', 'row']} padding={'4px'} borderRadius={'12px'}
                 sx={(theme) => ({
                   backgroundColor: theme.normal.bg1
                 })}>
            <Stack px={'40px'} pt={['40px', '40px', '40px', 0]}
                   pb={['24px', '24px', '24px', '40px']}
                   justifyContent={"center"} alignItems={'center'} direction={['row', 'row', 'row', 'column']}
                   gap={['8px', '8px', '8px', '12px']} sx={(theme) => ({
              background: `linear-gradient(${theme.normal.bg0}66, ${theme.normal.bg0})`,
              [theme.breakpoints.down('md')]: {
                borderRadius: "12px 12px 0 0"
              },
              [theme.breakpoints.up('md')]: {
                borderRadius: "12px 0 0 12px"
              },
            })}>
              <Stack>
                {walletIcon}
              </Stack>
              <Stack direction={'row'} spacing={'8px'}>
                <Box sx={(theme) => ({
                  color: theme.normal.text0,
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '28px',
                })}>{account.address?.showAddress()}</Box>
                <Stack justifyContent={"center"} sx={(theme) => ({
                  cursor: "pointer",
                  "& svg path": {
                    fill: theme.normal.text2,
                  },
                  "&:hover": {
                    "& svg path": {
                      fill: theme.normal.primary_hover,
                    },
                  },
                  "&:active": {
                    "& svg path": {
                      fill: theme.normal.primary_active,
                    },
                  },
                })}
                       onClick={() => {
                         copy(account.address ? account.address : "");
                         messageSnackBar(t`Copy Successfully`);
                       }}
                >
                  <Copy style={{width: "16px", height: "16px"}}/>
                </Stack>
              </Stack>
            </Stack>
            <Stack height={['100%', '100%', '100%', '160px']}
                   direction={['column', 'column', 'column', 'row']}
                   justifyContent={"space-between"}
                   alignItems={"center"}
                   width={'100%'}
                   paddingBottom={['20px', '20px', '20px', '0']}
            >
              <Stack pl={[0, 0, 0, '40px']} pb={'40px'} pt={['20px', '20px', '20px', '40px']} justifyContent={"center"} alignItems={["center", "center", 'center', 'start']} height={'100%'} spacing={['12px', '12px', '12px', '18px']}>
                <Box sx={(theme) => ({
                  color: theme.normal.text1,
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '16px',
                })}>
                  <Trans>My Balance</Trans>
                </Box>
                <Stack direction={'row'} spacing={'8px'} justifyContent={"start"} alignItems={"center"}
                       sx={(theme) => ({
                         color: theme.normal.text0,
                         fontSize: '28px',
                         fontWeight: 700,
                         lineHeight: '40px',
                         "& svg": {
                           width: "28px",
                           height: "28px",
                         },
                       })}>
                  <NESTIcon/>
                  <Box>{Number(showBalance ?? '0').toLocaleString('en-US')}</Box>
                </Stack>
              </Stack>
              <Stack direction={'row'} alignItems={"center"} pr={['0', '0', '0', '40px']}
                     spacing={['12px', '12px', '12px', '24px']}>
                <Stack px={'16px'} py={'10px'} spacing={'10px'} direction={'row'} alignItems={"center"}
                       sx={(theme) => ({
                         fontSize: '14px',
                         fontWeight: "700",
                         lineHeight: '20px',
                         color: theme.normal.text0,
                         backgroundColor: theme.normal.grey_hover,
                         borderRadius: '8px',
                         cursor: "pointer",
                         "&:hover": {
                           backgroundColor: theme.normal.grey_active,
                         },
                         "& svg path": {
                           fill: theme.normal.text0,
                         }
                       })} onClick={() => setShowWithdraw(true)}>
                  {
                    !isBigMobile && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M14.4997 7.33325C14.8679 7.33325 15.1663 7.63173 15.1663 7.99992V13.9999C15.1663 14.3681 14.8679 14.6666 14.4997 14.6666H2.49967C2.13148 14.6666 1.83301 14.3681 1.83301 13.9999V8.00269C1.83301 7.6345 2.13148 7.33602 2.49967 7.33602C2.86786 7.33602 3.16634 7.6345 3.16634 8.00269V13.3333H13.833V7.99992C13.833 7.63173 14.1315 7.33325 14.4997 7.33325Z"
                              fill="#F9F9F9" fillOpacity="0.6"/>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M5.02827 5.47132C4.76792 5.21097 4.76792 4.78886 5.02827 4.52851L8.02827 1.52851C8.28862 1.26816 8.71073 1.26816 8.97108 1.52851L11.9711 4.52851C12.2314 4.78886 12.2314 5.21097 11.9711 5.47132C11.7107 5.73167 11.2886 5.73167 11.0283 5.47132L8.49967 2.94273L5.97108 5.47132C5.71073 5.73167 5.28862 5.73167 5.02827 5.47132Z"
                              fill="#F9F9F9" fillOpacity="0.6"/>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M8.49691 11.3333C8.12872 11.3333 7.83024 11.0348 7.83024 10.6666V1.99992C7.83024 1.63173 8.12872 1.33325 8.49691 1.33325C8.8651 1.33325 9.16357 1.63173 9.16357 1.99992V10.6666C9.16357 11.0348 8.8651 11.3333 8.49691 11.3333Z"
                              fill="#F9F9F9" fillOpacity="0.6"/>
                      </svg>
                    )
                  }
                  <div>
                    <Trans>
                      Withdraw
                    </Trans>
                  </div>
                </Stack>
                <Stack px={'16px'} py={'10px'} spacing={'10px'} direction={'row'} alignItems={"center"}
                       sx={(theme) => ({
                         fontSize: '14px',
                         fontWeight: "700",
                         lineHeight: '20px',
                         color: theme.normal.highDark,
                         backgroundColor: theme.normal.primary,
                         borderRadius: '8px',
                         cursor: 'pointer',
                         "&:hover": {
                           backgroundColor: theme.normal.primary_hover,
                         },
                         "&:active": {
                           backgroundColor: theme.normal.primary_active,
                         },
                       })} onClick={() => setShowDeposit(true)}>
                  {
                    !isBigMobile && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M14.0007 7.33325C14.3688 7.33325 14.6673 7.63173 14.6673 7.99992V13.9999C14.6673 14.3681 14.3688 14.6666 14.0007 14.6666H2.00065C1.63246 14.6666 1.33398 14.3681 1.33398 13.9999V8.00269C1.33398 7.6345 1.63246 7.33602 2.00065 7.33602C2.36884 7.33602 2.66732 7.6345 2.66732 8.00269V13.3333H13.334V7.99992C13.334 7.63173 13.6325 7.33325 14.0007 7.33325Z"
                              fill="#030308"/>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M4.52925 7.19518C4.7896 6.93483 5.21171 6.93483 5.47206 7.19518L8.00065 9.72378L10.5292 7.19518C10.7896 6.93483 11.2117 6.93483 11.4721 7.19518C11.7324 7.45553 11.7324 7.87764 11.4721 8.13799L8.47206 11.138C8.21171 11.3983 7.7896 11.3983 7.52925 11.138L4.52925 8.13799C4.2689 7.87764 4.2689 7.45553 4.52925 7.19518Z"
                              fill="#030308"/>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M7.99788 1.33325C8.36607 1.33325 8.66455 1.63173 8.66455 1.99992V10.6666C8.66455 11.0348 8.36607 11.3333 7.99788 11.3333C7.62969 11.3333 7.33122 11.0348 7.33122 10.6666V1.99992C7.33122 1.63173 7.62969 1.33325 7.99788 1.33325Z"
                              fill="#030308"/>
                      </svg>
                    )
                  }
                  <div>
                    <Trans>
                      Deposit
                    </Trans>
                  </div>
                </Stack>
                <a href={`/#/overview?type=${isNotice === 'withdraw' ? 'withdraw' : 'deposit'}`}>
                  <Stack px={'16px'} py={'10px'} spacing={'10px'} direction={'row'} alignItems={"center"}
                         sx={(theme) => ({
                           fontSize: '14px',
                           fontWeight: "700",
                           lineHeight: '20px',
                           color: theme.normal.text0,
                           backgroundColor: theme.normal.grey_hover,
                           borderRadius: '8px',
                           cursor: 'pointer',
                           "&:hover": {
                             backgroundColor: theme.normal.grey_active,
                           },
                           "& svg path": {
                             fill: theme.normal.text0,
                           }
                         })}
                         position={'relative'}
                  >
                    {
                      !isBigMobile && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd"
                                d="M2.83268 2.66659C2.64859 2.66659 2.49935 2.81582 2.49935 2.99992V3.99992H14.4993V2.99992C14.4993 2.81582 14.3501 2.66659 14.166 2.66659H2.83268ZM15.8327 2.99992C15.8327 2.07944 15.0865 1.33325 14.166 1.33325H2.83268C1.91221 1.33325 1.16602 2.07944 1.16602 2.99992V12.9999C1.16602 13.9204 1.91221 14.6666 2.83268 14.6666H14.166C15.0865 14.6666 15.8327 13.9204 15.8327 12.9999V2.99992ZM14.4993 5.33325H2.49935V12.9999C2.49935 13.184 2.64859 13.3333 2.83268 13.3333H14.166C14.3501 13.3333 14.4993 13.184 14.4993 12.9999V5.33325ZM3.83268 7.99992C3.83268 7.63173 4.13116 7.33325 4.49935 7.33325H5.16602C5.5342 7.33325 5.83268 7.63173 5.83268 7.99992C5.83268 8.36811 5.5342 8.66659 5.16602 8.66659H4.49935C4.13116 8.66659 3.83268 8.36811 3.83268 7.99992ZM6.49935 7.99992C6.49935 7.63173 6.79783 7.33325 7.16602 7.33325H12.4993C12.8675 7.33325 13.166 7.63173 13.166 7.99992C13.166 8.36811 12.8675 8.66659 12.4993 8.66659H7.16602C6.79783 8.66659 6.49935 8.36811 6.49935 7.99992ZM3.83268 10.6666C3.83268 10.2984 4.13116 9.99992 4.49935 9.99992H5.16602C5.5342 9.99992 5.83268 10.2984 5.83268 10.6666C5.83268 11.0348 5.5342 11.3333 5.16602 11.3333H4.49935C4.13116 11.3333 3.83268 11.0348 3.83268 10.6666ZM6.49935 10.6666C6.49935 10.2984 6.79783 9.99992 7.16602 9.99992H12.4993C12.8675 9.99992 13.166 10.2984 13.166 10.6666C13.166 11.0348 12.8675 11.3333 12.4993 11.3333H7.16602C6.79783 11.3333 6.49935 11.0348 6.49935 10.6666Z"
                                fill="#F9F9F9" fillOpacity="0.6"/>
                        </svg>
                      )
                    }
                    <div>
                      <Trans>
                        Overview
                      </Trans>
                    </div>
                    {
                      isNotice && (
                        <Stack position={'absolute'} right={'-5px'} top={'-5px'} sx={(theme) => ({
                          '& svg circle': {
                            stroke: theme.normal.bg1
                          }
                        })}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" fill="#FF4F33" stroke="#1F2329" strokeWidth="2"/>
                          </svg>
                        </Stack>
                      )
                    }
                  </Stack>
                </a>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
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
            <Trans>
              My Positions
            </Trans>
          </Stack>
          <Stack alignItems={"center"} justifyContent={'center'} sx={(theme) => ({
            border: `1px solid ${theme.normal.border}`,
            borderRadius: '8px',
            [theme.breakpoints.down('md')]: {
              height: '32px',
              width: '32px',
              'svg': {
                "path": {
                  fill: theme.normal.text2,
                },
                width: '16px',
                height: '16px',
              }
            },
            [theme.breakpoints.up('md')]: {
              height: '36px',
              width: '36px',
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
            "& svg": {
              width: 20,
              height: 20,
            },
          })} onClick={() => setShareMyDealModal(true)}>
            <Share/>
          </Stack>
        </Stack>
        {/*PC My Positions*/}
        <Stack px={'20px'}>
          <Stack mt={'24px'} sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
              display: 'none',
            }
          })}>
            <Grid container spacing={'16px'}>
              {
                [
                  {
                    title: t`Positions Value`,
                    value: positions?.positionValue,
                    rate: null,
                  },
                  {
                    title: t`Total Profit & Loss`,
                    value: positions?.totalProfitAndLoss,
                    rate: positions?.totalRate,
                  },
                ].map((item, index) => (
                  <Grid item xs={6} md={6} key={index}>
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
                      })}>
                        {item.title}
                      </Stack>
                      <Stack sx={(theme) => ({
                        '& div:first-of-type': {
                          color: theme.normal.text0,
                          fontSize: '28px',
                          fontWeight: 'bold',
                          lineHeight: '40px',
                          whiteSpace: 'nowrap',
                        },
                        '& div:last-of-type': {
                          color: item?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                          fontSize: '24px',
                          fontWeight: 'bold',
                          lineHeight: '32px',
                          whiteSpace: 'nowrap',
                        }
                      })} spacing={'8px'}>
                        <div>{Number(item?.value ?? 0).toLocaleString('en-US', {
                          maximumFractionDigits: 2
                        })} NEST
                        </div>
                        <div
                          style={{opacity: item.rate !== null ? 1 : 0}}>{item?.rate > 0 ? '+' : ''}{Number(item?.rate ?? 0).toLocaleString('en-US', {
                          maximumFractionDigits: 2
                        })}%
                        </div>
                      </Stack>
                    </Stack>
                  </Grid>
                ))
              }
            </Grid>
            <Grid container spacing={'16px'} mt={'8px'}>
              {
                [
                  {
                    title: t`Today's PNL`,
                    value: positions?.todayPnl,
                    rate: positions?.todayRate,
                  },
                  {
                    title: t`7 Days' PNL`,
                    value: positions?.days7Pnl,
                    rate: positions?.days7Rate,
                  },
                  {
                    title: t`30 Days' PNL`,
                    value: positions?.days30Pnl,
                    rate: positions?.days30Rate,
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
                        '& div:first-of-type': {
                          color: theme.normal.text0,
                          fontSize: '28px',
                          fontWeight: 'bold',
                          lineHeight: '40px',
                          whiteSpace: 'nowrap',
                        },
                        '& div:last-of-type': {
                          color: item?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                          fontSize: '24px',
                          fontWeight: 'bold',
                          lineHeight: '32px',
                          whiteSpace: 'nowrap',
                        }
                      })} spacing={'8px'}>
                        <div>{Number(item?.value ?? 0).toLocaleString('en-US', {
                          maximumFractionDigits: 2
                        })} NEST
                        </div>
                        <div>{item?.rate > 0 ? '+' : ''}{Number(item?.rate ?? 0).toLocaleString('en-US', {
                          maximumFractionDigits: 2
                        })}%
                        </div>
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
          <Stack mt={'16px'} spacing={'16px'} sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
          })}>
            <Stack spacing={'4px'} sx={(theme) => ({
              padding: '20px 12px',
              backgroundColor: theme.normal.bg1,
              borderRadius: '12px',
            })}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack sx={(theme) => ({
                  color: theme.normal.text2,
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '20px',
                })}>
                  <Trans>
                    Positions Value
                  </Trans>
                </Stack>
                <Stack sx={(theme) => ({
                  color: theme.normal.text0,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  lineHeight: '22px',
                })}>
                  {Number(positions?.positionValue ?? 0).toLocaleString('en-US', {
                    maximumFractionDigits: 2
                  })} NEST
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={(theme) => ({
              padding: '20px 12px',
              backgroundColor: theme.normal.bg1,
              borderRadius: '12px',
            })} spacing={'22px'}>
              {
                [
                  {
                    title: t`Total Profit & Loss`,
                    value: positions?.totalProfitAndLoss,
                    rate: positions?.totalRate,
                  },
                  {
                    title: t`Today's PNL`,
                    value: positions?.todayPnl,
                    rate: positions?.todayRate,
                  },
                  {
                    title: t`7 Days' PNL`,
                    value: positions?.days7Pnl,
                    rate: positions?.days7Rate,
                  },
                  {
                    title: t`30 Days' PNL`,
                    value: positions?.days30Pnl,
                    rate: positions?.days30Rate,
                  },
                ].map((item, index) => (
                  <Stack key={index} direction={'row'} justifyContent={'space-between'}>
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
                      <span>{item.rate > 0 ? `+${Number(item?.rate ?? 0).toLocaleString('en-US', {
                        maximumFractionDigits: 2
                      })}` : Number(item?.rate ?? 0).toLocaleString('en-US', {
                        maximumFractionDigits: 2
                      })}%</span>
                    </Stack>
                  </Stack>
                ))
              }
            </Stack>
          </Stack>
        </Stack>
        <Stack
          mt={['16px', '16px', '16px', '40px']} mb={['20px', '20px', '20px', '24px']} px={'20px'}
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
              <Stack>{range?.[0].startDate?.toLocaleDateString()}</Stack>
              <Box>~</Box>
              <Stack>{range?.[0].endDate?.toLocaleDateString()}</Stack>
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
                    onChange={item => setRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    showMonthArrow={true}
                    showPreview={false}
                    showDateDisplay={false}
                    showMonthAndYearPickers={false}
                    className={nowTheme.isLight ? '' : 'dark'}
                    maxDate={new Date()}
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
        <Grid container spacing={'24px'} px={[0, 0, 0, '20px']}>
          {
            [
              {
                title: t`Volume`,
                chart: <VolumeChart address={address ?? account.address}
                                    from={range?.[0]?.startDate?.toISOString().slice(0,10)}
                                    to={range?.[0]?.endDate?.toISOString().slice(0,10)}/>,
              },
              {
                title: t`Total Asset Value`,
                chart: <TotalAssetValue address={address ?? account.address}
                                        from={range?.[0]?.startDate?.toISOString().slice(0,10)}
                                        to={range?.[0]?.endDate?.toISOString().slice(0,10)}/>
              },
              {
                title: t`Daily Return`,
                chart: <DailyReturnChart address={address ?? account.address}
                                         from={range?.[0]?.startDate?.toISOString().slice(0,10)}
                                         to={range?.[0]?.endDate?.toISOString().slice(0,10)}/>
              },
              {
                title: t`Cumulative Return`,
                chart: <CumulativeReturnChart address={address ?? account.address}
                                              from={range?.[0]?.startDate?.toISOString().slice(0,10)}
                                              to={range?.[0]?.endDate?.toISOString().slice(0,10)}/>
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Stack sx={(theme) => ({
                  [theme.breakpoints.down('md')]: {
                    height: '340px',
                    width: '100%',
                    borderBottom: index < 3 ? `1px solid ${theme.normal.border}` : '',
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
      <Stack height={['24px', '24px', '24px', '80px']}></Stack>
    </Stack>
  )
}

export default Personal