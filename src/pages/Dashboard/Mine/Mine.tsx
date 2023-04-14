import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MainButton from "../../../components/MainButton/MainButton";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import useNEST from "../../../hooks/useNEST";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import FuturesTableTitle from "../Components/TableTitle";
import useWindowWidth from "../../../hooks/useWindowWidth";
import {styled} from "@mui/material/styles";
import {Copy, DownIcon, NEXT} from "../../../components/icons";
import TVChart from "./TVChart";
import {useMemo, useState} from "react";
import UnTxUserModal from "../Modal/UnTxUserModal";

const NextBox = styled(Box)(({theme}) => ({
  width: 14,
  height: 14,
  "& svg": {
    width: 14,
    height: 14,
    display: "block",
    "& path": {
      fill: theme.normal.text2,
    },
  },
}));

const Select1 = styled("select")(({theme}) => ({
  width: "200px",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  background: theme.normal.bg1,
  color: theme.normal.text0,
  height: '48px',
  padding: '0 12px',
  border: "1px solid",
  borderColor: theme.normal.border,
  borderRadius: "8px",
  "&:hover": {
    border: `1px solid ${theme.normal.primary}`,
  },
  "-webkit-appearance": "none",
  "-moz-appearance": "none",
  appearance: "none",
}));

const PaginationButton = styled('button')(({theme}) => {
  return {
    width: "32px",
    height: "32px",
    borderRadius: '8px',
    background: theme.normal.bg1,
    color: theme.normal.text2,
    fontWeight: 400,
    fontSize: '14px',
    "&:hover": {
      cursor: "pointer",
      color: theme.normal.bg1,
      background: theme.normal.primary_hover,
    },
    "&:active": {
      background: theme.normal.primary_active,
    },
    "&:disabled": {
      cursor: "not-allowed",
      background: theme.normal.disabled_bg,
      color: theme.normal.disabled_text,
    },
    "& .MuiCircularProgress-root": {
      color: theme.normal.highDark
    }
  };
});

const Mine = () => {
  const {account} = useNEST()
  const {messageSnackBar} = useNESTSnackBar()
  const {isBigMobile} = useWindowWidth()
  const [showModal, setShowModal] = useState(false)
  const [periodList, setPeriodList] = useState([])
  const [periodIndex, setPeriodIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(2)
  const [showTotalRewards, setShowTotalRewards] = useState(true)

  const pageWindow = useMemo(() => {
    if (totalPage <= 5) {
      return Array.from({length: totalPage}, (v, k) => k + 1)
    }
    if (page <= 3) {
      return [1, 2, 3, 4, 5]
    }
    if (page >= totalPage - 2) {
      return [totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage]
    }
    return [page - 2, page - 1, page, page + 1, page + 2]
  }, [page, totalPage])

  const PCOrderRow = (item: any, index: number) => {
    return (
      <TableRow key={index} sx={(theme) => ({
        ":hover": {
          background: theme.normal.bg1,
        }
      })}>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>@sss</Box>
        </TableCell>
        <TableCell>
          <Stack direction={'row'} spacing={'8px'} alignItems={'center'}>
            <Box sx={(theme) => ({
              fontSize: '16px',
              lineHeight: '22px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>0xsjdkekwod</Box>
            <Box sx={(theme) => ({
              "svg": {
                cursor: 'pointer',
                width: 14,
                height: 14,
                display: "block",
                "& path": {
                  fill: theme.normal.text2,
                },
              }
            })}>
              <Copy/>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>2222</Box>
        </TableCell>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>22</Box>
        </TableCell>
      </TableRow>
    )
  }

  const MobileOrderCard = (item: any, index: number) => {
    return (
      <Stack spacing={'4px'} p={'20px 16px'} sx={(theme) => ({
        background: theme.normal.bg1,
        borderRadius: '12px',
      })}>
        <Box sx={(theme) => ({
          fontSize: '14px',
          lineHeight: '20px',
          color: theme.normal.text0,
          fontWeight: 700,
        })}>
          @murtaza
        </Box>
        <Stack direction={'row'} spacing={'8px'} sx={(theme) => ({
          fontSize: '12px',
          lineHeight: '16px',
          color: theme.normal.text2,
          fontWeight: 400,
          borderBottom: `1px solid ${theme.normal.border}`,
          paddingBottom: '8px',
        })}>
          <Box>0xsjdkekwod</Box>
          <Box sx={(theme) => ({
            "svg": {
              cursor: 'pointer',
              width: 14,
              height: 14,
              display: "block",
              "& path": {
                fill: theme.normal.text2,
              },
            }
          })} onClick={() => {
            // TODO: copy
          }}>
            <Copy/>
          </Box>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} pt={'8px'}>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              Total rewards
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              6418.00 USDT
            </Box>
          </Stack>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              Week rewards
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              6418.00 USDT
            </Box>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  const switchLineType = () => {
    return (
      <Stack direction={'row'} alignItems={"center"} justifyContent={"center"} spacing={'40px'}>
        <Stack direction={"row"} spacing={'8px'} alignItems={"center"} sx={(theme) => ({
          "label": {
            color: theme.normal.text2,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 700,
            cursor: 'pointer',
          }
        })} onClick={() => {
          setShowTotalRewards(true)
        }}>
          <Stack alignItems={"center"} justifyContent={"center"} sx={(theme) => ({
            width: '14px',
            height: '14px',
            border: `1px solid ${showTotalRewards ? theme.normal.primary : theme.normal.border}`,
            borderRadius: '50%',
            cursor: 'pointer',
            background: theme.normal.bg1,
          })}>
            <Stack sx={(theme) => ({
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: showTotalRewards ? theme.normal.primary : '',
            })}>
            </Stack>
          </Stack>
          <label>Total Rewards</label>
        </Stack>
        <Stack direction={"row"} spacing={'8px'} alignItems={"center"} sx={(theme) => ({
          "label": {
            color: theme.normal.text2,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 700,
            cursor: 'pointer',
          }
        })} onClick={() => {
          setShowTotalRewards(false)
        }}>
          <Stack alignItems={"center"} justifyContent={"center"} sx={(theme) => ({
            width: '14px',
            height: '14px',
            border: `1px solid ${showTotalRewards ? theme.normal.border : theme.normal.primary}`,
            borderRadius: '50%',
            cursor: 'pointer',
            background: theme.normal.bg1,
          })}>
            <Stack sx={(theme) => ({
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: showTotalRewards ? '' : theme.normal.primary,
            })}>
            </Stack>
          </Stack>
          <label>Total Number</label>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack alignItems={"center"} width={'100%'}>
      <UnTxUserModal open={showModal} onClose={() => setShowModal(false)}/>
      {/*TODO: (option show)*/}
      <Stack direction={'row'} width={'100%'} justifyContent={"center"} spacing={'32px'} sx={(theme) => ({
        color: theme.normal.text0,
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '22px',
        background: '#1F2329',
        borderBottom: `1px solid ${theme.normal.border}`,
        borderTop: `1px solid ${theme.normal.border}`,
        padding: '0 20px',
      })}>
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
          <a href={'/#/dashboard'}>Dashboard</a>
        </Stack>
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
          <a href={'/#/dashboard/mine'}>我的管理</a>
        </Stack>
      </Stack>
      <Stack maxWidth={'1600px'} px={['0', '0', '20px']} width={'100%'} spacing={['12px', '12px', '40px']}
             pt={['0', '0', '40px']} pb={['20px', '20px', '40px']}>
        <Stack spacing={['20px', '20px', '40px']} sx={(theme) => ({
          width: '100%',
          padding: '20px',
          border: isBigMobile ? '' : `1px solid ${theme.normal.border}`,
          borderRadius: '12px',
        })}>
          {
            isBigMobile ? (
              <>
                <Stack direction={'row'} alignItems={"center"} spacing={'8px'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                  })}>
                    @muridh
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                  })}>
                    {account.address?.toString().showAddress()}
                  </Box>
                  <Box sx={(theme) => ({
                    "svg": {
                      cursor: 'pointer',
                      width: 14,
                      height: 14,
                      display: "block",
                      "& path": {
                        fill: theme.normal.text2,
                      },
                    }
                  })} onClick={() => {
                    if (account.address) {
                      copy(account.address.toString())
                      messageSnackBar("Copy Successfully");
                    }
                  }}>
                    <Copy/>
                  </Box>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction={'row'} width={'100%'} justifyContent={"space-between"} alignItems={"center"}>
                  <Stack spacing={'20px'}>
                    <Box sx={(theme) => ({
                      color: theme.normal.text2,
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '22px',
                    })}>
                      账户总览
                    </Box>
                    <Stack direction={'row'} alignItems={"baseline"} spacing={'12px'}>
                      <Box sx={(theme) => ({
                        color: theme.normal.text0,
                        fontWeight: 700,
                        fontSize: '24px',
                        lineHeight: '32px',
                      })}>
                        @murphy
                      </Box>
                      <Box sx={(theme) => ({
                        color: theme.normal.text2,
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '22px',
                      })}>
                        {account.address?.toString().showAddress()}
                      </Box>
                      <Box sx={(theme) => ({
                        "svg": {
                          cursor: 'pointer',
                          width: 14,
                          height: 14,
                          display: "block",
                          "& path": {
                            fill: theme.normal.text2,
                          },
                        }
                      })} onClick={() => {
                        if (account.address) {
                          copy(account.address.toString())
                          messageSnackBar("Copy Successfully");
                        }
                      }}>
                        <Copy/>
                      </Box>
                    </Stack>
                  </Stack>
                  <Box py={'4px'}>
                    <MainButton
                      style={{
                        padding: '0px 12px',
                        height: '36px',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '16px',
                      }}
                      title={'Copy Invitation Link'}
                      disable={!account?.address}
                      onClick={() => {
                        if (!account?.address) return;
                        const link = 'https://finance.nestprotocol.org/?a=' + account.address.slice(-8).toLowerCase()
                        copy(link);
                        messageSnackBar("Copy Successfully");
                      }}/>
                  </Box>
                </Stack>
                <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} spacing={'16px'}>
                  <Stack spacing={'12px'} sx={(theme) => ({
                    width: '100%',
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '40px',
                    'span': {
                      color: theme.normal.text2,
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                    },
                    padding: '40px',
                    background: theme.normal.bg1,
                    borderRadius: '12px'
                  })}>
                    <div>12,564,897.00 NEST</div>
                    <span>Total Rewards</span>
                  </Stack>
                  <Stack spacing={'12px'} sx={(theme) => ({
                    width: '100%',
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '40px',
                    'span': {
                      color: theme.normal.text2,
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                    },
                    padding: '40px',
                    background: theme.normal.bg1,
                    borderRadius: '12px'
                  })}>
                    <div>12,564,897.00 NEST</div>
                    <span>Not Settled</span>
                  </Stack>
                  <Stack direction={'row'} alignItems={"center"} justifyContent={'space-between'} sx={(theme) => ({
                    width: '100%',
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '40px',
                    'span': {
                      color: theme.normal.text2,
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                    },
                    padding: '40px',
                    background: theme.normal.bg1,
                    borderRadius: '12px'
                  })}>
                    <Stack spacing={'12px'}>
                      <div>12,564,897</div>
                      <span>Total Number</span>
                    </Stack>
                    <Stack direction={'row'} alignItems={"center"} spacing={'12px'} sx={(theme) => ({
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: theme.normal.text1,
                      fontWeight: 400,
                      padding: '8px 12px',
                      border: `1px solid ${theme.normal.border}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                    })} onClick={() => {
                      setShowModal(true)
                    }}>
                      <Box>有12人从未交易过</Box>
                      <NextBox>
                        <NEXT/>
                      </NextBox>
                    </Stack>
                  </Stack>
                </Stack>
              </>
            )
          }
          <TVChart data={[
            {time: "2021-05-01", value: 100},
            {time: "2021-05-02", value: 200},
            {time: "2021-05-03", value: 230},
            {time: "2021-05-04", value: 300},
          ]}/>
          {switchLineType()}
          {
            isBigMobile && (
              <Stack sx={(theme) => ({
                background: theme.normal.bg1,
                borderRadius: '12px',
                padding: '20px 12px',
              })} spacing={'20px'}>
                <Stack spacing={'4px'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                  })}>
                    Total Rewards
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                  })}>
                    12,564,897.00 NEST
                  </Box>
                </Stack>
                <Box sx={(theme) => ({
                  borderBottom: `1px solid ${theme.normal.border}`,
                })}>
                </Box>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    Not Settled
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    3922 USDT
                  </Box>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    Total Number
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    3922 USDT
                  </Box>
                </Stack>
                <Stack width={'100%'} alignItems={'end'}>
                  <Stack direction={'row'} spacing={'11px'} alignItems={"center"} sx={(theme) => ({
                    color: theme.normal.text1,
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontWeight: 400,
                    padding: '8px 12px',
                    background: theme.normal.bg3,
                    borderRadius: '16px 0 16px 16px',
                  })} onClick={() => {
                    setShowModal(true)
                  }}>
                    <Box>有233人从未交易过</Box>
                    <NextBox>
                      <NEXT/>
                    </NextBox>
                  </Stack>
                </Stack>
                <MainButton title={'Copy Invitation Link'} onClick={() => {
                }}/>
              </Stack>
            )
          }
        </Stack>
        <Stack width={'100%'} spacing={'24px'}>
          {
            isBigMobile ? (
              <Stack px={'20px'} spacing={'12px'}>
                <Stack pb={'4px'} direction={'row'} spacing={'8px'} color={'white'} justifyContent={'space-between'}>
                  <Box position={'relative'} width={'100%'}>
                    <Stack position={'absolute'} sx={(theme) => ({
                      right: '12px',
                      height: '48px',
                      justifyContent: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <DownIcon/>
                    </Stack>
                    <Select1 onChange={(e) => {
                      setPeriodIndex(Number(e.target.value))
                    }} style={{width: '100%'}}>
                      <option value={0}>5th settlement</option>
                      <option value={1}>4th settlement</option>
                    </Select1>
                  </Box>
                  <Box position={'relative'} width={'100%'}>
                    <Stack position={'absolute'} sx={(theme) => ({
                      right: '12px',
                      height: '48px',
                      justifyContent: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <DownIcon/>
                    </Stack>
                    <Select1 onChange={(e) => {
                      // TODO
                    }} style={{width: '100%'}}>
                      <option value={0}>按本期佣金</option>
                    </Select1>
                  </Box>
                </Stack>
                <MobileOrderCard item={''} index={1}/>
                <MobileOrderCard item={''} index={1}/>
                <MobileOrderCard item={''} index={1}/>
              </Stack>
            ) : (
              <>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} px={'20px'}
                       sx={(theme) => ({
                         color: theme.normal.text0,
                         fontWeight: 700,
                         fontSize: '16px',
                         lineHeight: '22px',
                         paddingBottom: '12px',
                         borderBottom: `1px solid ${theme.normal.border}`,
                       })}>
                  <div>
                    跟单名单
                  </div>
                  <Box position={'relative'}>
                    <Stack position={'absolute'} sx={(theme) => ({
                      right: '12px',
                      height: '48px',
                      justifyContent: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <DownIcon/>
                    </Stack>
                    <Select1 onChange={(e) => {
                      setPeriodIndex(Number(e.target.value))
                    }}>
                      <option value={0}>5th settlement</option>
                      <option value={1}>4th settlement</option>
                    </Select1>
                  </Box>
                </Stack>
                <FuturesTableTitle
                  dataArray={[
                    "Name",
                    "Wallet",
                    "Total rewards",
                    "Week rewards",
                  ]}
                  noOrder={false}
                >
                  <PCOrderRow item={''} index={1}/>
                </FuturesTableTitle>
                <Stack direction={'row'} spacing={'10px'} justifyContent={'end'} px={'20px'}>
                  <PaginationButton onClick={() => {
                    if (page > 1) {
                      setPage(page - 1)
                    }
                  }} disabled={page <= 1}>
                    {'<'}
                  </PaginationButton>
                  {
                    pageWindow.map((item, index) => {
                      return (
                        <PaginationButton key={index} onClick={() => {
                          setPage(item)
                        }} style={{background: item === page ? '#EAAA00' : '', color: item === page ? '#1F2329' : ''}}>
                          {item}
                        </PaginationButton>
                      )
                    })
                  }
                  <PaginationButton onClick={() => {
                    if (page < totalPage) {
                      setPage(page + 1)
                    }
                  }} disabled={page >= totalPage}>
                    {'>'}
                  </PaginationButton>
                </Stack>
              </>
            )
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Mine