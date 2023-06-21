import {Box, Drawer, Modal, Stack} from "@mui/material";
import {FC, useEffect, useMemo, useRef, useState} from "react";
import domtoimage from "../../../lib/dom-to-image";
import {useAccount} from "wagmi";
import useWindowWidth from "../../../hooks/useWindowWidth";
import MainButton from "../../../components/MainButton/MainButton";
import {Close, NESTFiLogo, NESTLogo, Success, UpIcon} from "../../../components/icons";
import {styled} from "@mui/material/styles";
import BaseModal from "../Components/DashboardBaseModal";
import {QRCodeCanvas} from "qrcode.react";
import BaseDrawer from "../Components/DashboardBaseDrawer";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import CircularProgress from "@mui/material/CircularProgress";
import {Trans, t} from "@lingui/macro";
import useNEST from "../../../hooks/useNEST";

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

const Caption2 = styled('div')(({theme}) => ({
  fontWeight: "700",
  fontSize: '14px',
  lineHeight: '20px',
  color: "rgba(249, 249, 249, 0.6)",
}))

const Caption3 = styled('div')(({theme}) => ({
  fontWeight: "700",
  fontSize: '32px',
  lineHeight: '44px',
  color: "#F9F9F9",
}))

const Caption4 = styled('div')(({theme}) => ({
  fontWeight: "700",
  fontSize: '48px',
  lineHeight: '55px',
}))

const Caption5 = styled('div')(({theme}) => ({
  fontWeight: "400",
  fontSize: '14px',
  lineHeight: '20px',
  color: "rgba(249, 249, 249, 0.6)",
}))

const Caption6 = styled('div')(({theme}) => ({
  fontWeight: "700",
  fontSize: '18px',
  lineHeight: '24px',
  color: "#F9F9F9",
}))

const Caption7 = styled('div')(({theme}) => ({
  fontWeight: "400",
  fontSize: '16px',
  lineHeight: '22px',
  color: "#F9F9F9",
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
    totalValue: number,
    totalVolume: number,
    totalCount: number,
    // totalRate: number,
    todayValue: number,
    day7Value: number,
    day30Value: number,
    // todayRate: number,
    // day7Rate: number,
    // day30Rate: number,
  };
  open: boolean;
  onClose: () => void;
}

const ShareMyDealModal: FC<ShareMyDealModalProps> = ({...props}) => {
  const {address} = useAccount()
  const [showPage, setShowPage] = useState(false)
  const {isBigMobile} = useWindowWidth()
  const myShareRef = useRef(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const {messageSnackBar} = useNESTSnackBar();
  const {chainsData} = useNEST()

  const buildDataUrl = async () => {
    if (!myShareRef.current) {
      setTimeout(() => {
        buildDataUrl()
      }, 500)
      return
    }
    const node = myShareRef.current;
    try {
      // @ts-ignore
      node.style.width = '450px'
      if (node) {
        domtoimage.toPng(node, {
          bgcolor: '#1D1E22',
          // @ts-ignore
          width: node.offsetWidth,
          // @ts-ignore
          height: node.offsetHeight,
          quality: 1,
          scale: 2,
        })
          .then(function (dataUrl) {
            setDataUrl(dataUrl)
            // @ts-ignore
            node.style.width = '100%'
          })
      }
    } catch (e) {
      console.log('buildDataUrl: error', e)
      // @ts-ignore
      node.style.width = '100%'
    }
  }

  useEffect(() => {
    if (!dataUrl) {
      buildDataUrl()
    }
  }, [props])

  const download = async () => {
    const link = document.createElement('a');
    link.download = `${address}.png`;
    if (!dataUrl) {
      await buildDataUrl()
    }
    if (typeof dataUrl === "string") {
      link.href = dataUrl;
      link.click();
    }
  }

  const tweet = () => {
    const link = `https://nestfi.org/?a=${address?.slice(-8).toLowerCase()}`
    const text = `${t`Follow the right person, making money is as easy as breathing.
You can follow the right person on NESTFi, here is my refer link`}: ${link}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text)}&hashtags=NEST,btc,eth&via=NEST_Protocol`)
  }
  const [select, setSelect] = useState({
    totalTrade: true,
    todayTrade: true,
    totalVolume: true,
    totalCount: true,
    _7DaysTrade: true,
    _30DaysTrade: true,
  })
  const showList = useMemo(() => {
    let list = []
    if ((chainsData.chainId === 56 || chainsData.chainId === 97) && select.totalTrade) {
      list.push({
        title: t`Total Profit & Loss`,
        value: props.value.totalValue,
        unit: "NEST"
      })
    }
    if (chainsData.chainId === 534353 && select.totalVolume) {
      list.push({
        title: t`My Total Trading Volume`,
        value: props.value.totalVolume,
        unit: "NEST"
      })
    }
    if (chainsData.chainId === 534353 && select.totalCount) {
      list.push({
        title: t`Total Number of Trades`,
        value: props.value.totalCount,
        unit: ""
      })
    }
    if (select.todayTrade) {
      list.push({
        title: t`Today\'s PNL`,
        value: props.value.todayValue,
        unit: "NEST"
      })
    }
    if (select._7DaysTrade) {
      list.push({
        title: t`7 Days\' PNL`,
        value: props.value.day7Value,
        unit: "NEST"
      })
    }
    if (select._30DaysTrade) {
      list.push({
        title: t`30 Days\' PNL`,
        value: props.value.day30Value,
        unit: "NEST"
      })
    }
    return list
  }, [select, chainsData.chainId])

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
              setDataUrl(null)
              props.onClose()
            }}>
              <Close/>
            </button>
          </Stack>
        </TopStack>
        <Box height={'20px'}/>
        {
          chainsData.chainId === 56 || chainsData.chainId === 97 && (
            <Card1 direction={'row'} sx={(theme) => ({
              background: select.totalTrade ? theme.normal.bg3 : "transparent",
            })} onClick={() => setSelect({...select, totalTrade: !select.totalTrade})}>
              <Stack width={'100%'} spacing={'10px'}>
                <Title1>
                  {t`Total Profit & Loss`}
                </Title1>
                <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                  <Caption1>{props.value.totalValue.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })} NEST</Caption1>
                  {/*<Box*/}
                  {/*  sx={(theme) => ({*/}
                  {/*    transform: props.value.totalRate >= 0 ? 'rotate(0deg)' : 'rotate(180deg)',*/}
                  {/*    "& svg": {*/}
                  {/*      display: "block",*/}
                  {/*      "& path": {*/}
                  {/*        fill: props.value.totalRate >= 0 ? theme.normal.success : theme.normal.danger,*/}
                  {/*      }*/}
                  {/*    }*/}
                  {/*  })}*/}
                  {/*>*/}
                  {/*  <UpIcon/>*/}
                  {/*</Box>*/}
                </Stack>
              </Stack>
              <Box sx={(theme) => ({
                "& svg": {
                  display: "block",
                  width: '22px',
                  height: '22px',
                  "& path": {
                    fill: select.totalTrade ? theme.normal.primary : theme.normal.text3,
                  },
                },
              })}>
                <Success/>
              </Box>
            </Card1>
          )
        }
        {
          chainsData.chainId === 534353 && (
            <>
              <Card1 direction={'row'} sx={(theme) => ({
                background: select.totalVolume ? theme.normal.bg3 : "transparent",
              })} onClick={() => setSelect({...select, totalVolume: !select.totalVolume})}>
                <Stack width={'100%'} spacing={'10px'}>
                  <Title1>
                    {t`My Total Trading Volume`}
                  </Title1>
                  <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                    <Caption1>{props.value.totalVolume.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })} NEST</Caption1>
                  </Stack>
                </Stack>
                <Box sx={(theme) => ({
                  "& svg": {
                    display: "block",
                    width: '22px',
                    height: '22px',
                    "& path": {
                      fill: select.totalVolume ? theme.normal.primary : theme.normal.text3,
                    },
                  },
                })}>
                  <Success/>
                </Box>
              </Card1>
              <Card1 direction={'row'} sx={(theme) => ({
                background: select.totalCount ? theme.normal.bg3 : "transparent",
              })} onClick={() => setSelect({...select, totalCount: !select.totalCount})}>
                <Stack width={'100%'} spacing={'10px'}>
                  <Title1>
                    {t`Total Number of Trades`}
                  </Title1>
                  <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
                    <Caption1>{props.value.totalCount.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}</Caption1>
                  </Stack>
                </Stack>
                <Box sx={(theme) => ({
                  "& svg": {
                    display: "block",
                    width: '22px',
                    height: '22px',
                    "& path": {
                      fill: select.totalCount ? theme.normal.primary : theme.normal.text3,
                    },
                  },
                })}>
                  <Success/>
                </Box>
              </Card1>
            </>
          )
        }

        <Card1 direction={'row'} sx={(theme) => ({
          background: select.todayTrade ? theme.normal.bg3 : "transparent",
        })} onClick={() => setSelect({...select, todayTrade: !select.todayTrade})}>
          <Stack width={'100%'} spacing={'10px'}>
            <Title1>
              {t`Today's PNL`}
            </Title1>
            <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
              <Caption1>{props.value.todayValue.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })} NEST</Caption1>
            </Stack>
          </Stack>
          <Box sx={(theme) => ({
            "& svg": {
              display: "block",
              width: '22px',
              height: '22px',
              "& path": {
                fill: select.todayTrade ? theme.normal.primary : theme.normal.text3,
              },
            },
          })}>
            <Success/>
          </Box>
        </Card1>
        <Card1 direction={'row'} sx={(theme) => ({
          background: select._7DaysTrade ? theme.normal.bg3 : "transparent",
        })} onClick={() => setSelect({...select, _7DaysTrade: !select._7DaysTrade})}>
          <Stack width={'100%'} spacing={'10px'}>
            <Title1>
              {t`7 Days' PNL`}
            </Title1>
            <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
              <Caption1>{props.value.day7Value.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })} NEST</Caption1>
            </Stack>
          </Stack>
          <Box sx={(theme) => ({
            "& svg": {
              display: "block",
              width: '22px',
              height: '22px',
              "& path": {
                fill: select._7DaysTrade ? theme.normal.primary : theme.normal.text3,
              },
            },
          })}>
            <Success/>
          </Box>
        </Card1>
        <Card1 direction={'row'} sx={(theme) => ({
          background: select._30DaysTrade ? theme.normal.bg3 : "transparent",
        })} onClick={() => setSelect({...select, _30DaysTrade: !select._30DaysTrade})}>
          <Stack width={'100%'} spacing={'10px'}>
            <Title1>
              {t`30 Days' PNL`}
            </Title1>
            <Stack direction={'row'} spacing={'8px'} alignItems={"center"}>
              <Caption1>{props.value.day30Value.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })} NEST</Caption1>
            </Stack>
          </Stack>
          <Box sx={(theme) => ({
            "& svg": {
              display: "block",
              width: '22px',
              height: '22px',
              "& path": {
                fill: select._30DaysTrade ? theme.normal.primary : theme.normal.text3,
              },
            },
          })}>
            <Success/>
          </Box>
        </Card1>
        <Stack style={{paddingTop: '24px'}}>
          <MainButton title={t`Confirm`}
                      disable={!select.totalTrade && !select.todayTrade && !select._7DaysTrade && !select._30DaysTrade}
                      style={{fontWeight: '700', fontSize: '14px'}} onClick={() => {
            setShowPage(true)
          }}/>
        </Stack>
      </Stack>
    )
  }

  const getSharePage = () => {
    return (
      <Stack width={'100%'} bgcolor={'rgba(29, 30, 34, 1)'} position={'relative'} borderRadius={'12px'}
             overflow={'hidden'}>
        <TopStack sx={{
          "& button": {
            "& svg": {
              "& path": {
                fill: "rgba(249, 249, 249, 0.6)"
              }
            }
          }
        }}>
          <Stack direction={'row'} justifyContent={'end'}>
            <button onClick={() => {
              setShowPage(false)
              setDataUrl(null)
              props.onClose()
            }}>
              <Close/>
            </button>
          </Stack>
        </TopStack>
        {
          dataUrl ? (
            <img src={dataUrl} style={{width: '100%'}} alt={'share'}/>
          ) : (
            <Stack minHeight={'400px'} height={'calc(min(100vw - 40px, 450px) * 1.46222)'} alignItems={'center'}
                   spacing={'18px'} justifyContent={'center'} sx={(theme) => ({
              color: '#F9F9F9',
              fontSize: '16px',
              lineHeight: '22px',
              fontWeight: '700',
              "& svg": {
                display: "block",
                color: theme.normal.primary,
              },
            })}>
              <CircularProgress size={'44px'}/>
              <span>
                {t`Loading...`}
              </span>
            </Stack>
          )
        }
        <Stack ref={myShareRef} position={'absolute'} zIndex={-1}>
          <Stack pt={'50px'} px={'24px'} bgcolor={'#0B0C0D'}
                 style={{
                   backgroundImage: `url('/images/share_deal.png')`,
                   backgroundRepeat: 'no-repeat',
                   backgroundPosition: 'center',
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
              !!showList[0] && (
                <Stack pt={'44px'}>
                  <Caption2>{showList[0].title}</Caption2>
                  <Caption3 sx={{
                    paddingTop: '8px',
                    'span': {
                      fontSize: '28px',
                      lineHeight: '40px'
                    }
                  }}>{showList[0].value.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })} <span>{showList[0].unit}</span></Caption3>
                </Stack>
              )
            }
            <Stack spacing={'24px'} pt={'64px'}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                {
                  !!showList?.[1] && (
                    <Stack spacing={'8px'} width={'50%'}>
                      <Caption5>{showList?.[1].title}</Caption5>
                      <Caption6>{showList?.[1].value.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })} {showList[1].unit}
                        {/*<span>{showList?.[1].rate}%</span>*/}
                      </Caption6>
                    </Stack>
                  )
                }
                {
                  !!showList?.[2] && (
                    <Stack spacing={'8px'} width={'50%'}>
                      <Caption5>{showList?.[2].title}</Caption5>
                      <Caption6>{showList?.[2].value.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })} {showList[2].unit}
                      </Caption6>
                    </Stack>
                  )
                }
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
              {
                !!showList?.[3] && (
                  <Stack spacing={'8px'} width={'50%'}>
                    <Caption5>{showList?.[3].title}</Caption5>
                    <Caption6>{showList?.[3].value.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })} {showList[3].unit}
                    </Caption6>
                  </Stack>
                )
              }
                {
                  !!showList?.[4] && (
                    <Stack spacing={'8px'} width={'50%'}>
                      <Caption5>{showList?.[4].title}</Caption5>
                      <Caption6>{showList?.[4].value.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })} {showList[4].unit}
                      </Caption6>
                    </Stack>
                  )
                }
              </Stack>
            </Stack>
            <Stack height={'80px'}/>
          </Stack>
          <Stack px={'20px'} direction={'row'} width={'100%'} paddingRight={'36px'}
                 justifyContent={'space-between'}
                 bgcolor={'rgba(29, 30, 34, 1)'}
                 alignItems={"center"} py={'18px'}>
            <Stack direction={'row'} spacing={'12px'}>
              <NESTLogo/>
              <Stack spacing={'4px'}>
                <Caption7>{t`Trade with me on NESTFi`}</Caption7>
                <Caption5>{new Date().toLocaleString()}</Caption5>
              </Stack>
            </Stack>
            <Box style={{width: '64px', height: '64px', background: 'white', padding: '3px'}}>
              <QRCodeCanvas
                value={`https://nestfi.org/?a=${address?.slice(-8).toLowerCase()}`}
                size={58}/>
            </Box>
          </Stack>
        </Stack>
        <Stack px={'20px'} pb={'24px'}>
          <Stack direction={'row'} width={'100%'} spacing={'12px'} pt={'24px'}>
            <MainButton
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '700',
                lineHeight: '22px',
              }}
              disable={!address}
              title={t`Copy Link`} onClick={() => {
              if (!address) return;
              const link = `https://nestfi.org/?a=${address?.slice(-8).toLowerCase()}`;
              copy(link);
              messageSnackBar(t`Copy Successfully`);
            }}/>
            <MainButton
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '700',
                lineHeight: '22px',
              }}
              title={t`Image`}
              isLoading={!dataUrl}
              onClick={download}
            />
            <MainButton style={{
              height: '48px',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '22px',
            }} title={t`Twitter`} onClick={tweet}/>
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
          setDataUrl(null)
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
        setDataUrl(null)
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