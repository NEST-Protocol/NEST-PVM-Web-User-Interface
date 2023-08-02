import {Box, Drawer, Modal, Stack} from "@mui/material";
import {FC, useMemo, useRef, useState} from "react";
import domtoimage from "../../../lib/dom-to-image";
import useWindowWidth from "../../../hooks/useWindowWidth";
import MainButton from "../../../components/MainButton/MainButton";
import {Close, NESTFiLogo, NESTLogo, Success, UpIcon} from "../../../components/icons";
import {styled} from "@mui/material/styles";
import BaseModal from "../Components/DashboardBaseModal";
import {QRCodeCanvas} from "qrcode.react";
import BaseDrawer from "../Components/DashboardBaseDrawer";
import {Trans, t} from "@lingui/macro";
import VolumeChart from "../../Personal/ReChart/VolumeChart";
import CumulativeReturnChart from "../../Personal/ReChart/CumulativeReturnChart";
import TotalAssetValueChart from "../../Personal/ReChart/TotalAssetValueChart";
import DailyReturnChart from "../../Personal/ReChart/DailyReturnChart";

const Title1 = styled('div')(({theme}) => ({
  fontWeight: "400",
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.normal.text1,
}))

const Caption1 = styled('div')(({theme}) => ({
  fontWeight: "700",
  fontSize: '16px',
  lineHeight: '22px',
  color: theme.normal.text0,
}))

const Card1 = styled(Stack)(({theme}) => ({
  borderRadius: '12px',
  border: '1px solid',
  borderColor: theme.normal.border,
  padding: '16px 12px',
  width: '100%',
  alignItems: 'center',
  userSelect: 'none',
  cursor: 'pointer'
}))

const TopStack = styled(Stack)(({theme}) => {
  return {
    width: '100%',
    "& button": {
      width: 20,
      height: 20,
      "&:hover": {
        cursor: "pointer",
      },
      "& svg": {
        width: 20,
        height: 20,
        "& path": {
          fill: theme.normal.text2,
        },
      },
    },
  };
});

interface ShareMyDealModalProps {
  value: {
    address: string | undefined;
    totalProfitLoss: number;
    totalRate: number,
    todayPNL: number;
    todayRate: number;
    _7daysPNL: number;
    _7daysRate: number;
    _30daysPNL: number;
    _30daysRate: number;
    from: string | undefined
    to: string | undefined;
  };
  open: boolean;
  onClose: () => void;
}

const ShareMyDealModal: FC<ShareMyDealModalProps> = ({...props}) => {
  const [showPage, setShowPage] = useState(false)
  const {isBigMobile} = useWindowWidth()
  const myShareRef = useRef(null)

  const download = async (address: string) => {
    const node = myShareRef.current;
    try {
      if (node) {
        domtoimage.toPng(node, {
          bgcolor: '#1D1E22',
          // @ts-ignore
          width: node.scrollWidth,
          // @ts-ignore
          height: node.scrollHeight,
          quality: 1,
          scale: 2,
        })
          .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = `${address}.png`;
            if (typeof dataUrl === "string") {
              link.href = dataUrl;
              link.click();
            }
          })
      }
    } catch (e) {
      console.log('buildDataUrl: error', e)
      // @ts-ignore
      node.style.width = '100%'
    }
  }

  const tweet = (address: string) => {
    const link = `https://nestfi.org/?a=${address?.slice(-8).toLowerCase()}`
    const text = `${t`Follow the right person, making money is as easy as breathing.
You can follow the right person on NESTFi, here is my refer link`}: ${link}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text)}&hashtags=NEST,btc,eth&via=NEST_Protocol`)
  }
  const [select, setSelect] = useState({
    totalProfitLoss: true,
    todayPNL: true,
    _7daysPNL: true,
    _30daysPNL: true,
    volume: true,
    cumlulativeReturn: true,
    totalAssetValue: true,
    dailyReturn: true,
  })
  const showList = useMemo(() => {
    let list = []
    if (select.totalProfitLoss) {
      list.push({
        title: t`Total Profit & Loss`,
        value: props.value.totalProfitLoss,
        rate: props.value.totalRate,
        unit: "NEST"
      })
    }
    if (select.todayPNL) {
      list.push({
        title: t`Today's PNL`,
        value: props.value.todayPNL,
        rate: props.value.todayRate,
        unit: "NEST"
      })
    }
    if (select._7daysPNL) {
      list.push({
        title: t`7 Days' PNL`,
        value: props.value._7daysPNL,
        rate: props.value._7daysRate,
        unit: ""
      })
    }
    if (select._30daysPNL) {
      list.push({
        title: t`30 Days' PNL`,
        value: props.value._30daysPNL,
        rate: props.value._30daysRate,
        unit: "NEST"
      })
    }
    return list
  }, [select, props.value])

  const getSelectContent = () => {
    return (
      <Stack width={'100%'} spacing={'12px'} p={'24px 20px'}>
        <TopStack>
          <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
            {
              !isBigMobile && (
                <button/>
              )
            }
            <Box sx={(theme) => ({
              fontWeight: '700',
              fontSize: '16px',
              lineHeight: '22px',
              color: theme.normal.text0,
              textAlign: 'center',
            })}><Trans>Share</Trans></Box>
            <button onClick={() => {
              props.onClose()
            }}>
              <Close/>
            </button>
          </Stack>
        </TopStack>
        <Box height={'8px'}/>
        <Stack width={'100%'} spacing={'12px'} maxHeight={'50vh'} overflow={'auto'}>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.totalProfitLoss ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, totalProfitLoss: !select.totalProfitLoss})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Total Profit & Loss`}
              </Title1>
              <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                <Caption1>{props.value.totalProfitLoss.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })} NEST</Caption1>
                <Box
                  sx={(theme) => ({
                    transform: props.value.totalRate >= 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                    "& svg": {
                      display: "block",
                      "& path": {
                        fill: props.value.totalRate >= 0 ? theme.normal.success : theme.normal.danger,
                      }
                    }
                  })}
                >
                  <UpIcon/>
                </Box>
              </Stack>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.totalProfitLoss ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.todayPNL ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, todayPNL: !select.todayPNL})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Today's PNL`}
              </Title1>
              <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                <Caption1>{props.value.todayPNL.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })} NEST</Caption1>
                <Box
                  sx={(theme) => ({
                    transform: props.value.todayRate >= 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                    "& svg": {
                      display: "block",
                      "& path": {
                        fill: props.value.todayRate >= 0 ? theme.normal.success : theme.normal.danger,
                      }
                    }
                  })}
                >
                  <UpIcon/>
                </Box>
              </Stack>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.todayPNL ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select._7daysPNL ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, _7daysPNL: !select._7daysPNL})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`7 Days' PNL`}
              </Title1>
              <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                <Caption1>{props.value._7daysPNL.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}</Caption1>
                <Box
                  sx={(theme) => ({
                    transform: props.value._7daysRate >= 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                    "& svg": {
                      display: "block",
                      "& path": {
                        fill: props.value._7daysRate >= 0 ? theme.normal.success : theme.normal.danger,
                      }
                    }
                  })}
                >
                  <UpIcon/>
                </Box>
              </Stack>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select._7daysPNL ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select._30daysPNL ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, _30daysPNL: !select._30daysPNL})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`30 Days' PNL`}
              </Title1>
              <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                <Caption1>{props.value._30daysPNL.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })} NEST</Caption1>
                <Box
                  sx={(theme) => ({
                    transform: props.value._30daysRate >= 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                    "& svg": {
                      display: "block",
                      "& path": {
                        fill: props.value._30daysRate >= 0 ? theme.normal.success : theme.normal.danger,
                      }
                    }
                  })}
                >
                  <UpIcon/>
                </Box>
              </Stack>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select._30daysPNL ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.volume ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, volume: !select.volume})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Volume`}
              </Title1>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.volume ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.cumlulativeReturn ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, cumlulativeReturn: !select.cumlulativeReturn})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Cumulative Return`}
              </Title1>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.cumlulativeReturn ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.totalAssetValue ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, totalAssetValue: !select.totalAssetValue})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Total Asset Value`}
              </Title1>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.totalAssetValue ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
          <Card1 direction={'row'} sx={(theme) => ({
            background: select.dailyReturn ? theme.normal.bg3 : "transparent",
          })} onClick={() => setSelect({...select, dailyReturn: !select.dailyReturn})}>
            <Stack width={'100%'} spacing={'10px'}>
              <Title1>
                {t`Daily Return`}
              </Title1>
            </Stack>
            <Box sx={(theme) => ({
              "& svg": {
                display: "block",
                width: '22px',
                height: '22px',
                "& path": {
                  fill: select.dailyReturn ? theme.normal.primary : theme.normal.text3,
                },
              },
            })}>
              <Success/>
            </Box>
          </Card1>
        </Stack>
        <Stack style={{paddingTop: '24px'}}>
          <MainButton title={t`Confirm`}
                      style={{fontWeight: '700', fontSize: '14px'}} onClick={() => {
            setShowPage(true)
          }}/>
        </Stack>
      </Stack>
    )
  }

  const getSharePage = () => {
    return (
      <Stack width={'100%'} bgcolor={'rgba(29, 30, 34, 1)'} position={'relative'} overflow={'auto'} borderRadius={'12px'}>
        <Stack position={'absolute'} right={'24px'} top={'24px'}
               sx={() => ({
                 "& button": {
                   width: 20,
                   height: 20,
                   "&:hover": {
                     cursor: "pointer",
                   },
                   "& svg": {
                     width: 20,
                     height: 20,
                     "& path": {
                       fill: "rgba(249, 249, 249, 0.6)",
                     },
                   },
                 },
               })}>
          <button onClick={() => {
            setShowPage(false)
            props.onClose()
          }}>
            <Close/>
          </button>
        </Stack>
        <Stack maxHeight={['70vh', '70vh', '70vh', '80vh']} overflow={'scroll'}>
          <Stack ref={myShareRef} width={'100%'}>
            <Stack pt={'50px'} px={'24px'} bgcolor={'#0B0C0D'}
                   style={{
                     backgroundImage: `url('/images/share_deal.png')`,
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'top',
                     backgroundSize: 'contain',
                   }}
            >
              <Box sx={{
                "& svg": {
                  height: '48px',
                  display: "block",
                  "& path": {
                    fill: "#fff"
                  }
                }
              }}>
                <NESTFiLogo/>
              </Box>
              {
                !!showList?.[0] && (
                  <Stack pt={'44px'}>
                    <Box sx={{
                      fontWeight: "700",
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: "rgba(249, 249, 249, 0.6)",
                    }}>{showList?.[0].title}</Box>
                    <Box sx={{
                      paddingTop: '8px',
                      fontWeight: "700",
                      fontSize: '32px',
                      lineHeight: '44px',
                      color: "#F9F9F9",
                      'span': {
                        fontSize: '28px',
                        lineHeight: '40px'
                      },
                    }}>
                      {showList?.[0].value.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })} <span>{showList?.[0].unit}</span></Box>
                    <Box sx={(theme) => ({
                      fontSize: '64px',
                      fontWeight: '700',
                      color: showList?.[0]?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                    })}>
                      {showList?.[0]?.rate > 0 ? '+' : ''}{Number(showList[0]?.rate ?? 0).toLocaleString('en-US', {
                      maximumFractionDigits: 2
                    })}%
                    </Box>
                  </Stack>
                )
              }
              <Stack spacing={'24px'} pt={'64px'}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  {
                    !!showList?.[1] && (
                      <Stack spacing={'8px'} width={'50%'}>
                        <Box sx={{
                          fontWeight: "400",
                          fontSize: '13px',
                          lineHeight: '17.333px',
                          color: "rgba(249, 249, 249, 0.6)",
                        }}>{showList?.[1].title}</Box>
                        <Box sx={(theme) => ({
                          fontWeight: "700",
                          fontSize: '15.6px',
                          lineHeight: '20px',
                          color: "#F9F9F9",
                          span: {
                            color: showList?.[1].rate >= 0 ? theme.normal.success : theme.normal.danger,
                          }
                        })}>{showList?.[1].value.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })} {showList?.[1].unit} <span>{showList?.[1].rate}%</span>
                        </Box>
                      </Stack>
                    )
                  }
                  {
                    !!showList?.[2] && (
                      <Stack spacing={'8px'} width={'50%'}>
                        <Box sx={{
                          fontWeight: "400",
                          fontSize: '13px',
                          lineHeight: '17.333px',
                          color: "rgba(249, 249, 249, 0.6)",
                        }}>{showList?.[2].title}</Box>
                        <Box sx={(theme) => ({
                          fontWeight: "700",
                          fontSize: '15.6px',
                          lineHeight: '20px',
                          color: "#F9F9F9",
                          span: {
                            color: showList?.[2].rate >= 0 ? theme.normal.success : theme.normal.danger,
                          }
                        })}>{showList?.[2].value.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })} {showList?.[2].unit} <span>{showList?.[2].rate}%</span>
                        </Box>
                      </Stack>
                    )
                  }
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  {
                    !!showList?.[3] && (
                      <Stack spacing={'8px'} width={'50%'}>
                        <Box sx={{
                          fontWeight: "400",
                          fontSize: '13px',
                          lineHeight: '17.333px',
                          color: "rgba(249, 249, 249, 0.6)",
                        }}>{showList?.[3].title}</Box>
                        <Box sx={(theme) => ({
                          fontWeight: "700",
                          fontSize: '15.6px',
                          lineHeight: '20px',
                          color: "#F9F9F9",
                          span: {
                            color: showList?.[3]?.rate >= 0 ? theme.normal.success : theme.normal.danger,
                          }
                        })}>{showList?.[3]?.value.toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })} {showList?.[3]?.unit} <span>{showList?.[3]?.rate}%</span>
                        </Box>
                      </Stack>
                    )
                  }
                </Stack>
              </Stack>
              <Stack spacing={'24px'} pt={'40px'}>
                {
                  select.volume && (
                    <Stack width={'100%'} height={'240px'} sx={() => ({
                      backgroundColor: "#171A1F",
                      borderRadius: '12px',
                      flexShrink: 0,
                    })} px={'12px'} py={'20px'}>
                      <Stack sx={() => ({
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: '400',
                        color: "rgba(249, 249, 249, 0.6)",
                      })}>
                        <Trans>Volume</Trans>
                      </Stack>
                      <Stack width={'100%'} height={'100%'} position={'relative'}>
                        <VolumeChart simple address={props.value.address} from={props.value.from} to={props.value.to}/>
                      </Stack>
                    </Stack>
                  )
                }
                {
                  select.totalAssetValue && (
                    <Stack width={'100%'} height={'240px'} sx={() => ({
                      backgroundColor: "#171A1F",
                      borderRadius: '12px',
                      flexShrink: 0,
                    })} px={'12px'} py={'20px'}>
                      <Stack sx={() => ({
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: '400',
                        color: "rgba(249, 249, 249, 0.6)",
                      })}>
                        <Trans>
                          Total Asset Value
                        </Trans>
                      </Stack>
                      <Stack width={'100%'} height={'100%'} position={'relative'}>
                        <TotalAssetValueChart simple address={props.value.address} from={props.value.from}
                                              to={props.value.to}/>
                      </Stack>
                    </Stack>
                  )
                }
                {
                  select.dailyReturn && (
                    <Stack width={'100%'} height={'240px'} sx={() => ({
                      backgroundColor: "#171A1F",
                      borderRadius: '12px',
                      flexShrink: 0,
                    })} px={'12px'} py={'20px'}>
                      <Stack sx={() => ({
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: '400',
                        color: "rgba(249, 249, 249, 0.6)",
                      })}>
                        <Trans>Daily Return</Trans>
                      </Stack>
                      <Stack width={'100%'} height={'100%'} position={'relative'}>
                        <DailyReturnChart simple address={props.value.address} from={props.value.from}
                                          to={props.value.to}/>
                      </Stack>
                    </Stack>
                  )
                }
                {
                  select.cumlulativeReturn && (
                    <Stack width={'100%'} height={'240px'} sx={() => ({
                      backgroundColor: "#171A1F",
                      borderRadius: '12px',
                      flexShrink: 0,
                    })} px={'12px'} py={'20px'}>
                      <Stack sx={() => ({
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: '400',
                        color: "rgba(249, 249, 249, 0.6)",
                      })}>
                        <Trans>
                          Cumulative Return
                        </Trans>
                      </Stack>
                      <Stack width={'100%'} height={'100%'} position={'relative'}>
                        <CumulativeReturnChart simple address={props.value.address} from={props.value.from}
                                               to={props.value.to}/>
                      </Stack>
                    </Stack>
                  )
                }
              </Stack>
              <Stack height={'40px'}/>
            </Stack>
            <Stack px={'20px'} direction={'row'} width={'100%'} paddingRight={'36px'}
                   justifyContent={'space-between'}
                   bgcolor={'rgba(29, 30, 34, 1)'}
                   alignItems={"center"} py={'18px'}>
              <Stack direction={'row'} spacing={'12px'}>
                <NESTLogo/>
                <Stack spacing={'4px'}>
                  <Box sx={{
                    fontWeight: "400",
                    fontSize: '16px',
                    lineHeight: '22px',
                    color: "#F9F9F9",
                  }}>{t`Trade with me on NESTFi`}</Box>
                  <Box sx={{
                    fontWeight: "700",
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: "rgba(249, 249, 249, 0.6)",
                  }}>{new Date().toLocaleString()}</Box>
                </Stack>
              </Stack>
              <Box style={{width: '64px', height: '64px', background: 'white', padding: '3px'}}>
                <QRCodeCanvas
                  value={`https://nestfi.org/?a=${props?.value?.address?.slice(-8).toLowerCase()}`}
                  size={58}/>
              </Box>
            </Stack>
          </Stack>
          <Stack height={'80px'} flexShrink={0}></Stack>
        </Stack>
        <Stack p={'20px'} position={'absolute'} width={'100%'} bottom={0}>
          <Stack direction={'row'} width={'100%'} spacing={'12px'} pt={'24px'}>
            <MainButton
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '700',
                lineHeight: '22px',
              }}
              title={t`Image`}
              onClick={() => download(props?.value?.address ?? 'share')}
            />
            <MainButton style={{
              height: '48px',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '22px',
            }} title={t`Twitter`} onClick={() => tweet(props?.value?.address ?? 'share')}/>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  if (isBigMobile && !showPage) {
    return (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => {
          props.onClose()
        }}
        sx={{
          "& .MuiPaper-root": {background: "none", backgroundImage: "none"},
        }}
      >
        <Box>
          <BaseDrawer>
            {getSelectContent()}
          </BaseDrawer>
        </Box>
      </Drawer>
    )
  }

  return (
    <Modal
      open={props.open}
      onClose={() => {
        props.onClose()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseModal>
          {
            showPage ? (
              getSharePage()
            ) : (
              getSelectContent()
            )}
        </BaseModal>
      </Box>
    </Modal>
  )
}

export default ShareMyDealModal