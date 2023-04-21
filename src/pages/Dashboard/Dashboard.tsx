import {FC, useCallback, useEffect, useMemo, useState} from "react"
import {Stack, styled} from "@mui/material";
import TVChart from "./TVChart/TVChart";
import {DashboardIcon2, FuturesOrder, Share} from "../../components/icons";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import useWindowWidth from "../../hooks/useWindowWidth";
import {useAccount} from "wagmi";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import FuturesOrderShare from "../Futures/Components/FuturesOrderShare";
import MainButton from "../../components/MainButton/MainButton";
import ShareMyDealModal from "./Modal/ShareMyDealModal";
import ShareMyOrderModal from "./Modal/ShareMyOrderModal";
import {lipPrice} from "../../hooks/useFuturesNewOrder";
import {BigNumber, ethers} from "ethers";
import useNEST from "../../hooks/useNEST";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../hooks/useNESTSnackBar";
import NESTLine from "../../components/NESTLine";
import FuturesTableTitle from "../Futures/Components/TableTitle";
import OrderTablePosition from "../Futures/Components/OrderTablePosition";

const DashboardShare = styled(Box)(({theme}) => ({
  borderRadius: "8px",
  border: `1px solid ${theme.normal.border}`,
  minWidth: "40px",
  minHeight: "40px",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: "20px",
    height: "20px",
    display: "block",
    margin: "0 auto",
    "& path": {
      fill: theme.normal.text2,
    },
  },
  "&:hover": {
    cursor: 'pointer',
    border: `1px solid ${theme.normal.grey_hover}`,
    background: theme.normal.grey_hover,
    "& svg path": {
      fill: theme.normal.text0,
    },
  },
  "&:active": {
    border: `1px solid ${theme.normal.grey_active}`,
    background: theme.normal.grey_active,
    "& svg path": {
      fill: theme.normal.text0,
    },
  },
}));

const Title1 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text2
}))

const Title2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "32px",
  lineHeight: "44px",
  color: theme.normal.text0
}))

const Title3 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "28px",
  lineHeight: "40px",
  color: theme.normal.text0
}))

const Title4 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "24px",
  lineHeight: "32px",
  color: theme.normal.text0
}))

const Title5 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "20px",
  lineHeight: "28px",
}))

const Caption1 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text2
}))

const Caption2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2
}))

const Caption3 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2
}))

const Caption4 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text0
}))

const Caption5 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "16px",
}))

const Card2 = styled(Stack)(({theme}) => ({
  width: '100%',
  border: '1px solid',
  borderRadius: '12px',
  borderColor: theme.normal.border,
  overflow: 'hidden',
}))

const Card3 = styled(Stack)(({theme}) => ({
  width: '100%',
  borderRadius: '12px',
  background: theme.normal.bg1,
  padding: '40px'
}))

const Card4 = styled(Stack)(({theme}) => ({
  width: '100%',
  borderRadius: '12px',
  background: theme.normal.bg1,
}))

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
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.getFullYear() + '-'
    + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
    + date.getDate().toString().padStart(2, '0') + ' '
    + date.getHours().toString().padStart(2, '0') + ':'
    + date.getMinutes().toString().padStart(2, '0') + ':'
    + date.getSeconds().toString().padStart(2, '0');
}

const Dashboard: FC = () => {
  const {address} = useAccount()
  const {setShowConnect} = useNEST();
  const {isBigMobile} = useWindowWidth()
  const [tabsValue, setTabsValue] = useState(0);
  const [burnedData, setBurnedData] = useState([]);
  const [burnedInfo, setBurnedInfo] = useState({
    dayDestroy: 0,
    totalDestroy: 0,
  });
  const [txInfo, setTxInfo] = useState({
    totalVolume: 0,
    dayVolume: 0,
  })
  const [txData, setTxData] = useState([]);
  const [myTxInfo, setMyTxInfo] = useState({
    totalValue: 0,
    // totalRate: 0,
    todayValue: 0,
    day7Value: 0,
    day30Value: 0,
    // todayRate: 0,
    // day7Rate: 0,
    // day30Rate: 0,
  });
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [positionList, setPositionList] = useState<any[]>([]);
  const [showShareMyDealModal, setShareMyDealModal] = useState(false);
  const [showShareOrderModal, setShowShareOrderModal] = useState(false);
  const [shareOrder, setShareOrder] = useState<any>(undefined);
  const {messageSnackBar} = useNESTSnackBar();

  const getBurnedData = useCallback(async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const res = await fetch(`https://api.nestfi.net/api/dashboard/destory/list?from=2022-11-28&to=${todayStr}`, {
        method: "get",
      });
      const resJson = await res.json();
      if (resJson) {
        setBurnedData(resJson.value.map((item: any) => ({
          time: item.date,
          value: item.value
        })))
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  const getTxData = useCallback(async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const res = await fetch(`https://api.nestfi.net/api/dashboard/txVolume/list?from=2022-11-28&to=${todayStr}`, {
        method: "get",
      });
      const resJson = await res.json();
      if (resJson) {
        setTxData(resJson.value.map((item: any) => ({
          time: item.date,
          value: item.value
        })))
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  const getBurnedInfo = useCallback(async () => {
    try {
      const res = await fetch('https://api.nestfi.net/api/dashboard/destory')
      const resJson = await res.json()
      if (resJson) {
        setBurnedInfo(resJson.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const getTxInfo = useCallback(async () => {
    try {
      const res = await fetch('https://api.nestfi.net/api/dashboard/txVolume')
      const resJson = await res.json()
      if (resJson) {
        setTxInfo(resJson.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const getMyTxInfo = useCallback(async () => {
    try {
      const res = await fetch(`https://api.nestfi.net/api/dashboard/myTx/info?address=${address}`)
      const resJson = await res.json()
      if (resJson) {
        setMyTxInfo(resJson.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [address])

  const getHistoryInfo = useCallback(async () => {
    try {
      const res = await fetch(`https://api.nestfi.net/api/dashboard/history/list?address=${address}`)
      const resJson = await res.json()
      if (resJson) {
        setHistoryList(resJson.value.sort((a: any, b: any) => b.time - a.time))
      }
    } catch (e) {
      console.log(e)
    }
  }, [address])

  const getPositionList = useCallback(async () => {
    try {
      const res = await fetch(`https://api.nestfi.net/api/dashboard/position/list?address=${address}`)
      const resJson = await res.json()
      if (resJson) {
        setPositionList(resJson.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [address])

  useEffect(() => {
    getMyTxInfo();
    const interval = setInterval(() => {
      getMyTxInfo();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getMyTxInfo]);

  useEffect(() => {
    getTxInfo()
    const interval = setInterval(() => {
      getTxInfo();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getTxInfo])

  useEffect(() => {
    getPositionList();
    const interval = setInterval(() => {
      getPositionList();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getPositionList]);

  useEffect(() => {
    getHistoryInfo();
    const interval = setInterval(() => {
      getHistoryInfo();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getHistoryInfo]);

  useEffect(() => {
    getBurnedInfo();
    const interval = setInterval(() => {
      getBurnedInfo();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getBurnedInfo]);

  useEffect(() => {
    getBurnedData();
    const interval = setInterval(() => {
      getBurnedData();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getBurnedData]);

  useEffect(() => {
    getTxData();
    const interval = setInterval(() => {
      getTxData();
    }, 60_000)
    return () => {
      clearInterval(interval)
    }
  }, [getTxData]);

  const shareMyDealModal = useMemo(() => {
    return (
      <ShareMyDealModal value={myTxInfo} open={showShareMyDealModal} onClose={() => {
        setShareMyDealModal(false)
      }}/>
    )
  }, [showShareMyDealModal])

  const shareMyOrderModal = useMemo(() => {
    if (!shareOrder) {
      return <></>
    }
    return (
      <ShareMyOrderModal value={shareOrder} open={showShareOrderModal} onClose={() => {
        setShowShareOrderModal(false)
      }} isClosed={tabsValue === 1}/>
    )
  }, [showShareOrderModal])

  const PCOrderRow = (item: any, index: number, isHistory: boolean = false) => {
    return (
      <TableRow key={index} sx={(theme) => ({
        ":hover": {
          background: theme.normal.bg1,
        }
      })}>
        {
          isHistory && (
            <TableCell>
              <Box
                component={"p"}
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.normal.text0,
                })}
              >
                {formatDate(item.time * 1000)}
              </Box>
            </TableCell>
          )
        }
        <TableCell>
          <OrderTablePosition
            tokenName={item.tokenPair.split('/')[0]}
            isLong={item.orientation === 'Long'}
            lever={Number(item.leverage.replace('X', ''))}
          />
        </TableCell>
        <TableCell>
          <Stack
            direction={"row"}
            spacing={"4px"}
            alignItems={"flex-end"}
            sx={(theme) => ({
              "& p": {
                fontWeight: 700,
                fontSize: 16,
                color: theme.normal.text0,
              },
              "& span": {
                fontWeight: 400,
                fontSize: 14,
                color: item.actualRate >= 0 ? theme.normal.success : theme.normal.danger,
              },
            })}
          >
            <p>{item.actualMargin.toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })} NEST</p>
            <span>{item.actualRate > 0 && '+'}{item.actualRate}%</span>
          </Stack>
        </TableCell>
        <TableCell>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: 16,
              color: theme.normal.text0,
            })}
          >
            {item.openPrice.toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })} USDT
          </Box>
        </TableCell>
        <TableCell>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: 16,
              color: theme.normal.text0,
            })}
          >
            {(lipPrice(
              ethers.utils.parseEther(item.initialMargin.toFixed(12)),
              ethers.utils.parseEther(item?.appendMargin?.toFixed(12) || '0'),
              BigNumber.from(item.leverage.replace('X', '')),
              ethers.utils.parseEther(item.lastPrice.toFixed(12)),
              ethers.utils.parseEther(item.openPrice.toFixed(12)),
              item.orientation === 'Long',
            ).div(BigNumber.from(10).pow(16)).toNumber() / 100).toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })} USDT
          </Box>
        </TableCell>
        {
          isHistory && (
            <TableCell>
              <Box
                component={"p"}
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.normal.text0,
                })}
              >
                {item.lastPrice.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })} USDT
              </Box>
            </TableCell>
          )
        }
        <TableCell>
          <Stack
            spacing={"4px"}
            sx={(theme) => ({
              "& p": {
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                color: theme.normal.text0,
              },
              "& span": {fontSize: '14px', marginRight: "4px", color: theme.normal.text2},
            })}
          >
            <Box component={"p"}>
              <span>TP</span>
              {item.sp ? item.sp.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              }) : '-'} USDT
            </Box>
            <Box component={"p"}>
              <span>SL</span>
              {item.sl ? item.sl.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              }) : '-'} USDT
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
            <FuturesOrderShare component={"button"} sx={{
              cursor: 'pointer'
            }} onClick={() => {
              setShowShareOrderModal(true)
              setShareOrder({
                ...item,
                sp: Number(item.sp.toFixed(2)),
                sl: Number(item.sl.toFixed(2)),
              })
            }}>
              <Share/>
            </FuturesOrderShare>
          </Stack>
        </TableCell>
      </TableRow>
    )
  }

  const MobileOrderCard = (item: any, index: number, isHistory: boolean = false) => {
    return (
      <Card4 sx={{
        paddingX: '16px',
        paddingY: '12px'
      }} key={index}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <OrderTablePosition
              tokenName={item.tokenPair.split('/')[0]}
              isLong={item.orientation === 'Long'}
              lever={Number(item.leverage.replace('X', ''))}
            />
            <Box component={"button"} sx={(theme) => ({
              cursor: "pointer",
              "& svg": {
                width: "20px",
                height: "20px",
                display: "block",
                margin: "0 auto",
                "& path": {
                  fill: theme.normal.text2,
                },
              },
              '&:hover': {
                "& svg path": {
                  fill: theme.normal.text0,
                }
              },
              '&:active': {
                "& svg path": {
                  fill: theme.normal.text0,
                }
              }
            })} onClick={() => {
              setShowShareOrderModal(true)
              setShareOrder({
                ...item,
                sp: Number(item.sp.toFixed(2)),
                sl: Number(item.sl.toFixed(2)),
              })
            }}>
              <Share/>
            </Box>
          </Stack>
          <Box component={"button"} sx={(theme) => ({
            cursor: "pointer",
            "& svg": {
              width: "20px",
              height: "20px",
              display: "block",
              margin: "0 auto",
              "& path": {
                fill: theme.normal.text2,
              },
            },
            '&:hover': {
              "& svg path": {
                fill: theme.normal.text0,
              }
            },
            '&:active': {
              "& svg path": {
                fill: theme.normal.text0,
              }
            }
          })} onClick={() => {
            setShowShareOrderModal(true)
            setShareOrder({
              ...item,
              sp: Number(item.sp.toFixed(2)),
              sl: Number(item.sl.toFixed(2)),
            })
          }}>
            <Share/>
          </Box>
        </Stack>
        <Stack spacing={'8px'} pt={'20px'}>
          <Stack direction={'row'}>
            <Stack width={'50%'} spacing={'4px'}>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text2
              })}>Open Price</Caption5>
              <Caption2 sx={(theme) => ({
                color: theme.normal.text0
              })}>{item.openPrice.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} USDT</Caption2>
            </Stack>
            <Stack width={'50%'} spacing={'4px'}>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text2
              })}>Actual Margin</Caption5>
              <Caption2 sx={(theme) => ({
                color: theme.normal.text0,
                'span': {
                  fontWeight: "400",
                  fontSize: "10px",
                  lineHeight: "14px",
                  color: item.actualRate >= 0 ? theme.normal.success : theme.normal.danger,
                }
              })}>{item.actualMargin.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} USDT <span>{item.actualRate > 0 && '+'}{item.actualRate}%</span>
              </Caption2>
            </Stack>
          </Stack>
          <Box py={'8px'}>
            <Box sx={(theme) => ({
              width: '100%',
              borderBottom: '1px solid',
              borderColor: theme.normal.border,
            })}/>
          </Box>
          <Stack direction={'row'}>
            <Stack direction={'row'} width={'50%'} spacing={'4px'}>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text2
              })}>Take Profit</Caption5>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text0
              })}>{item.sp.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} USDT</Caption5>
            </Stack>
            <Stack direction={'row'} width={'50%'} spacing={'4px'}>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text2
              })}>Stop Loss</Caption5>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text0
              })}>{item.sl.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} USDT</Caption5>
            </Stack>
          </Stack>
          <Stack direction={'row'}>
            <Stack direction={'row'} width={'50%'} spacing={'4px'}>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text2
              })}>Liq Price</Caption5>
              <Caption5 sx={(theme) => ({
                color: theme.normal.text0
              })}>{(lipPrice(
                ethers.utils.parseEther(item.initialMargin.toFixed(12)),
                ethers.utils.parseEther(item?.appendMargin?.toFixed(12) || '0'),
                BigNumber.from(item.leverage.replace('X', '')),
                ethers.utils.parseEther(item.lastPrice.toFixed(12)),
                ethers.utils.parseEther(item.openPrice.toFixed(12)),
                item.orientation === 'Long',
              ).div(BigNumber.from(10).pow(16)).toNumber() / 100).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} USDT</Caption5>
            </Stack>
            {
              isHistory && (
                <Stack direction={'row'} width={'50%'} spacing={'4px'}>
                  <Caption5 sx={(theme) => ({
                    color: theme.normal.text2
                  })}>Close Price</Caption5>
                  <Caption5 sx={(theme) => ({
                    color: theme.normal.text0
                  })}>{item.lastPrice.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })} USDT</Caption5>
                </Stack>
              )
            }
          </Stack>
          {
            isHistory && (
              <Stack direction={'row'} width={'50%'} spacing={'4px'}>
                <Caption5 sx={(theme) => ({
                  color: theme.normal.text2
                })}>Time</Caption5>
                <Caption5 sx={(theme) => ({
                  color: theme.normal.text0
                })}>{formatDate(item.time * 1000)}</Caption5>
              </Stack>
            )
          }
        </Stack>
      </Card4>
    )
  }

  const getNESTTabs = useMemo(() => {
    return (
      <NESTTabs
        value={tabsValue}
        className={""}
        datArray={[
          <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
            <FuturesOrder/>
            <p style={{fontWeight: 700, fontSize: '16px', lineHeight: '22px'}}>Current
              Positions</p>
          </Stack>,
          <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
            <DashboardIcon2/>
            <p style={{fontWeight: 700, fontSize: '16px', lineHeight: '22px'}}>History</p>
          </Stack>,
        ]}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={isBigMobile}
      />
    )
  }, [tabsValue, isBigMobile])

  return (
    <Stack alignItems={"center"} width={'100%'}>
      {shareMyDealModal}
      {shareMyOrderModal}
      {/*<Stack direction={'row'} width={'100%'} justifyContent={"center"} spacing={'32px'} sx={(theme) => ({*/}
      {/*  color: theme.normal.text0,*/}
      {/*  fontWeight: 700,*/}
      {/*  fontSize: '16px',*/}
      {/*  lineHeight: '22px',*/}
      {/*  background: theme.normal.bg1,*/}
      {/*  borderBottom: `1px solid ${theme.normal.border}`,*/}
      {/*  borderTop: `1px solid ${theme.normal.border}`,*/}
      {/*})}>*/}
      {/*  <Box sx={(theme) => ({*/}
      {/*    paddingY: '11px',*/}
      {/*    borderBottom: `2px solid ${theme.normal.primary}`,*/}
      {/*    a: {*/}
      {/*      color: theme.normal.primary,*/}
      {/*      cursor: 'pointer',*/}
      {/*      '&:hover': {*/}
      {/*        color: theme.normal.primary,*/}
      {/*      }*/}
      {/*    }*/}
      {/*  })}>*/}
      {/*    <a href={'/#/dashboard'}>Dashboard</a>*/}
      {/*  </Box>*/}
      {/*  <Box sx={(theme) => ({*/}
      {/*    paddingY: '11px',*/}
      {/*    a: {*/}
      {/*      color: theme.normal.text0,*/}
      {/*      cursor: 'pointer',*/}
      {/*      '&:hover': {*/}
      {/*        color: theme.normal.primary,*/}
      {/*      }*/}
      {/*    }*/}
      {/*  })}>*/}
      {/*    <a href={'/#/dashboard/mine'}>我的管理</a>*/}
      {/*  </Box>*/}
      {/*</Stack>*/}
      <Stack maxWidth={'1600px'} px={['0', '0', '20px']} width={'100%'} spacing={['20px', '20px', '40px']}
             py={['20px', '20px', '40px']}>
        <Stack>
          <Stack direction={["column", "column", "row"]} gap={['0px', '0px', '24px']}>
            <Stack sx={(theme) => ({
              width: '100%',
              border: '1px solid',
              borderRadius: '12px',
              borderColor: theme.normal.border,
              [theme.breakpoints.down('sm')]: {
                border: '0px'
              }
            })}>
              <TVChart title1={'NEST Total Burned'} title2={'Today Burned'}
                       value1={`${burnedInfo.totalDestroy === 0 ? '-' : burnedInfo.totalDestroy.toLocaleString('en-US', {
                         maximumFractionDigits: 2,
                       })}`}
                       value2={`${burnedInfo.dayDestroy === 0 ? '-' : burnedInfo.dayDestroy.toLocaleString('en-US', {
                         maximumFractionDigits: 2,
                       })}`}
                       data={burnedData}/>
            </Stack>
            <Stack sx={(theme) => ({
              width: '100%',
              border: '1px solid',
              borderRadius: '12px',
              borderColor: theme.normal.border,
              [theme.breakpoints.down('sm')]: {
                border: '0px'
              }
            })}>
              <TVChart title1={'Total Transaction Volume'} title2={'Today Volume'}
                       value1={`${txInfo.totalVolume === 0 ? '-' : txInfo.totalVolume.toLocaleString('en-US', {
                         maximumFractionDigits: 2,
                       })}`}
                       value2={`${txInfo.dayVolume === 0 ? '-' : txInfo.dayVolume.toLocaleString('en-US', {
                         maximumFractionDigits: 2,
                       })}`} data={txData}/>
            </Stack>
          </Stack>
          {
            isBigMobile && (
              <NESTLine/>
            )
          }
        </Stack>
        {
          isBigMobile ? (
            <Stack px={'20px'} spacing={'16px'}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Title1>My Positions</Title1>
                <Stack>
                  <MainButton
                    style={{
                      padding: '0px 12px',
                      height: '36px',
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '16px',
                    }}
                    title={'Copy Invitation Link'}
                    disable={!address}
                    onClick={() => {
                      if (!address) return;
                      const link = 'https://finance.nestprotocol.org/?a=' + address.slice(-8).toLowerCase()
                      copy(link);
                      messageSnackBar("Copy Successfully");
                    }}/>
                </Stack>
              </Stack>
              <Card4 sx={{position: 'relative'}}>
                {
                  !address && (
                    <Stack position={'absolute'} width={'100%'} height={'100%'} sx={(theme) => (
                      {
                        backdropFilter: 'blur(6px)',
                        background: 'rgba(0, 0, 0, 0.7)'
                      })}>
                      <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                        <Stack width={'170px'}>
                          <MainButton title={'Connect Wallet'} onClick={() => {
                            setShowConnect(true)
                          }}/>
                        </Stack>
                      </Stack>
                    </Stack>
                  )
                }
                <Stack padding={"20px 12px"}>
                  <Stack spacing={'4px'}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Caption2 sx={(theme) => ({
                        color: theme.normal.text1,
                      })}>Total Profit & Loss</Caption2>
                      <Box component={"button"} sx={(theme) => ({
                        cursor: "pointer",
                        "& svg": {
                          width: "20px",
                          height: "20px",
                          display: "block",
                          margin: "0 auto",
                          "& path": {
                            fill: theme.normal.text2,
                          },
                        },
                        '&:hover': {
                          "& svg path": {
                            fill: theme.normal.text0,
                          }
                        },
                        '&:active': {
                          "& svg path": {
                            fill: theme.normal.text0,
                          }
                        }
                      })} onClick={() => {
                        setShareMyDealModal(true)
                      }}>
                        <Share/>
                      </Box>
                    </Stack>
                    <Stack direction={'row'} spacing={'4px'} alignItems={'center'}>
                      <Title4>{myTxInfo.totalValue.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })} NEST</Title4>
                      {/*<Title5 sx={(theme) => ({*/}
                      {/*  color: theme.normal.success*/}
                      {/*})}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate.toLocaleString('en-US', {*/}
                      {/*  maximumFractionDigits: 2,*/}
                      {/*})}%</Title5>*/}
                    </Stack>
                  </Stack>
                  <Box py={'20px'}>
                    <NESTLine/>
                  </Box>
                  <Stack spacing={'22px'}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Caption3>Today's PNL</Caption3>
                      <Stack direction={'row'} alignItems={"center"} spacing={'4px'}>
                        <Caption4>{myTxInfo.todayValue.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                        })} NEST</Caption4>
                        {/*<Caption5 sx={(theme) => ({*/}
                        {/*  color: theme.normal.success*/}
                        {/*})}>{myTxInfo.todayRate > 0 && '+'}{myTxInfo.todayRate.toLocaleString('en-US', {*/}
                        {/*  maximumFractionDigits: 2,*/}
                        {/*})}%</Caption5>*/}
                      </Stack>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Caption3>7 Days' PNL</Caption3>
                      <Stack direction={'row'} alignItems={"center"} spacing={'4px'}>
                        <Caption4>{myTxInfo.day7Value.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                        })} NEST</Caption4>
                        {/*<Caption5 sx={(theme) => ({*/}
                        {/*  color: theme.normal.success*/}
                        {/*})}>{myTxInfo.day7Rate > 0 && '+'}{myTxInfo.day7Rate.toLocaleString('en-US', {*/}
                        {/*  maximumFractionDigits: 2,*/}
                        {/*})}%</Caption5>*/}
                      </Stack>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Caption3>30 Days' PNL</Caption3>
                      <Stack direction={'row'} alignItems={"center"} spacing={'4px'}>
                        <Caption4>{myTxInfo.day30Value.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                        })} NEST</Caption4>
                        {/*<Caption5 sx={(theme) => ({*/}
                        {/*  color: theme.normal.success*/}
                        {/*})}>{myTxInfo.day30Rate > 0 && '+'}{myTxInfo.day30Rate.toLocaleString('en-US', {*/}
                        {/*  maximumFractionDigits: 2,*/}
                        {/*})}%</Caption5>*/}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Card4>
            </Stack>
          ) : (
            <Card2 sx={{position: 'relative'}}>
              {
                !address && (
                  <Stack position={'absolute'} width={'100%'} p={'20px'} height={'100%'} sx={(theme) => (
                    {
                      backdropFilter: 'blur(6px)',
                      background: 'rgba(0, 0, 0, 0.7)'
                    })}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Title1>My Positions</Title1>
                    </Stack>
                    <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                      <Stack width={'170px'}>
                        <MainButton title={'Connect Wallet'} onClick={() => {
                          setShowConnect(true)
                        }}/>
                      </Stack>
                    </Stack>
                  </Stack>
                )
              }
              <Stack padding={'20px'} width={'100%'} height={'100%'}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Title1>My Positions</Title1>
                  <Stack direction={'row'} alignItems={"center"} spacing={'10px'}>
                    <MainButton
                      style={{
                        height: '40px',
                        padding: "10px 16px",
                        fontSize: '14px',
                        fontWeight: '700',
                        lineHeight: '20px',
                      }}
                      title={'Copy Invitation Link'}
                      onClick={() => {
                        if (!address) return;
                        const link = 'https://finance.nestprotocol.org/?a=' + address.slice(-8).toLowerCase()
                        copy(link);
                        messageSnackBar("Copy Successfully");
                      }}/>
                    <DashboardShare component={"button"} sx={{
                      cursor: "pointer"
                    }} onClick={() => {
                      setShareMyDealModal(true)
                    }}>
                      <Share/>
                    </DashboardShare>
                  </Stack>
                </Stack>
                <Stack alignItems={"center"} pt={'26px'} pb={'40px'} spacing={'12px'}>
                  <Title2
                    sx={(theme) => ({
                      'span': {
                        fontSize: '28px',
                        fontWeight: '700',
                        lineHeight: '40px',
                      },
                      '.color-full': {
                        // color: myTxInfo.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                      },
                    })}
                  >{myTxInfo.totalValue.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })} <span>NEST</span>
                    {/*<span*/}
                    {/*className={'color-full'}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate}%</span>*/}
                  </Title2>
                  <Caption1>Total Profit & Loss</Caption1>
                </Stack>
                <Stack direction={'row'} spacing={'16px'}>
                  <Card3>
                    <Title3
                      sx={(theme) => ({
                        'span': {
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '32px'
                        },
                        '.color-full': {
                          // color: myTxInfo.todayRate >= 0 ? theme.normal.success : theme.normal.danger,
                        }
                      })}
                    >{myTxInfo.todayValue.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })} <span>NEST</span>
                      {/*<span*/}
                      {/*className={'color-full'}>{myTxInfo.todayRate > 0 && '+'}{myTxInfo.todayRate}%</span>*/}
                    </Title3>
                    <Caption2 sx={{paddingTop: '12px'}}>Today's PNL</Caption2>
                  </Card3>
                  <Card3>
                    <Title3
                      sx={(theme) => ({
                        'span': {
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '32px'
                        },
                        '.color-full': {
                          // color: myTxInfo.day7Rate >= 0 ? theme.normal.success : theme.normal.danger,
                        }
                      })}
                    >{myTxInfo.day7Value.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })} <span>NEST</span>
                      {/*<span*/}
                      {/*className={'color-full'}>{myTxInfo.day7Rate > 0 && '+'}{myTxInfo.day7Rate}%</span>*/}
                    </Title3>
                    <Caption2 sx={{paddingTop: '12px'}}>7 Days' PNL</Caption2>
                  </Card3>
                  <Card3>
                    <Title3
                      sx={(theme) => ({
                        'span': {
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '32px'
                        },
                        '.color-full': {
                          // color: myTxInfo.day30Rate >= 0 ? theme.normal.success : theme.normal.danger,
                        },
                      })}
                    >{myTxInfo.day30Value.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })} <span>NEST</span>
                      {/*<span*/}
                      {/*className={'color-full'}>{myTxInfo.day30Rate > 0 && '+'}{myTxInfo.day30Rate}%</span>*/}
                    </Title3>
                    <Caption2 sx={{paddingTop: '12px'}}>30 Days' PNL</Caption2>
                  </Card3>
                </Stack>
              </Stack>
            </Card2>
          )
        }
        <Stack spacing={'16px'}>
          <Stack style={{alignItems: 'start'}} sx={(theme) => ({
            width: '100%',
            borderBottom: '1px solid',
            borderColor: theme.normal.border,
            paddingX: '20px'
          })}>
            {getNESTTabs}
          </Stack>
          {
            isBigMobile ? (
              <Stack px={'20px'} spacing={'12px'}>
                {
                  tabsValue === 0 && (positionList.length > 0 ? (
                      positionList.map((item, index) => (
                        MobileOrderCard(item, index)
                      ))
                    ) : (
                      <Stack sx={(theme) => ({
                        padding: "20px 0",
                        background: theme.normal.bg1,
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        borderRadius: '12px',
                        color: theme.normal.text2,
                      })}>
                        No trades yet
                      </Stack>
                    )
                  )
                }
                {
                  tabsValue === 1 && (historyList.length > 0 ? (
                      historyList.map((item, index) => (
                        MobileOrderCard(item, index, true)
                      ))
                    ) : (
                      <Stack sx={(theme) => ({
                        padding: "20px 0",
                        background: theme.normal.bg1,
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        borderRadius: '12px',
                        color: theme.normal.text2,
                      })}>
                        No trades yet
                      </Stack>
                    )
                  )
                }
              </Stack>
            ) : (
              <FuturesTableTitle
                dataArray={tabsValue === 0 ? [
                  "Position",
                  "Actual Margin",
                  "Open Price",
                  "Liq Price",
                  "Stop Order",
                  "Operate",
                ] : [
                  "Time",
                  "Position",
                  "Actual Margin",
                  "Open Price",
                  "Liq Price",
                  "Close Price",
                  "Stop Order",
                  "Operate",
                ]}
                noOrder={(tabsValue === 0 && positionList.length === 0) || (tabsValue === 1 && historyList.length === 0)}
              >
                {
                  tabsValue === 0 && positionList.map((item, index) => (
                    PCOrderRow(item, index, false)
                  ))
                }
                {
                  tabsValue === 1 && historyList.map((item, index) => (
                    PCOrderRow(item, index, true)
                  ))
                }
              </FuturesTableTitle>
            )
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Dashboard