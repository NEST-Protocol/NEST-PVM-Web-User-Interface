import {FC, useMemo, useState} from "react";
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
import {Trans, t} from "@lingui/macro";
import useSWR from "swr";
import NetworkIcon from "./Components/NetworkIcon";
import MobileOrderTypePosition from "./Components/MobileOrderTypePosition";

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
    cursor: "pointer",
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
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text2,
}));

const Title2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "32px",
  lineHeight: "44px",
  color: theme.normal.text0,
}));

const Title3 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "28px",
  lineHeight: "40px",
  color: theme.normal.text0,
}));

const Title4 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "24px",
  lineHeight: "32px",
  color: theme.normal.text0,
}));

const Caption1 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text2,
}));

const Caption2 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2,
}));

const Caption3 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text2,
}));

const Caption4 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text0,
}));

const Caption5 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "16px",
}));

const Card2 = styled(Stack)(({theme}) => ({
  width: "100%",
  border: "1px solid",
  borderRadius: "12px",
  borderColor: theme.normal.border,
  overflow: "hidden",
}));

const Card3 = styled(Stack)(({theme}) => ({
  width: "100%",
  borderRadius: "12px",
  background: theme.normal.bg1,
  padding: "40px",
}));

const Card4 = styled(Stack)(({theme}) => ({
  width: "100%",
  borderRadius: "12px",
  background: theme.normal.bg1,
}));

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

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0")
  );
}

const Dashboard: FC = () => {
  const {address} = useAccount();
  const {setShowConnect, chainsData} = useNEST();
  const {isBigMobile} = useWindowWidth();
  const [tabsValue, setTabsValue] = useState(0);
  const [showShareMyDealModal, setShareMyDealModal] = useState(false);
  const [showShareOrderModal, setShowShareOrderModal] = useState(false);
  const [shareOrder, setShareOrder] = useState<any>(undefined);
  const {messageSnackBar} = useNESTSnackBar();

  const getQueryVariable = (variable: string) => {
    const query = window.location.search.substring(1);
    if (query) {
      const vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) === variable) {
          return decodeURIComponent(pair[1]);
        }
      }
    }
    return null;
  };

  const a = getQueryVariable("address");

  const {data: burnedData} = useSWR(`https://api.nestfi.net/api/dashboard/destory/list?chainId=${chainsData.chainId === 534353 ? 534353 : 56}&from=2022-11-28&to=${(new Date()).toISOString().split("T")[0]}`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value)
    .then((res: any) => res.map((item: any) => ({
      time: item.date,
      value: item.value ?? 0,
    }))));

  const {data: txData} = useSWR(`https://api.nestfi.net/api/dashboard/txVolume/list?chainId=${chainsData.chainId === 534353 ? 534353 : 56}&from=2022-11-28&to=${(new Date()).toISOString().split("T")[0]}`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value)
    .then((res: any) => res.map((item: any) => ({
      time: item.date,
      value: item.value ?? 0,
    })))
  )

  const {
    data: burnedInfo,
    isLoading: isBurnedInfoLoading
  } = useSWR(`https://api.nestfi.net/api/dashboard/destory?chainId=${chainsData.chainId === 534353 ? 534353 : 56}`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {
    data: txInfo,
    isLoading: isTxInfoLoading
  } = useSWR(`https://api.nestfi.net/api/dashboard/txVolume?chainId=${chainsData.chainId === 534353 ? 534353 : 56}`, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {data: myTxInfo} = useSWR(address ? `https://api.nestfi.net/api/dashboard/myTx/info?address=${a || address}&chainId=${chainsData.chainId === 534353 ? 534353 : 56}` : undefined, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {data: historyList} = useSWR(address ? `https://api.nestfi.net/api/dashboard/history/list?address=${a || address}&chainId=${chainsData.chainId === 534353 ? 534353 : 56}` : undefined, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value.sort((a: any, b: any) => b.time - a.time)));

  const {data: positionList} = useSWR(address ? `https://api.nestfi.net/api/dashboard/position/list?address=${a || address}&chainId=${chainsData.chainId === 534353 ? 534353 : 56}` : undefined, (url: any) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const {data: isKol} = useSWR(address ? `https://api.nestfi.net/api/invite/is-kol-whitelist/${a || address}` : undefined, (url: any) => fetch(url).then((res) => res.json()));

  const shareMyDealModal = useMemo(() => {
    return (
      <ShareMyDealModal
        value={myTxInfo || {
          totalValue: 0,
          todayValue: 0,
          totalCount: 0,
          totalVolume: 0,
          day7Value: 0,
          day30Value: 0,
        }}
        open={showShareMyDealModal}
        onClose={() => {
          setShareMyDealModal(false);
        }}
      />
    );
  }, [showShareMyDealModal]);

  const shareMyOrderModal = useMemo(() => {
    if (!shareOrder) {
      return <></>;
    }
    return (
      <ShareMyOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
        isClosed={tabsValue === 1}
      />
    );
  }, [showShareOrderModal]);

  const PCOrderRow = (item: any, index: number, isHistory: boolean = false) => {
    return (
      <TableRow
        key={index}
        sx={(theme) => ({
          ":hover": {
            background: theme.normal.bg1,
          },
        })}
      >
        {isHistory && (
          <TableCell>
            <Box
              component={"p"}
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: 16,
                color: theme.normal.text0,
                whiteSpace: "nowrap",
              })}
            >
              {formatDate(item.time * 1000)}
            </Box>
          </TableCell>
        )}
        <TableCell>
          <OrderTablePosition
            tokenName={item.tokenPair.split("/")[0]}
            isLong={item.orientation === "Long"}
            lever={Number(item.leverage.replace("X", ""))}
          />
        </TableCell>
        <TableCell>
          <Stack
            sx={(theme) => ({
              whiteSpace: "nowrap",
              "& p": {
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "16px",
                color:
                  item.actualRate >= 0
                    ? theme.normal.success
                    : theme.normal.danger,
              },
              "& span": {
                fontWeight: 400,
                fontSize: 14,
                color:
                  item.actualRate >= 0
                    ? theme.normal.success
                    : theme.normal.danger,
              },
            })}
          >
            <p>
              {item.actualMargin.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}{" "}
              NEST
            </p>
            <span>
              ({item.actualRate > 0 && "+"}
              {item.actualRate}%)
            </span>
          </Stack>
        </TableCell>
        <TableCell>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: 16,
              color: theme.normal.text0,
              whiteSpace: "nowrap",
            })}
          >
            {item.openPrice.toLocaleString("en-US", {
              maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
              minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
            })}{" "}
            USDT
          </Box>
        </TableCell>
        <TableCell>
          <Stack
            spacing={"4px"}
            sx={(theme) => ({
              whiteSpace: "nowrap",
              "& p": {
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                color: theme.normal.text0,
              },
              "& span": {
                // fontWeight: 400,
                fontSize: "14px",
                marginRight: "4px",
                color: theme.normal.text2,
              },
            })}
          >
            <Box component={"p"}>
              <span>TP</span>
              {item.sp
                ? item.sp.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })
                : "-"}{" "}
              USDT
            </Box>
            <Box component={"p"}>
              <span>SL</span>
              {item.sl
                ? item.sl.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })
                : "-"}{" "}
              USDT
            </Box>
          </Stack>
        </TableCell>
        {isHistory && (
          <TableCell>
            <Stack direction={'row'} alignItems={"center"} gap={'12px'}>
              <Box
                component={"p"}
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.normal.text0,
                  whiteSpace: "nowrap",
                })}
              >
                {item.lastPrice.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })}{" "}
                USDT
              </Box>
              <Box sx={(theme) => ({
                fontWeight: 700,
                fontSize: "10px",
                lineHeight: '14px',
                padding: '3px 4px',
                border: '1px solid',
                borderColor: item.orderType === 'Closed' ? theme.normal.border : item.orderType === 'Liquidated' ? theme.normal.danger_light_hover : theme.normal.success_light_hover,
                color: item.orderType === 'Closed' ? theme.normal.text2 : item.orderType === 'Liquidated' ? theme.normal.danger : theme.normal.success,
                borderRadius: '4px',
              })}>
                {item.orderType === 'Closed' && <Trans>Closed</Trans>}
                {item.orderType === 'Liquidated' && <Trans>Liquidated</Trans>}
                {item.orderType === 'TP Executed' && <Trans>TP Executed</Trans>}
                {item.orderType === 'SL Executed' && <Trans>SL Executed</Trans>}
              </Box>
            </Stack>
          </TableCell>
        )}

        <TableCell>
          <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
            <FuturesOrderShare
              component={"button"}
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setShowShareOrderModal(true);
                setShareOrder({
                  ...item,
                  sp: Number(item.sp.toFixed(item.tokenPair.split("/")[0].getTokenPriceDecimals())),
                  sl: Number(item.sl.toFixed(item.tokenPair.split("/")[0].getTokenPriceDecimals())),
                });
              }}
            >
              <Share/>
            </FuturesOrderShare>
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const MobileOrderCard = (
    item: any,
    index: number,
    isHistory: boolean = false
  ) => {
    return (
      <Card4
        sx={{
          paddingX: "16px",
          paddingY: "12px",
        }}
        key={index}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <MobileOrderTypePosition
            tokenName={item.tokenPair.split("/")[0]}
            isLong={item.orientation === "Long"}
            lever={Number(item.leverage.replace("X", ""))}
          />
          <Box
            component={"button"}
            sx={(theme) => ({
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
              "&:hover": {
                "& svg path": {
                  fill: theme.normal.text0,
                },
              },
              "&:active": {
                "& svg path": {
                  fill: theme.normal.text0,
                },
              },
            })}
            onClick={() => {
              setShowShareOrderModal(true);
              setShareOrder({
                ...item,
                sp: Number(item.sp.toFixed(item.tokenPair.split("/")[0].getTokenPriceDecimals())),
                sl: Number(item.sl.toFixed(item.tokenPair.split("/")[0].getTokenPriceDecimals())),
              });
            }}
          >
            <Share/>
          </Box>
        </Stack>
        <Stack spacing={"8px"} pt={"20px"}>
          <Stack direction={"row"}>
            <Stack width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >{t`Open Price`}</Caption5>
              <Caption2
                sx={(theme) => ({
                  color: theme.normal.text0,
                })}
              >
                {item.openPrice.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })}{" "}
                USDT
              </Caption2>
            </Stack>
            <Stack width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >{t`Actual Margin`}</Caption5>
              <Caption2
                sx={(theme) => ({
                  color: theme.normal.text0,
                  span: {
                    fontWeight: "400",
                    fontSize: "10px",
                    lineHeight: "14px",
                    color:
                      item.actualRate >= 0
                        ? theme.normal.success
                        : theme.normal.danger,
                  },
                })}
              >
                {item.actualMargin.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}{" "}
                NEST{" "}
                <span>
                  {item.actualRate > 0 && "+"}
                  {item.actualRate}%
                </span>
              </Caption2>
            </Stack>
          </Stack>
          <Box py={"8px"}>
            <Box
              sx={(theme) => ({
                width: "100%",
                borderBottom: "1px solid",
                borderColor: theme.normal.border,
              })}
            />
          </Box>
          <Stack direction={"row"}>
            <Stack direction={"row"} width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >
                Take Profit
              </Caption5>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text0,
                })}
              >
                {item.sp.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })}{" "}
                USDT
              </Caption5>
            </Stack>
            <Stack direction={"row"} width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >
                Stop Loss
              </Caption5>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text0,
                })}
              >
                {item.sl.toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })}{" "}
                USDT
              </Caption5>
            </Stack>
          </Stack>
          <Stack direction={"row"}>
            <Stack direction={"row"} width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >{t`Liq Price`}</Caption5>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text0,
                })}
              >
                {(
                  lipPrice(
                    ethers.utils.parseEther(item.initialMargin.toFixed(12)),
                    ethers.utils.parseEther(
                      item?.appendMargin?.toFixed(12) || "0"
                    ),
                    BigNumber.from(item.leverage.replace("X", "")),
                    ethers.utils.parseEther(item.lastPrice.toFixed(12)),
                    ethers.utils.parseEther(item.openPrice.toFixed(12)),
                    item.orientation === "Long"
                  )
                    .div(BigNumber.from(10).pow(12))
                    .toNumber() / 1000000
                ).toLocaleString("en-US", {
                  maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                })}{" "}
                USDT
              </Caption5>
            </Stack>
            {isHistory && (
              <Stack direction={"row"} width={"50%"} spacing={"4px"}>
                <Caption5
                  sx={(theme) => ({
                    color: theme.normal.text2,
                  })}
                >{t`Close Price`}</Caption5>
                <Caption5
                  sx={(theme) => ({
                    color: theme.normal.text0,
                  })}
                >
                  {item.lastPrice.toLocaleString("en-US", {
                    maximumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                    minimumFractionDigits: item.tokenPair.split("/")[0].getTokenPriceDecimals(),
                  })}{" "}
                  USDT
                </Caption5>
              </Stack>
            )}
          </Stack>
          {isHistory && (
            <Stack direction={"row"} width={"50%"} spacing={"4px"}>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text2,
                })}
              >{t`Time`}</Caption5>
              <Caption5
                sx={(theme) => ({
                  color: theme.normal.text0,
                })}
              >
                {formatDate(item.time * 1000)}
              </Caption5>
            </Stack>
          )}
          {isHistory && (
            <Stack direction={'row'}>
              <Box sx={(theme) => ({
                padding: '3px 4px',
                fontSize: '10px',
                fontWeight: 700,
                lineHeight: '14px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: item.orderType === 'Closed' ? theme.normal.border : item.orderType === 'Liquidated' ? theme.normal.danger_light_hover : theme.normal.success_light_hover,
                color: item.orderType === 'Closed' ? theme.normal.text2 : item.orderType === 'Liquidated' ? theme.normal.danger : theme.normal.success,
              })}>
                {item.orderType === 'Closed' && <Trans>Closed</Trans>}
                {item.orderType === 'Liquidated' && <Trans>Liquidated</Trans>}
                {item.orderType === 'TP Executed' && <Trans>TP Executed</Trans>}
                {item.orderType === 'SL Executed' && <Trans>SL Executed</Trans>}
              </Box>
            </Stack>
          )}
        </Stack>
      </Card4>
    );
  };

  const getNESTTabs = useMemo(() => {
    return (
      <NESTTabs
        value={tabsValue}
        className={""}
        datArray={[
          <Stack direction={"row"} spacing={"4px"} alignItems={"center"} whiteSpace={"nowrap"}>
            <FuturesOrder/>
            <p style={{fontWeight: 700, fontSize: "16px", lineHeight: "22px"}}>
              <Trans>Current Positions</Trans>
            </p>
          </Stack>,
          <Stack direction={"row"} spacing={"4px"} alignItems={"center"} whiteSpace={"nowrap"}>
            <DashboardIcon2/>
            <p
              style={{fontWeight: 700, fontSize: "16px", lineHeight: "22px"}}
            >
              <Trans>History</Trans>
            </p>
          </Stack>,
        ]}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={false}
      />
    );
  }, [tabsValue, isBigMobile]);

  return (
    <Stack alignItems={"center"} width={"100%"}>
      {shareMyDealModal}
      {shareMyOrderModal}
      {
        isKol && isKol?.value && chainsData.chainId === 56 && (
          <Stack direction={'row'} width={'100%'} justifyContent={"center"} spacing={'32px'} sx={(theme) => ({
            color: theme.normal.text0,
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '22px',
            background: theme.normal.bg1,
            borderBottom: `1px solid ${theme.normal.border}`,
            borderTop: `1px solid ${theme.normal.border}`,
          })}>
            <Box sx={(theme) => ({
              paddingY: '11px',
              borderBottom: `2px solid ${theme.normal.primary}`,
              a: {
                color: theme.normal.primary,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })}>
              <a href={'/#/dashboard'}>
                <Trans>
                  Dashboard
                </Trans>
              </a>
            </Box>
            <Box sx={(theme) => ({
              paddingY: '11px',
              a: {
                color: theme.normal.text0,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.normal.primary,
                }
              }
            })}>
              <a href={'/#/dashboard/referral'}>
                <Trans>
                  Referral
                </Trans>
              </a>
            </Box>
          </Stack>
        )
      }
      <Stack
        maxWidth={"1600px"}
        px={["0", "0", "20px"]}
        width={"100%"}
        spacing={["20px", "20px", "40px"]}
        py={["20px", "20px", "40px"]}
      >
        <Stack>
          <Stack
            direction={["column", "column", "row"]}
            gap={["0px", "0px", "24px"]}
          >
            <Stack
              sx={(theme) => ({
                width: "100%",
                border: "1px solid",
                borderRadius: "12px",
                borderColor: theme.normal.border,
                [theme.breakpoints.down("sm")]: {
                  border: "0px",
                },
              })}
            >
              <TVChart
                title1={t`NEST Total Burned`}
                title2={t`Today Burned`}
                value1={`${
                  isBurnedInfoLoading
                    ? "-"
                    : burnedInfo.totalDestroy.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                }`}
                value2={`${
                  isBurnedInfoLoading
                    ? "-"
                    : burnedInfo.dayDestroy.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                }`}
                data={burnedData || []}
              />
            </Stack>
            <Stack
              sx={(theme) => ({
                width: "100%",
                border: "1px solid",
                borderRadius: "12px",
                borderColor: theme.normal.border,
                [theme.breakpoints.down("sm")]: {
                  border: "0px",
                },
              })}
            >
              <TVChart
                title1={t`Total Trading Volume`}
                title2={t`Today Volume`}
                value1={`${
                  isTxInfoLoading
                    ? "-"
                    : txInfo?.totalVolume.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                }`}
                value2={`${
                  isTxInfoLoading
                    ? "-"
                    : txInfo?.dayVolume.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                }`}
                data={txData || []}
              />
            </Stack>
          </Stack>
          {isBigMobile && <NESTLine/>}
        </Stack>
        {isBigMobile ? (
          <Stack px={"20px"} spacing={"16px"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                <NetworkIcon chainId={chainsData.chainId}/>
                <Title1>{t`My Positions`}</Title1>
              </Stack>
              <Stack>
                <MainButton
                  style={{
                    padding: "0px 12px",
                    height: "36px",
                    fontSize: "12px",
                    fontWeight: 700,
                    lineHeight: "16px",
                  }}
                  title={t`Copy Invitation Link`}
                  disable={!address}
                  onClick={() => {
                    if (!address) return;
                    const link =
                      "https://nestfi.org/?a=" +
                      address.slice(-8).toLowerCase();
                    copy(link);
                    messageSnackBar(t`Copy Successfully`);
                  }}
                />
              </Stack>
            </Stack>
            <Card4 sx={{position: "relative"}}>
              {!address && (
                <Stack
                  position={"absolute"}
                  width={"100%"}
                  height={"100%"}
                  sx={(theme) => ({
                    backdropFilter: "blur(6px)",
                    background: "rgba(0, 0, 0, 0.7)",
                  })}
                >
                  <Stack
                    width={"100%"}
                    height={"100%"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Stack width={"170px"}>
                      <MainButton
                        title={t`Connect Wallet`}
                        onClick={() => {
                          setShowConnect(true);
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              )}
              <Stack padding={"20px 12px"}>
                {
                  chainsData.chainId === 56 || chainsData.chainId === 97 && (
                    <>
                      <Stack spacing={"4px"}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Caption2
                            sx={(theme) => ({
                              color: theme.normal.text1,
                            })}
                          >{t`Total Profit & Loss`}</Caption2>
                          <Box
                            component={"button"}
                            sx={(theme) => ({
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
                              "&:hover": {
                                "& svg path": {
                                  fill: theme.normal.text0,
                                },
                              },
                              "&:active": {
                                "& svg path": {
                                  fill: theme.normal.text0,
                                },
                              },
                            })}
                            onClick={() => {
                              setShareMyDealModal(true);
                            }}
                          >
                            <Share/>
                          </Box>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={"4px"}
                          alignItems={"center"}
                        >
                          <Title4>
                            {myTxInfo?.totalValue.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}{" "}
                            NEST
                          </Title4>
                          {/*<Title5 sx={(theme) => ({*/}
                          {/*  color: theme.normal.success*/}
                          {/*})}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate.toLocaleString('en-US', {*/}
                          {/*  maximumFractionDigits: 2,*/}
                          {/*})}%</Title5>*/}
                        </Stack>
                      </Stack>
                      <Box py={"20px"}>
                        <NESTLine/>
                      </Box>
                    </>
                  )
                }
                {
                  chainsData.chainId === 534353 && (
                    <>
                      <Stack spacing={"4px"}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Caption2
                            sx={(theme) => ({
                              color: theme.normal.text1,
                            })}
                          >{t`My Total Trading Volume`}</Caption2>
                          <Box
                            component={"button"}
                            sx={(theme) => ({
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
                              "&:hover": {
                                "& svg path": {
                                  fill: theme.normal.text0,
                                },
                              },
                              "&:active": {
                                "& svg path": {
                                  fill: theme.normal.text0,
                                },
                              },
                            })}
                            onClick={() => {
                              setShareMyDealModal(true);
                            }}
                          >
                            <Share/>
                          </Box>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={"4px"}
                          alignItems={"center"}
                        >
                          <Title4>
                            {myTxInfo?.totalVolume?.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}{" "}
                            NEST
                          </Title4>
                          {/*<Title5 sx={(theme) => ({*/}
                          {/*  color: theme.normal.success*/}
                          {/*})}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate.toLocaleString('en-US', {*/}
                          {/*  maximumFractionDigits: 2,*/}
                          {/*})}%</Title5>*/}
                        </Stack>
                      </Stack>
                      <Box py={"20px"}>
                        <NESTLine/>
                      </Box>
                      <Stack spacing={"4px"}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Caption2
                            sx={(theme) => ({
                              color: theme.normal.text1,
                            })}
                          >{t`Total Number of Trades`}</Caption2>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={"4px"}
                          alignItems={"center"}
                        >
                          <Title4>
                            {myTxInfo?.totalCount?.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}{" "}
                          </Title4>
                          {/*<Title5 sx={(theme) => ({*/}
                          {/*  color: theme.normal.success*/}
                          {/*})}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate.toLocaleString('en-US', {*/}
                          {/*  maximumFractionDigits: 2,*/}
                          {/*})}%</Title5>*/}
                        </Stack>
                      </Stack>
                      <Box py={"20px"}>
                        <NESTLine/>
                      </Box>
                    </>
                  )
                }
                <Stack spacing={"22px"}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Caption3>{t`Today's PNL`}</Caption3>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={"4px"}
                    >
                      <Caption4>
                        {myTxInfo?.todayValue.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        NEST
                      </Caption4>
                      {/*<Caption5 sx={(theme) => ({*/}
                      {/*  color: theme.normal.success*/}
                      {/*})}>{myTxInfo.todayRate > 0 && '+'}{myTxInfo.todayRate.toLocaleString('en-US', {*/}
                      {/*  maximumFractionDigits: 2,*/}
                      {/*})}%</Caption5>*/}
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Caption3>{t`7 Days' PNL`}</Caption3>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={"4px"}
                    >
                      <Caption4>
                        {myTxInfo?.day7Value.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        NEST
                      </Caption4>
                      {/*<Caption5 sx={(theme) => ({*/}
                      {/*  color: theme.normal.success*/}
                      {/*})}>{myTxInfo.day7Rate > 0 && '+'}{myTxInfo.day7Rate.toLocaleString('en-US', {*/}
                      {/*  maximumFractionDigits: 2,*/}
                      {/*})}%</Caption5>*/}
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Caption3>{t`30 Days' PNL`}</Caption3>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={"4px"}
                    >
                      <Caption4>
                        {myTxInfo?.day30Value.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        NEST
                      </Caption4>
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
          <Card2 sx={{position: "relative"}}>
            {!address && (
              <Stack
                position={"absolute"}
                width={"100%"}
                p={"20px"}
                height={"100%"}
                sx={(theme) => ({
                  backdropFilter: "blur(6px)",
                  background: "rgba(0, 0, 0, 0.7)",
                })}
              >
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                  <NetworkIcon chainId={chainsData.chainId}/>
                  <Title1>{t`My Positions`}</Title1>
                </Stack>
                <Stack
                  width={"100%"}
                  height={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Stack width={"170px"}>
                    <MainButton
                      title={t`Connect Wallet`}
                      onClick={() => {
                        setShowConnect(true);
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            )}
            <Stack padding={"20px"} width={"100%"} height={"100%"}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                  <NetworkIcon chainId={chainsData.chainId}/>
                  <Title1>{t`My Positions`}</Title1>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={"10px"}>
                  <MainButton
                    style={{
                      height: "40px",
                      padding: "10px 16px",
                      fontSize: "14px",
                      fontWeight: "700",
                      lineHeight: "20px",
                    }}
                    title={t`Copy Invitation Link`}
                    onClick={() => {
                      if (!address) return;
                      const link =
                        "https://nestfi.org/?a=" +
                        address.slice(-8).toLowerCase();
                      copy(link);
                      messageSnackBar(t`Copy Successfully`);
                    }}
                  />
                  <DashboardShare
                    component={"button"}
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShareMyDealModal(true);
                    }}
                  >
                    <Share/>
                  </DashboardShare>
                </Stack>
              </Stack>
              <Stack direction={'row'} justifyContent={"space-around"}>
                {
                  (chainsData.chainId === 56 || chainsData.chainId === 97) && (
                    <Stack
                      alignItems={"center"}
                      pt={"26px"}
                      pb={"40px"}
                      spacing={"12px"}
                    >
                      <Title2
                        sx={(theme) => ({
                          span: {
                            fontSize: "28px",
                            fontWeight: "700",
                            lineHeight: "40px",
                          },
                          ".color-full": {
                            // color: myTxInfo.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                          },
                        })}
                      >
                        {myTxInfo?.totalValue.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        <span>NEST</span>
                        {/*<span*/}
                        {/*className={'color-full'}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate}%</span>*/}
                      </Title2>
                      <Caption1>{t`Total Profit & Loss`}</Caption1>
                    </Stack>
                  )
                }
                {
                  (chainsData.chainId === 534353) && (
                    <>
                      <Stack
                        alignItems={"center"}
                        pt={"26px"}
                        pb={"40px"}
                        spacing={"12px"}
                      >
                        <Title2
                          sx={(theme) => ({
                            span: {
                              fontSize: "28px",
                              fontWeight: "700",
                              lineHeight: "40px",
                            },
                            ".color-full": {
                              // color: myTxInfo.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                            },
                          })}
                        >
                          {myTxInfo?.totalVolume?.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}{" "}
                          <span>NEST</span>
                          {/*<span*/}
                          {/*className={'color-full'}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate}%</span>*/}
                        </Title2>
                        <Caption1>{t`My Total Trading Volume`}</Caption1>
                      </Stack>
                      <Stack
                        alignItems={"center"}
                        pt={"26px"}
                        pb={"40px"}
                        spacing={"12px"}
                      >
                        <Title2
                          sx={(theme) => ({
                            span: {
                              fontSize: "28px",
                              fontWeight: "700",
                              lineHeight: "40px",
                            },
                            ".color-full": {
                              // color: myTxInfo.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                            },
                          })}
                        >
                          {myTxInfo?.totalCount?.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          {/*<span*/}
                          {/*className={'color-full'}>{myTxInfo.totalRate > 0 && '+'}{myTxInfo.totalRate}%</span>*/}
                        </Title2>
                        <Caption1>{t`Total Number of Trades`}</Caption1>
                      </Stack>
                    </>
                  )
                }
              </Stack>
              <Stack direction={"row"} spacing={"16px"}>
                <Card3>
                  <Title3
                    sx={(theme) => ({
                      span: {
                        fontSize: "24px",
                        fontWeight: "700",
                        lineHeight: "32px",
                      },
                      ".color-full": {
                        // color: myTxInfo.todayRate >= 0 ? theme.normal.success : theme.normal.danger,
                      },
                    })}
                  >
                    {myTxInfo?.todayValue.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{" "}
                    <span>NEST</span>
                    {/*<span*/}
                    {/*className={'color-full'}>{myTxInfo.todayRate > 0 && '+'}{myTxInfo.todayRate}%</span>*/}
                  </Title3>
                  <Caption2
                    sx={{paddingTop: "12px"}}
                  >{t`Today's PNL`}</Caption2>
                </Card3>
                <Card3>
                  <Title3
                    sx={(theme) => ({
                      span: {
                        fontSize: "24px",
                        fontWeight: "700",
                        lineHeight: "32px",
                      },
                      ".color-full": {
                        // color: myTxInfo.day7Rate >= 0 ? theme.normal.success : theme.normal.danger,
                      },
                    })}
                  >
                    {myTxInfo?.day7Value.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{" "}
                    <span>NEST</span>
                    {/*<span*/}
                    {/*className={'color-full'}>{myTxInfo.day7Rate > 0 && '+'}{myTxInfo.day7Rate}%</span>*/}
                  </Title3>
                  <Caption2
                    sx={{paddingTop: "12px"}}
                  >{t`7 Days' PNL`}</Caption2>
                </Card3>
                <Card3>
                  <Title3
                    sx={(theme) => ({
                      span: {
                        fontSize: "24px",
                        fontWeight: "700",
                        lineHeight: "32px",
                      },
                      ".color-full": {
                        // color: myTxInfo.day30Rate >= 0 ? theme.normal.success : theme.normal.danger,
                      },
                    })}
                  >
                    {myTxInfo?.day30Value.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{" "}
                    <span>NEST</span>
                    {/*<span*/}
                    {/*className={'color-full'}>{myTxInfo.day30Rate > 0 && '+'}{myTxInfo.day30Rate}%</span>*/}
                  </Title3>
                  <Caption2
                    sx={{paddingTop: "12px"}}
                  >{t`30 Days' PNL`}</Caption2>
                </Card3>
              </Stack>
            </Stack>
          </Card2>
        )}
        <Stack spacing={"16px"}>
          <Stack direction={'row'} alignItems={"center"} spacing={'16px'}
                 sx={(theme) => ({
                   width: "100%",
                   borderBottom: "1px solid",
                   borderColor: theme.normal.border,
                   paddingX: "20px",
                 })}>
            <NetworkIcon chainId={chainsData.chainId}/>
            <Stack style={{alignItems: "start"}}>
              {getNESTTabs}
            </Stack>
          </Stack>

          {isBigMobile ? (
            <Stack px={"20px"} spacing={"12px"}>
              {tabsValue === 0 && positionList &&
                (positionList?.length > 0 ? (
                  positionList.map((item: any, index: number) =>
                    MobileOrderCard(item, index)
                  )
                ) : (
                  <Stack
                    sx={(theme) => ({
                      padding: "20px 0",
                      background: theme.normal.bg1,
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      borderRadius: "12px",
                      color: theme.normal.text2,
                    })}
                  >
                    {t`No trades yet`}
                  </Stack>
                ))}
              {tabsValue === 1 && historyList &&
                (historyList.length > 0 ? (
                  historyList.map((item: any, index: number) =>
                    MobileOrderCard(item, index, true)
                  )
                ) : (
                  <Stack
                    sx={(theme) => ({
                      padding: "20px 0",
                      background: theme.normal.bg1,
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      borderRadius: "12px",
                      color: theme.normal.text2,
                    })}
                  >
                    {t`No trades yet`}
                  </Stack>
                ))}
            </Stack>
          ) : (
            <FuturesTableTitle
              dataArray={
                tabsValue === 0
                  ? [
                    t`Position`,
                    t`Actual Margin`,
                    t`Open Price`,
                    t`Liq Price`,
                    t`Stop Order`,
                    t`Operate`,
                  ]
                  : [
                    t`Time`,
                    t`Position`,
                    t`Actual Margin`,
                    t`Open Price`,
                    t`Stop Order`,
                    t`Close Price`,
                    t`Operate`,
                  ]
              }
              noOrder={
                (tabsValue === 0 && positionList?.length === 0) ||
                (tabsValue === 1 && historyList?.length === 0)
              }
            >
              {tabsValue === 0 && positionList &&
                positionList?.map((item: any, index: number) =>
                  PCOrderRow(item, index, false)
                )}
              {tabsValue === 1 && historyList &&
                historyList.map((item: any, index: number) => PCOrderRow(item, index, true))}
            </FuturesTableTitle>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
