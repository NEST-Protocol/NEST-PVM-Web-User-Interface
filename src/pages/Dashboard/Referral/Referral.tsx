import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MainButton from "../../../components/MainButton/MainButton";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import useWindowWidth from "../../../hooks/useWindowWidth";
import {styled} from "@mui/material/styles";
import {Copy, DownIcon, NoSort, UpSort, DownSort, Calendar, SearchIcon} from "../../../components/icons";
import {useMemo, useState} from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Divider from "@mui/material/Divider";
import useSWR from "swr";
import {useAccount} from "wagmi";
import {Trans, t} from "@lingui/macro";

const Select1 = styled("select")(({theme}) => ({
  width: "100%",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  background: theme.normal.bg1,
  color: theme.normal.text0,
  height: '100%',
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

const Input = styled("input")(({theme}) => ({
  width: "100%",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  background: theme.normal.bg1,
  color: theme.normal.text0,
  height: '100%',
  padding: '0 12px',
  border: "1px solid",
  borderColor: theme.normal.border,
  borderRadius: "8px",
  "&:hover": {
    border: `1px solid ${theme.normal.primary}`,
  },
}))

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

const Referral = () => {
  const {address} = useAccount();
  const {messageSnackBar} = useNESTSnackBar()
  const {isBigMobile} = useWindowWidth()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [sortItem, setSortItem] = useState({
    key: 'default',
    sort: 'desc',
  })
  const [searchText, setSearchText] = useState('')

  const pageWindow = useMemo(() => {
    if (totalPage <= 5) {
      return Array.from({length: totalPage}, (v, k) => k + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5]
    }
    if (currentPage >= totalPage - 2) {
      return [totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage]
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }, [currentPage, totalPage])

  const {data: overview} = useSWR(address ? `https://api.nestfi.net/api/invite/overview/${address}` : undefined, (url) => fetch(url).then((res) => res.json()));
  const {data: listData} = useSWR(address ? `https://api.nestfi.net/api/invite/list-invitee/${address}` : undefined, (url) => fetch(url).then((res) => res.json()));

  const inviteeList = useMemo(() => {
    if (!listData) {
      return []
    }
    setTotalPage(Math.ceil(listData?.value?.length / 10))
    return listData?.value?.filter((item: any) => {
      return item.walletAddress.toLowerCase().includes(searchText.toLowerCase())
    }).sort((a: any, b: any) => {
      if (sortItem.key === 'default') {
        return 0
      }
      if (sortItem.sort === 'asc') {
        return a[sortItem.key] - b[sortItem.key]
      }
      return b[sortItem.key] - a[sortItem.key]
    })
  }, [listData, sortItem, searchText])

  const PCOrderRow = (props: any) => {
    return (
      <TableRow sx={(theme) => ({
        ":hover": {
          background: theme.normal.bg1,
        }
      })}>
        <TableCell>
          <Stack direction={'row'} spacing={'8px'} alignItems={'center'}>
            <Box sx={(theme) => ({
              fontSize: '16px',
              lineHeight: '22px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>{props.item?.walletAddress || '0'}</Box>
            <Box
              onClick={() => {
                copy(props.item?.walletAddress)
                messageSnackBar(t`Copy Successfully`);
              }}
              sx={(theme) => ({
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
          })}>{props.item?.volume?.toLocaleString() || '0'}</Box>
        </TableCell>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>{props.item?.reward?.toLocaleString() || '0'}</Box>
        </TableCell>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>{props.item?.settled?.toLocaleString() || '0'}</Box>
        </TableCell>
        <TableCell>
          <Box sx={(theme) => ({
            fontSize: '16px',
            lineHeight: '22px',
            color: theme.normal.text0,
            fontWeight: 700,
          })}>{props.item?.noSettled?.toLocaleString() || '0'}</Box>
        </TableCell>
      </TableRow>
    )
  }

  const MobileOrderCard = (props: any) => {
    return (
      <Stack spacing={'4px'} p={'20px 16px'} sx={(theme) => ({
        background: theme.normal.bg1,
        borderRadius: '12px',
      })}>
        <Stack direction={'row'} spacing={'8px'} sx={(theme) => ({
          fontSize: '12px',
          lineHeight: '16px',
          color: theme.normal.text2,
          fontWeight: 400,
          borderBottom: `1px solid ${theme.normal.border}`,
          paddingBottom: '8px',
        })}>
          <Box>{props.item?.walletAddress}</Box>
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
            copy(props.item?.walletAddress || "");
            messageSnackBar(t`Copy Successfully`);
          }}>
            <Copy/>
          </Box>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} py={'8px'} sx={(theme) => ({
          borderBottom: `1px solid ${theme.normal.border}`,
        })}>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              <Trans>Total Trading Volume</Trans>
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              {props.item?.volume?.toLocaleString() || '0'} NEST
            </Box>
          </Stack>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              <Trans>Total Commissions</Trans>
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              {props.item?.reward?.toLocaleString() || '0'} NEST
            </Box>
          </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} pt={'8px'}>
          <Stack direction={'row'} spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              <Trans>Settled</Trans>
            </Box>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text0,
              fontWeight: 400,
            })}>{props.item?.settled?.toLocaleString() || '0'} NEST</Box>
          </Stack>
          <Stack direction={'row'} spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              <Trans>
                Unsettled
              </Trans>
            </Box>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text0,
              fontWeight: 400,
            })}>{props.item?.noSettled?.toLocaleString() || '0'} NEST</Box>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack alignItems={"center"} width={'100%'}>
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
          a: {
            color: theme.normal.text0,
            cursor: 'pointer',
            '&:hover': {
              color: theme.normal.primary,
            }
          }
        })}>
          <a href={'/#/dashboard'}>
            <Trans>Dashboard</Trans>
          </a>
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
          <a href={'/#/dashboard/referral'}>
            <Trans>Referral</Trans>
          </a>
        </Stack>
      </Stack>
      <Stack maxWidth={'1600px'} px={['0', '0', '20px']} width={'100%'} spacing={['12px', '12px', '40px']}
             pt={['0', '0', '40px']} pb={['20px', '20px', '40px']}>
        <Stack spacing={['20px', '20px', '40px']} sx={(theme) => ({
          width: '100%',
          padding: '40px 20px',
          border: isBigMobile ? '' : `1px solid ${theme.normal.border}`,
          borderRadius: '12px',
        })}>
          {
            isBigMobile ? (
              <>
                <Stack direction={'row'} alignItems={"center"} spacing={'8px'} justifyContent={"space-between"}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                  })}>
                    <Trans>Overview</Trans>
                  </Box>
                  <Box width={'145px'}>
                    <MainButton title={t`Copy Invitation Link`}
                                style={{height: '36px', fontSize: '12px', lineHeight: '16px', fontWeight: 700}}
                                onClick={() => {
                                  if (!address) return;
                                  const link =
                                    "https://finance.nestprotocol.org/?a=" +
                                    address.slice(-8).toLowerCase();
                                  copy(link);
                                  messageSnackBar(t`Copy Successfully`);
                                }}/>
                  </Box>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction={'row'} width={'100%'} justifyContent={"space-between"} alignItems={"center"}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                  })}>
                    <Trans>Overview</Trans>
                  </Box>
                  <Box>
                    <MainButton
                      style={{
                        padding: '0px 12px',
                        height: '36px',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '16px',
                      }}
                      title={t`Copy Invitation Link`}
                      disable={!address}
                      onClick={() => {
                        if (!address) return;
                        const link = 'https://finance.nestprotocol.org/?a=' + address.slice(-8).toLowerCase()
                        copy(link);
                        messageSnackBar("Copy Successfully");
                      }}/>
                  </Box>
                </Stack>
                <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} spacing={'16px'}>
                  {
                    [
                      {
                        title: t`Invitee transaction volume`,
                        value: overview?.value?.tradingVolume || 0,
                        unit: 'NEST',
                      },
                      {
                        title: t`Cumulative Commissions`,
                        value: overview?.value?.reward || 0,
                        unit: 'NEST',
                      },
                      {
                        title: t`Traded Invitees`,
                        value: overview?.value?.inviteeTransaction || 0,
                        unit: '',
                      },
                      {
                        title: t`Total Invitees`,
                        value: overview?.value?.invitee || 0,
                        unit: '',
                      }
                    ].map((item, index) => (
                      <Stack spacing={'12px'} sx={(theme) => ({
                        width: '100%',
                        minWidth: '200px',
                        overflow: 'hidden',
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
                        <div>{item.value.toLocaleString('en-US')} {item.unit}</div>
                        <span>{item.title}</span>
                      </Stack>
                    ))
                  }
                </Stack>
                <Stack sx={(theme) => ({
                  color: theme.normal.text2,
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                })}>
                  <Trans>
                    * due to the complexity of financial data, there might be nuances and delay. Data displayed above
                    is for reference only.We sincerely apologize for any inconvenience.
                  </Trans>
                </Stack>
              </>
            )
          }
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
                    <Trans>
                      Cumulative Invitee Trading Volume
                    </Trans>
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                  })}>
                    {overview?.value?.tradingVolume || 0} NEST
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
                    <Trans>
                      Cumulative Commission
                    </Trans>
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    {overview?.value?.reward || 0} NEST
                  </Box>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    <Trans>
                      Traded Invitees
                    </Trans>
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    {overview?.value?.inviteeTransaction || 0}
                  </Box>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    <Trans>
                      Total Invitees
                    </Trans>
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    {overview?.value?.invitee || 0}
                  </Box>
                </Stack>
                <Divider/>
                <Stack sx={(theme) => ({
                  color: theme.normal.text2,
                  fontWeight: 400,
                  fontSize: '10px',
                  lineHeight: '14px',
                })}>
                  <Trans>* due to the complexity of financial data, there might be nuances and delay. Data displayed above
                    is for reference only.We sincerely apologize for any inconvenience.
                  </Trans>
                </Stack>
              </Stack>
            )
          }
        </Stack>
        <Stack width={'100%'} spacing={'24px'}>
          {
            isBigMobile ? (
              <>
                <Stack sx={(theme) => ({
                  color: theme.normal.text0,
                  padding: '11px 20px',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '22px',
                  borderBottom: `1px solid ${theme.normal.border}`,
                })}>
                  <Trans>
                    My commissions
                  </Trans>
                </Stack>
                <Stack direction={'row'} px={'20px'} spacing={'8px'} height={'38px'}>
                  <Box position={'relative'} width={'100%'} height={'100%'}>
                    <Box position={'absolute'} sx={(theme) => ({
                      color: theme.normal.text2,
                      right: '12px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <DownIcon/>
                    </Box>
                    <Select1 value={sortItem.key} onChange={(e) => {
                      setSortItem({
                        key: e.target.value,
                        sort: 'desc',
                      })
                    }}>
                      <option value={'default'}>
                        <Trans>Default</Trans>
                      </option>
                      <option value={'volume'}>
                        <Trans>Trading Volume</Trans>
                      </option>
                      <option value={'reward'}>
                        <Trans>Total Commissions</Trans>
                      </option>
                      <option value={'settled'}>
                        <Trans>Settled Commissions</Trans>
                      </option>
                      <option value={'noSettled'}>
                        <Trans>Unsettled Commissions</Trans>
                      </option>
                    </Select1>
                  </Box>
                  <Box position={"relative"} width={'220px'} height={'100%'}>
                    <Box position={'absolute'} sx={(theme) => ({
                      color: theme.normal.text2,
                      right: '12px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <SearchIcon/>
                    </Box>
                    <Input placeholder={t`Search`} value={searchText} onChange={(e) => {
                      setSearchText(e.target.value)
                    }}/>
                  </Box>
                </Stack>
                <Stack px={'20px'} spacing={'12px'}>
                  {
                    inviteeList.map((item: any, index: number) => (
                      <MobileOrderCard item={item} key={index}/>
                    ))
                  }
                </Stack>
              </>
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
                  <Trans>
                    My commissions
                  </Trans>
                  <Box position={"relative"} height={"28px"}>
                    <Box position={'absolute'} sx={(theme) => ({
                      color: theme.normal.text2,
                      right: '12px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        height: '12px',
                        width: '12px',
                        '& path': {
                          fill: theme.normal.text2
                        },
                      },
                    })}>
                      <SearchIcon/>
                    </Box>
                    <Input placeholder={'Search'} value={searchText} onChange={(e) => {
                      setSearchText(e.target.value)
                    }}></Input>
                  </Box>
                </Stack>
                <TableContainer component={"div"}>
                  <Table sx={{width: "100%"}} aria-label="simple table">
                    <TableHead
                      sx={(theme) => ({
                        "& th": {
                          padding: "0 20px",
                          height: "44px",
                          fontWeight: 400,
                          fontSize: 12,
                          lineHeight: "16px",
                          color: theme.normal.text2,
                          borderBottom: `1px solid ${theme.normal.border}`,
                        },
                      })}
                    >
                      <TableRow>
                        <TableCell align="left">
                          <Trans>
                            Address
                          </Trans>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={'row'} spacing={'8px'} onClick={() => {
                            setCurrentPage(1)
                            setSortItem({
                              key: 'volume',
                              sort: sortItem.key === 'volume' ? (sortItem.sort === 'asc' ? 'desc' : 'asc') : 'desc'
                            })
                          }} style={{cursor: 'pointer', userSelect: 'none'}}>
                            <div>
                              <Trans>Total Trading Volume</Trans>
                            </div>
                            {
                              sortItem.key === 'volume' ? (
                                sortItem.sort === 'asc' ? (
                                  <UpSort/>
                                ) : (
                                  <DownSort/>
                                )
                              ) : (
                                <NoSort/>
                              )
                            }
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={'row'} spacing={'8px'} onClick={() => {
                            setCurrentPage(1)
                            setSortItem({
                              key: 'reward',
                              sort: sortItem.key === 'reward' ? (sortItem.sort === 'asc' ? 'desc' : 'asc') : 'desc'
                            })
                          }} style={{cursor: 'pointer', userSelect: 'none'}}>
                            <div>
                              <Trans>Total Commissions</Trans>
                            </div>
                            {
                              sortItem.key === 'reward' ? (
                                sortItem.sort === 'asc' ? (
                                  <UpSort/>
                                ) : (
                                  <DownSort/>
                                )
                              ) : (
                                <NoSort/>
                              )
                            }
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={'row'} spacing={'8px'} onClick={() => {
                            setCurrentPage(1)
                            setSortItem({
                              key: 'settled',
                              sort: sortItem.key === 'settled' ? (sortItem.sort === 'asc' ? 'desc' : 'asc') : 'desc'
                            })
                          }} style={{cursor: 'pointer', userSelect: 'none'}}>
                            <div>
                              <Trans>Settled Commissions</Trans>
                            </div>
                            {
                              sortItem.key === 'settled' ? (
                                sortItem.sort === 'asc' ? (
                                  <UpSort/>
                                ) : (
                                  <DownSort/>
                                )
                              ) : (
                                <NoSort/>
                              )
                            }
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={'row'} spacing={'8px'} onClick={() => {
                            setCurrentPage(1)
                            setSortItem({
                              key: 'noSettled',
                              sort: sortItem.key === 'noSettled' ? (sortItem.sort === 'asc' ? 'desc' : 'asc') : 'desc'
                            })
                          }} style={{cursor: 'pointer', userSelect: 'none'}}>
                            <div>
                              <Trans>Unsettled Commissions</Trans>
                            </div>
                            {
                              sortItem.key === 'noSettled' ? (
                                sortItem.sort === 'asc' ? (
                                  <UpSort/>
                                ) : (
                                  <DownSort/>
                                )
                              ) : (
                                <NoSort/>
                              )
                            }
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={(theme) => ({
                        "& td": {
                          padding: "0 20px",
                          height: "84px",
                          borderBottom: `1px solid ${theme.normal.border}`,
                        },
                      })}
                    >
                      {
                        inviteeList
                          .slice((currentPage - 1) * 10, currentPage * 10)
                          .map((item: any, index: number) => (
                            <PCOrderRow item={item} key={index}/>
                          ))
                      }
                      {inviteeList.length === 0 && (
                        <TableRow sx={{"& td": {borderBottom: "0px"}}}>
                          <TableCell
                            colSpan={6}
                            sx={(theme) => ({
                              width: "100%",
                              fontSize: 14,
                              fontWeight: 400,
                              color: theme.normal.text2,
                              height: "168px",
                              textAlign: "center",
                              lineHeight: "168px",
                            })}
                          >
                            <Trans>
                              No commissions yet
                            </Trans>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack direction={'row'} spacing={'10px'} justifyContent={'end'} px={'20px'}>
                  <PaginationButton onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1)
                    }
                  }} disabled={currentPage <= 1}>
                    {'<'}
                  </PaginationButton>
                  {
                    pageWindow.map((item, index) => {
                      return (
                        <PaginationButton key={index} onClick={() => {
                          setCurrentPage(item)
                        }} style={{
                          background: item === currentPage ? '#EAAA00' : '',
                          color: item === currentPage ? '#1F2329' : ''
                        }}>
                          {item}
                        </PaginationButton>
                      )
                    })
                  }
                  <PaginationButton onClick={() => {
                    if (currentPage < totalPage) {
                      setCurrentPage(currentPage + 1)
                    }
                  }} disabled={currentPage >= totalPage}>
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

export default Referral