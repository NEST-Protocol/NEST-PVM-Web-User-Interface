import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MainButton from "../../../components/MainButton/MainButton";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import useWindowWidth from "../../../hooks/useWindowWidth";
import {styled} from "@mui/material/styles";
import {Copy, DownIcon, SearchIcon} from "../../../components/icons";
import {useEffect, useMemo, useState} from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Divider from "@mui/material/Divider";
import useSWR from "swr";
import {useAccount} from "wagmi";
import {Trans, t} from "@lingui/macro";
import {isAddress} from "ethers/lib/utils";

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

const InputPC = styled("input")(({theme}) => ({
  width: "100%",
  fontWeight: "700",
  fontSize: "12px",
  lineHeight: "16px",
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

const NoSort = () => {
  return (
    <Stack direction={'row'} spacing={'1.5px'} alignItems={"center"} sx={(theme) => ({
      '& svg': {
        '& path': {
          fill: theme.normal.text2
        }
      },
    })}>
      <svg width="12" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M4.24984 1.48714C4.25314 1.35504 4.20437 1.22188 4.10355 1.12106C3.90829 0.925794 3.59171 0.925794 3.39645 1.12106L0.396447 4.12105C0.201184 4.31632 0.201184 4.6329 0.396446 4.82816C0.591709 5.02342 0.908291 5.02342 1.10355 4.82816L3.25 2.68172V10.4998C3.25 10.7759 3.47386 10.9998 3.75 10.9998C4.02614 10.9998 4.25 10.7759 4.25 10.4998V1.49976C4.25 1.49554 4.24995 1.49133 4.24984 1.48714Z"
              fill="#030308" fillOpacity="0.6" className={'lightHeight'}/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M6.75 1.52539C6.75 1.24925 6.52614 1.02539 6.25 1.02539C5.97386 1.02539 5.75 1.24925 5.75 1.52539V10.5254C5.75 10.5936 5.76368 10.6587 5.78844 10.718C5.81171 10.7738 5.84556 10.8263 5.88998 10.8724C5.89425 10.8768 5.8986 10.8811 5.90303 10.8854C5.94787 10.9287 5.9988 10.9619 6.05299 10.9851C6.11345 11.011 6.18005 11.0254 6.25 11.0254C6.31995 11.0254 6.38655 11.011 6.44701 10.9851C6.5012 10.9619 6.55213 10.9287 6.59697 10.8854C6.59949 10.883 6.60199 10.8805 6.60446 10.878L9.60355 7.87894C9.79882 7.68368 9.79882 7.3671 9.60355 7.17184C9.40829 6.97657 9.09171 6.97657 8.89645 7.17184L6.75 9.31828V1.52539Z"
              fill="#030308" fillOpacity="0.6" className={'lightHeight'}/>
      </svg>
    </Stack>
  )
}

const UpSort = () => {
  return (
    <Stack direction={'row'} spacing={'1.5px'} alignItems={"center"} sx={(theme) => ({
      '& svg': {
        '& path:last-child': {
          fill: theme.normal.text2,
        }
      }
    })}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M5.24984 1.48714C5.25313 1.35503 5.20437 1.22187 5.10355 1.12106C4.90829 0.925794 4.59171 0.925794 4.39645 1.12106L1.39645 4.12105C1.20118 4.31632 1.20118 4.6329 1.39645 4.82816C1.59171 5.02342 1.90829 5.02342 2.10355 4.82816L4.25 2.68172V10.4998C4.25 10.7759 4.47386 10.9998 4.75 10.9998C5.02614 10.9998 5.25 10.7759 5.25 10.4998V1.49976C5.25 1.49554 5.24995 1.49133 5.24984 1.48714Z"
              fill="#EAAA00"/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M7.75 1.52539C7.75 1.24925 7.52614 1.02539 7.25 1.02539C6.97386 1.02539 6.75 1.24925 6.75 1.52539V10.5254C6.75 10.5932 6.76349 10.6578 6.78794 10.7168C6.81123 10.7731 6.84524 10.826 6.88998 10.8724C6.89425 10.8768 6.8986 10.8811 6.90303 10.8854C6.94864 10.9294 7.00056 10.963 7.0558 10.9863C7.1155 11.0115 7.18113 11.0254 7.25 11.0254C7.31887 11.0254 7.3845 11.0115 7.4442 10.9863C7.49944 10.963 7.55136 10.9294 7.59697 10.8854C7.59949 10.883 7.60199 10.8805 7.60446 10.878L10.6036 7.87894C10.7988 7.68368 10.7988 7.3671 10.6036 7.17184C10.4083 6.97657 10.0917 6.97657 9.89645 7.17184L7.75 9.31828V1.52539Z"
              fill="#030308" fillOpacity="0.6" className={'lightHeight'}/>
      </svg>
    </Stack>
  )
}

const DownSort = () => {
  return (
    <Stack direction={'row'} spacing={'1.5px'} alignItems={"center"} sx={(theme) => ({
        '& svg': {
          '& path:first-child': {
            fill: theme.normal.text2,
          }
        }
      }
    )}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M5.24984 1.48714C5.25313 1.35503 5.20437 1.22187 5.10355 1.12106C4.90829 0.925794 4.59171 0.925794 4.39645 1.12106L1.39645 4.12105C1.20118 4.31632 1.20118 4.6329 1.39645 4.82816C1.59171 5.02342 1.90829 5.02342 2.10355 4.82816L4.25 2.68172V10.4998C4.25 10.7759 4.47386 10.9998 4.75 10.9998C5.02614 10.9998 5.25 10.7759 5.25 10.4998V1.49976C5.25 1.49554 5.24995 1.49133 5.24984 1.48714Z"
              fill="#030308" fillOpacity="0.6" className={'lightHeight'}/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M7.75 1.52539C7.75 1.24925 7.52614 1.02539 7.25 1.02539C6.97386 1.02539 6.75 1.24925 6.75 1.52539V10.5254C6.75 10.5936 6.76368 10.6587 6.78844 10.718C6.81171 10.7738 6.84556 10.8263 6.88998 10.8724C6.89425 10.8768 6.8986 10.8811 6.90303 10.8854C6.94787 10.9287 6.9988 10.9619 7.05299 10.9851C7.11345 11.011 7.18005 11.0254 7.25 11.0254C7.31995 11.0254 7.38655 11.011 7.44701 10.9851C7.5012 10.9619 7.55213 10.9287 7.59697 10.8854C7.59949 10.883 7.60199 10.8805 7.60446 10.878L10.6036 7.87894C10.7988 7.68368 10.7988 7.3671 10.6036 7.17184C10.4083 6.97657 10.0917 6.97657 9.89645 7.17184L7.75 9.31828V1.52539Z"
              fill="#EAAA00"/>
      </svg>
    </Stack>
  )
}

const Referral = () => {
  const {address} = useAccount();
  const {messageSnackBar} = useNESTSnackBar()
  const {isBigMobile} = useWindowWidth()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [sortItem, setSortItem] = useState({
    key: 'noSettled',
    sort: 'desc',
  })
  const [searchText, setSearchText] = useState('')
  const [queryAddress, setQueryAddress] = useState('')
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

  const {data: overview} = useSWR(queryAddress || address ? `https://api.nestfi.net/api/invite/overview/${queryAddress || address}` : undefined, (url) => fetch(url).then((res) => res.json()));
  const {data: listData} = useSWR(queryAddress || address ? `https://api.nestfi.net/api/invite/list-invitee/${queryAddress || address}` : undefined, (url) => fetch(url).then((res) => res.json()));

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

  useEffect(() => {
    const code = window.location.href.split("?q=")[1];
    if (isAddress(code)) {
      setQueryAddress(code);
    }
  }, [])

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
                },
                "&:hover": {
                  "svg": {
                    cursor: 'pointer',
                    width: 14,
                    height: 14,
                    display: "block",
                    "& path": {
                      fill: theme.normal.primary_hover,
                    },
                  },
                },
                "&:active": {
                  "svg": {
                    cursor: 'pointer',
                    width: 14,
                    height: 14,
                    display: "block",
                    "& path": {
                      fill: theme.normal.primary_active,
                    },
                  }
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
      <Stack maxWidth={'1600px'} px={['0', '0', '20px']} width={'100%'} spacing={['12px', '12px', '80px']}
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
                <Stack direction={'row'} alignItems={"center"} spacing={'8px'} justifyContent={"space-between"}>
                  <Stack direction={'row'} spacing={'8px'} sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                  })}>
                    {/*<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*  <path fillRule="evenodd" clipRule="evenodd"*/}
                    {/*        d="M9.00004 0.25L4.01129 2.93049L5.8454 3.92075L9.00004 2.23049L12.1546 3.92075L13.9887 2.93049L9.00004 0.25ZM12.1546 5.32075L13.9887 6.31098V8.29147L10.8341 9.98171V13.3622L9.00004 14.3525L7.16593 13.3622V9.98171L4.01129 8.29147V6.31098L5.8454 5.32075L9.00004 7.01096L12.1546 5.32075ZM13.9887 9.69148V11.672L12.1546 12.6623V10.6817L13.9887 9.69148ZM12.1363 14.0622L15.291 12.3719V8.99145L17.125 8.00125V13.3622L12.1363 16.0427V14.0622ZM15.291 5.61098L13.4568 4.62075L15.291 3.63049L17.125 4.62075V6.60124L15.291 7.5915V5.61098ZM7.16593 16.7598V14.7793L9.00004 15.7695L10.8341 14.7793V16.7598L9.00004 17.75L7.16593 16.7598ZM5.8454 12.6623L4.01129 11.672V9.69148L5.8454 10.6817V12.6623ZM9.00004 5.61098L7.16593 4.62075L9.00004 3.63049L10.8341 4.62075L9.00004 5.61098ZM4.54318 4.62075L2.70908 5.61098V7.5915L0.875 6.60124V4.62075L2.70908 3.63049L4.54318 4.62075ZM0.875 8.00125L2.70908 8.99145V12.3719L5.86371 14.0622V16.0427L0.875 13.3622V8.00125Z"*/}
                    {/*        fill="#F0B90B"/>*/}
                    {/*</svg>*/}
                    <div>
                      <Trans>Overview</Trans>
                    </div>
                  </Stack>
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
                  <Stack direction={'row'} spacing={'8px'} sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                  })}>
                    {/*<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*  <path fillRule="evenodd" clipRule="evenodd"*/}
                    {/*        d="M9.00004 0.25L4.01129 2.93049L5.8454 3.92075L9.00004 2.23049L12.1546 3.92075L13.9887 2.93049L9.00004 0.25ZM12.1546 5.32075L13.9887 6.31098V8.29147L10.8341 9.98171V13.3622L9.00004 14.3525L7.16593 13.3622V9.98171L4.01129 8.29147V6.31098L5.8454 5.32075L9.00004 7.01096L12.1546 5.32075ZM13.9887 9.69148V11.672L12.1546 12.6623V10.6817L13.9887 9.69148ZM12.1363 14.0622L15.291 12.3719V8.99145L17.125 8.00125V13.3622L12.1363 16.0427V14.0622ZM15.291 5.61098L13.4568 4.62075L15.291 3.63049L17.125 4.62075V6.60124L15.291 7.5915V5.61098ZM7.16593 16.7598V14.7793L9.00004 15.7695L10.8341 14.7793V16.7598L9.00004 17.75L7.16593 16.7598ZM5.8454 12.6623L4.01129 11.672V9.69148L5.8454 10.6817V12.6623ZM9.00004 5.61098L7.16593 4.62075L9.00004 3.63049L10.8341 4.62075L9.00004 5.61098ZM4.54318 4.62075L2.70908 5.61098V7.5915L0.875 6.60124V4.62075L2.70908 3.63049L4.54318 4.62075ZM0.875 8.00125L2.70908 8.99145V12.3719L5.86371 14.0622V16.0427L0.875 13.3622V8.00125Z"*/}
                    {/*        fill="#F0B90B"/>*/}
                    {/*</svg>*/}
                    <div>
                      <Trans>Overview</Trans>
                    </div>

                  </Stack>
                  <Box>
                    <MainButton
                      style={{
                        padding: '0px 12px',
                        height: '36px',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '16px',
                        borderRadius: '8px',
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
                        title: t`Invitee Trading Volume`,
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
                    * Due to the complexity of financial data, there might be nuances and delay. Data displayed above
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
                  <Trans>* Due to the complexity of financial data, there might be nuances and delay. Data displayed above
                    is for reference only.We sincerely apologize for any inconvenience.
                  </Trans>
                </Stack>
              </Stack>
            )
          }
        </Stack>
        <Stack width={'100%'} spacing={'12px'}>
          {
            isBigMobile ? (
              <>
                <Stack direction={'row'} spacing={'8px'} alignItems={"center"} sx={(theme) => ({
                  color: theme.normal.text0,
                  padding: '11px 20px',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '22px',
                  borderBottom: `1px solid ${theme.normal.border}`,
                })}>
                  {/*<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                  {/*  <path fillRule="evenodd" clipRule="evenodd"*/}
                  {/*        d="M9.00004 0.25L4.01129 2.93049L5.8454 3.92075L9.00004 2.23049L12.1546 3.92075L13.9887 2.93049L9.00004 0.25ZM12.1546 5.32075L13.9887 6.31098V8.29147L10.8341 9.98171V13.3622L9.00004 14.3525L7.16593 13.3622V9.98171L4.01129 8.29147V6.31098L5.8454 5.32075L9.00004 7.01096L12.1546 5.32075ZM13.9887 9.69148V11.672L12.1546 12.6623V10.6817L13.9887 9.69148ZM12.1363 14.0622L15.291 12.3719V8.99145L17.125 8.00125V13.3622L12.1363 16.0427V14.0622ZM15.291 5.61098L13.4568 4.62075L15.291 3.63049L17.125 4.62075V6.60124L15.291 7.5915V5.61098ZM7.16593 16.7598V14.7793L9.00004 15.7695L10.8341 14.7793V16.7598L9.00004 17.75L7.16593 16.7598ZM5.8454 12.6623L4.01129 11.672V9.69148L5.8454 10.6817V12.6623ZM9.00004 5.61098L7.16593 4.62075L9.00004 3.63049L10.8341 4.62075L9.00004 5.61098ZM4.54318 4.62075L2.70908 5.61098V7.5915L0.875 6.60124V4.62075L2.70908 3.63049L4.54318 4.62075ZM0.875 8.00125L2.70908 8.99145V12.3719L5.86371 14.0622V16.0427L0.875 13.3622V8.00125Z"*/}
                  {/*        fill="#F0B90B"/>*/}
                  {/*</svg>*/}
                  <div>
                    <Trans>
                      My commissions
                    </Trans>
                  </div>
                </Stack>
                {
                  inviteeList.length > 0 && (
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
                      <Box position={"relative"} width={'100%'} height={'100%'}>
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
                  )
                }
                <Stack px={'20px'} spacing={'12px'}>
                  {
                    inviteeList.map((item: any, index: number) => (
                      <MobileOrderCard item={item} key={index}/>
                    ))
                  }
                  {
                    inviteeList.length === 0 && (
                      <Stack justifyContent={'center'} alignItems={'center'} height={'60px'} sx={(theme) => ({
                        color: theme.normal.text2,
                        background: theme.normal.bg1,
                        borderRadius: '12px',
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: 400,
                      })}>
                        <Trans>No commissions yet</Trans>
                      </Stack>
                    )
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
                  <Stack direction={'row'} spacing={'8px'} alignItems={"center"} justifyContent={"center"}>
                    {/*<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*  <path fillRule="evenodd" clipRule="evenodd"*/}
                    {/*        d="M9.00004 0.25L4.01129 2.93049L5.8454 3.92075L9.00004 2.23049L12.1546 3.92075L13.9887 2.93049L9.00004 0.25ZM12.1546 5.32075L13.9887 6.31098V8.29147L10.8341 9.98171V13.3622L9.00004 14.3525L7.16593 13.3622V9.98171L4.01129 8.29147V6.31098L5.8454 5.32075L9.00004 7.01096L12.1546 5.32075ZM13.9887 9.69148V11.672L12.1546 12.6623V10.6817L13.9887 9.69148ZM12.1363 14.0622L15.291 12.3719V8.99145L17.125 8.00125V13.3622L12.1363 16.0427V14.0622ZM15.291 5.61098L13.4568 4.62075L15.291 3.63049L17.125 4.62075V6.60124L15.291 7.5915V5.61098ZM7.16593 16.7598V14.7793L9.00004 15.7695L10.8341 14.7793V16.7598L9.00004 17.75L7.16593 16.7598ZM5.8454 12.6623L4.01129 11.672V9.69148L5.8454 10.6817V12.6623ZM9.00004 5.61098L7.16593 4.62075L9.00004 3.63049L10.8341 4.62075L9.00004 5.61098ZM4.54318 4.62075L2.70908 5.61098V7.5915L0.875 6.60124V4.62075L2.70908 3.63049L4.54318 4.62075ZM0.875 8.00125L2.70908 8.99145V12.3719L5.86371 14.0622V16.0427L0.875 13.3622V8.00125Z"*/}
                    {/*        fill="#F0B90B"/>*/}
                    {/*</svg>*/}
                    <div>
                      <Trans>
                        My commissions
                      </Trans>
                    </div>
                  </Stack>

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
                    <InputPC placeholder={'Search'} value={searchText} onChange={(e) => {
                      setSearchText(e.target.value)
                    }}></InputPC>
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
                            if (sortItem.key === 'volume' && sortItem.sort === 'asc') {
                              setSortItem({
                                key: 'default',
                                sort: 'desc'
                              })
                              return
                            }
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
                            if (sortItem.key === 'reward' && sortItem.sort === 'asc') {
                              setSortItem({
                                key: 'default',
                                sort: 'desc'
                              })
                              return
                            }
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
                            if (sortItem.key === 'settled' && sortItem.sort === 'asc') {
                              setSortItem({
                                key: 'default',
                                sort: 'desc'
                              })
                              return
                            }
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
                            if (sortItem.key === 'noSettled' && sortItem.sort === 'asc') {
                              setSortItem({
                                key: 'default',
                                sort: 'desc'
                              })
                              return
                            }
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
                {
                  inviteeList.length > 0 && (
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
                  )
                }
              </>
            )
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Referral