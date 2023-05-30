import {FC, useMemo, useState} from "react";
import MainButton from "../../components/MainButton/MainButton";
import {Grid, Stack} from "@mui/material";
import {
  HomeBurned,
  HomeIcon1,
  HomeIcon2,
  HomeIcon3,
  HomeIcon4,
  HomeKols,
  HomeTradingVolume
} from "../../components/icons";
import ApplyModal from "./Modal/ApplyModal";
import useWindowWidth, {WidthType} from "../../hooks/useWindowWidth";
import useTheme from "../../hooks/useTheme";
import {Link} from "react-router-dom";
import {t} from '@lingui/macro'
import useSWR from "swr";
import Box from "@mui/material/Box";

const Home: FC = () => {
  const [openApplyModal, setOpenApplyModal] = useState(false)
  const {width} = useWindowWidth()
  const {nowTheme} = useTheme()

  const {data: kols} = useSWR('https://api.nestfi.net/api/users/kol/count', (url) => fetch(url)
    .then((res) => res.json())
    .then((data) => data.value)
  );
  const {data: destoryData} = useSWR('https://api.nestfi.net/api/dashboard/destory', (url) => fetch(url)
    .then((res) => res.json())
    .then((data) => data.value)
  );

  const {data: txInfo} = useSWR("https://api.nestfi.net/api/dashboard/txVolume", (url) => fetch(url)
    .then((res) => res.json())
    .then((res: any) => res.value));

  const modal = useMemo(() => {
    return (
      <ApplyModal open={openApplyModal} onClose={() => {
        setOpenApplyModal(false)
      }}/>
    )
  }, [openApplyModal])

  return (
    <Stack alignItems={"center"}>
      {modal}
      <Stack
        spacing={0}
        width={"100%"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Stack
          width={'100%'}
          alignItems={"center"}
          position={'relative'}
          overflow={'hidden'}
        >
          {
            nowTheme.isLight && (
              <Stack position={'absolute'} height={'100%'} width={'100%'} zIndex={0}
                     style={{
                       background: `url(/images/home_banner_bg_light.svg)`,
                       backgroundSize: 'cover',
                       backgroundRepeat: 'no-repeat',
                       backgroundPosition: 'center',
                     }}
              />
            )
          }
          {
            !nowTheme.isLight && (
              <Stack position={'absolute'} height={'100%'} width={'100%'} zIndex={0}
                     style={{
                       background: `url(/images/home_banner_bg_dark.svg)`,
                       backgroundSize: 'cover',
                       backgroundRepeat: 'no-repeat',
                       backgroundPosition: 'center',
                     }}
              />
            )
          }
          <Stack spacing={'12px'} px={['20px', '20px', '20px', '40px']} paddingTop={['40px', '40px', '80px']}>
            <Box sx={(theme) => ({
              fontSize: ['26px', '26px', '32px'],
              zIndex: 1,
              fontWeight: "700",
              lineHeight: "44px",
              textAlign: 'center',
              color: theme.normal.text0,
            })}>
              {t`NESTFi, A Next-Generation`}
              <br/>
              {t`Decentralized Perpetual Exchange`}
            </Box>
            <Box sx={(theme) => ({
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text1,
              textAlign: "center",
              zIndex: 1,
            })}>
              {t`Deflationary economic model. The more users trade, the more $NEST will be burned`}
            </Box>
          </Stack>
          <Stack pb={['32px', '40px', '80px']} zIndex={1} px={['0', '20px', '40px']} pt={['32px', '40px']}>
            <Link to={'/futures'}>
              <MainButton title={t`Start Trading`} style={{width: '200px', height: "48px"}}
                          onClick={() => {
                          }}/>
            </Link>
          </Stack>
          {
            width > WidthType.lg ? (
              <Stack width={'100%'} maxWidth={'1600px'} direction={'row'} justifyContent={"center"} px={'40px'}
                     pb={'80px'} zIndex={1} spacing={'12px'}>
                {
                  [
                    {
                      title: t`Total Trading Volume (NEST)`,
                      value: txInfo ? Number(txInfo?.totalVolume?.toFixed(2))?.toLocaleString() : '-',
                    },
                    {
                      title: t`Total Burned (NEST)`,
                      value: destoryData ? Number((-1 * destoryData?.totalDestroy)?.toFixed(2))?.toLocaleString() || 0 : '-',
                    },
                    {
                      title: t`KOLs Joined NESTFi`,
                      value: kols ? kols.toLocaleString() || 0 : '-',
                    }
                  ].map((item, index) => (
                    <Stack key={index} spacing={'12px'} width={'100%'}>
                      <Box sx={(theme) => ({
                        fontWeight: "700",
                        fontSize: "48px",
                        lineHeight: "60px",
                        color: theme.normal.text0,
                      })}>{item.value}</Box>
                      <Box sx={(theme) => ({
                        fontWeight: "700",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: theme.normal.text2,
                      })}>{item.title}</Box>
                    </Stack>
                  ))
                }
              </Stack>
            ) : (
              <Stack px={['20px', '20px', '20px', '40px']} width={'100%'} spacing={'20px'} pb={'60px'} zIndex={1}>
                {
                  [
                    {
                      title: t`Total Trading Volume (NEST)`,
                      value: txInfo ? txInfo?.totalVolume?.toFixed(2)?.toLocaleString() : '-',
                      icon: <HomeTradingVolume/>,
                    },
                    {
                      title: t`Total Burned (NEST)`,
                      value: destoryData ? (-1 * destoryData?.totalDestroy)?.toFixed(2)?.toLocaleString() || 0 : '-',
                      icon: <HomeBurned/>,
                    },
                    {
                      title: t`KOLs Joined NESTFi`,
                      value: kols ? kols.toLocaleString() || 0 : '-',
                      icon: <HomeKols/>,
                    }
                  ].map((item, index) => (
                    <Stack p={'20px'} sx={(theme) => ({
                      backgroundColor: theme.normal.bg1,
                      borderRadius: '12px',
                      "svg": {
                        width: '48px',
                        height: '48px',
                        "path": {
                          fill: theme.normal.text0,
                        }
                      }
                    })} direction={'row'} key={index} alignItems={"center"}>
                      <Stack spacing={'12px'} width={'100%'} textAlign={"start"}>
                        <Box sx={(theme) => ({
                          fontWeight: "700",
                          fontSize: "28px",
                          lineHeight: "40px",
                          color: theme.normal.text0,
                        })}>{item.value}</Box>
                        <Box sx={(theme) => ({
                          fontWeight: "700",
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: theme.normal.text2,
                        })}>{item.title}</Box>
                      </Stack>
                      {item.icon}
                    </Stack>
                  ))
                }
              </Stack>
            )
          }
          {
            width >= WidthType.lg && (
              <Stack sx={(theme) => ({
                zIndex: 1,
                background: `linear-gradient(180deg, ${theme.normal.bg1} 0%, ${theme.normal.bg0} 100%)`,
                height: '80px',
                width: '100%',
                borderRadius: '80px 80px 0 0'
              })}>
              </Stack>
            )
          }
        </Stack>
      </Stack>
      {
        width <= WidthType.md && (
          <Stack py={'40px'} width={'100%'} spacing={'40px'} alignItems={"center"}
                 bgcolor={'rgba(234, 170, 0, 0.1)'}
                 sx={(theme) => ({
                   color: theme.normal.text0,
                   fontSize: '24px',
                   fontWeight: "700",
                   lineHeight: "32px",
                   borderRadius: '20px',
                   textAlign: 'center',
                   paddingX: '20px',
                 })}>
            <Box>{t`Join the NESTFi affiliate program and get commission on your referrals.`}</Box>
            <MainButton title={t`Engage in`} style={{
              width: '125px',
              fontSize: '16px',
              fontWeight: "700",
              lineHeight: "22px",
            }} onClick={() => {
              setOpenApplyModal(true)
            }}/>
          </Stack>
        )
      }
      <Stack width={'100%'} pt={['60', '60px', '60px', '0px']}
             spacing={['60px', '60px', '60px', '120px', '120px', '160px']}
             sx={(theme) => ({
               background: theme.normal.bg0,
             })}
             alignItems={"center"}>
        {
          width >= WidthType.lg && (
            <Stack width={'100%'}
                   px={['20px', '20px', '20px', '40px',]}
                   sx={(theme) => ({
                     background: theme.normal.bg0
                   })}
                   alignItems={"center"}>
              <Stack direction={'row'} width={'100%'} maxWidth={'1600px'}
                     bgcolor={'rgba(234, 170, 0, 0.1)'}
                     borderRadius={'20px'} justifyContent={'space-between'}
                     alignItems={"center"}
                     py={['40px', '40px', '40px', '40px', '40px', '44px']} px={'40px'}
              >
                <Box sx={(theme) => ({
                  fontSize: '28px',
                  fontWeight: "700",
                  lineHeight: "40px",
                  color: theme.normal.text0,
                  width: '66%',
                })}>Join the NESTFi affiliate program and get commission on your referrals.</Box>
                <MainButton title={t`Engage in`} style={{
                  width: '125px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: "700",
                  lineHeight: "22px",
                }} onClick={() => {
                  setOpenApplyModal(true)
                }}/>
              </Stack>
            </Stack>
          )
        }
        <Stack width={'100%'} px={['20px', '20px', '20px', '40px']} alignItems={"center"}>
          <Stack maxWidth={'1600px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: ['24px', '32px'],
              fontWeight: "700",
              lineHeight: ['32px', "44px"],
              textAlign: width <= WidthType.md ? 'center' : 'start',
              color: theme.normal.text0,
            })}>
              {t`Why You Should Choose NESTFi`}
            </Box>
            <Stack direction={'row'} pt={['20px', '20px', '40px']} spacing={'24px'}>
              <Grid container spacing={'24px'}>
                {
                  [
                    {
                      icon: <HomeIcon1/>,
                      title: t`Decentralized`,
                      description: t`Trading only with smart contract.No third-party intervention.`
                    },
                    {
                      icon: <HomeIcon2/>,
                      title: t`Deflationary`,
                      description: t`NEST's economic model is deflationary. The more users trade, the more $NEST will be burned.`,
                    },
                    {
                      icon: <HomeIcon3/>,
                      title: t`No Market Makers`,
                      description: t`The smart contract is the only seller of the system. No market marking costs and no liquidity debt.`,
                    },
                    {
                      icon: <HomeIcon4/>,
                      title: t`Infinite Liquidity`,
                      description: t`The smart contract guarantees infinite liquidity through burning and issuing $NEST.`,
                    }
                  ].map((item, index) => {
                    return (
                      <Grid key={index} item xs={12} sm={12} md={6} lg={3}>
                        <Stack sx={(theme) => ({
                          padding: "40px 20px",
                          background: theme.normal.bg1,
                          borderRadius: "20px",
                          alignItems: "center",
                          height: '100%',
                          paddingY: ['20px', '20px', '40px']
                        })}>
                          <Stack pb={'24px'}>
                            {item.icon}
                          </Stack>
                          <Box sx={(theme) => ({
                            fontWeight: "700",
                            fontSize: "16px",
                            lineHeight: "22px",
                            color: theme.normal.text0,
                            textAlign: "center",
                          })}>
                            {item.title}
                          </Box>
                          <Box sx={(theme) => ({
                            fontWeight: ["400", '400', '400', '700'],
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: theme.normal.text2,
                            textAlign: "center",
                            zIndex: 1,
                            height: '100%',
                            paddingTop: '8px',
                          })}>
                            {item.description}
                          </Box>
                        </Stack>
                      </Grid>
                    )
                  })
                }
              </Grid>
            </Stack>
          </Stack>
        </Stack>
        <Stack width={'100%'} px={['20px', '20px', '20px', '40px']} alignItems={"center"}>
          <Stack maxWidth={'1600px'} width={'100%'} spacing={'40px'}>
            <Stack spacing={'12px'}>
              <Box sx={(theme) => ({
                fontSize: ['24px', '32px'],
                fontWeight: "700",
                lineHeight: ['32px', "44px"],
                textAlign: width <= WidthType.md ? 'center' : 'start',
                color: theme.normal.text0,
              })}>
                {t`How to Start?`}
              </Box>
              <Box sx={(theme) => ({
                fontSize: ['14px', '16px'],
                fontWeight: ["400px", "700"],
                lineHeight: ['20px', "22px"],
                textAlign: width <= WidthType.md ? 'center' : 'start',
                color: theme.normal.text2,
              })}>
                {t`A beginner's guide to using NEST Fi`}
              </Box>
            </Stack>
            <Stack direction={width <= WidthType.md ? 'column' : 'row'} spacing={'24px'}>
              {
                [
                  {
                    image: "/images/home_trade.png",
                    image2: "/images/home_6.png",
                    title: t`How to make your first trade?`,
                    description: t`Trade BTC, ETH and BNB with up to 1-50 leverage. Open a position with USDT or NEST.`,
                    link: 'How-to-make-your-first-trade-on-NESTFi'
                  },
                  {
                    image: "/images/home_follow.png",
                    image2: "/images/home_5.png",
                    title: t`How to follow others' trading strategies?`,
                    description: t`Follow excellent traders with only one click to catch your next trading opportunity.`,
                    link: 'How-to-duplicate-your-own-position'
                  },
                  {
                    image: "/images/home_KOL.png",
                    image2: "/images/home_7.png",
                    title: t`How to join affiliate program?`,
                    description: t`Boost your earning and influence by joining the NESTFi affiliate program.`,
                    link: ''
                  }
                ].map((item, index) => (
                  <Stack key={index} sx={(theme) => ({
                    background: theme.normal.bg1,
                    borderRadius: "20px",
                    overflow: 'hidden',
                  })}>
                    <Box sx={(theme) => ({
                      display: theme.isLight ? 'none' : 'block',
                    })}>
                      <img src={item.image} width={'100%'} alt={item.title}/>
                    </Box>
                    <Box sx={(theme) => ({
                      display: theme.isLight ? 'block' : 'none',
                    })}>
                      <img src={item.image2} width={'100%'} alt={item.title}/>
                    </Box>
                    <Stack p={'24px'} spacing={'12px'}>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text0,
                        fontSize: ['16px', '20px'],
                        lineHeight: ['22px', '28px'],
                        fontWeight: '700',
                      })}>{item.title}</Stack>
                      <Stack sx={(theme) => ({
                        color: theme.normal.text2,
                        fontSize: ['14px', '16px'],
                        lineHeight: ['20px', '22px'],
                        fontWeight: ['400', '700'],
                      })}>{item.description}</Stack>
                      <Link to={item.link}>
                        <Stack sx={(theme) => ({
                          color: theme.normal.text2,
                          fontSize: ['14px', '16px'],
                          lineHeight: ['20px', '22px'],
                          fontWeight: '400',
                        })}>
                          More {'>'}
                        </Stack>
                      </Link>
                    </Stack>
                  </Stack>
                ))
              }
            </Stack>
          </Stack>
        </Stack>
        <Stack width={'100%'} px={['20px', '20px', '20px', '40px']} alignItems={"center"} sx={(theme) => ({
          backgroundImage: theme.isLight ? 'url(/images/home_3.png)' : 'url(/images/home_2.png)',
          backgroundSize: 'cover',
        })}>
          <Stack maxWidth={'1600px'} pb={'80px'} alignItems={"center"} width={'100%'} height={'100%'}
                 direction={width <= WidthType.lg ? 'column-reverse' : 'row'}
                 spacing={['40px', '40px', '40px', '40px', '40px', '80px']}>
            <Box width={'100%'} sx={(theme) => ({
              display: theme.isLight ? 'none' : 'block',
            })}>
              <img src={'/images/home_1.png'} width={'100%'} alt={''}/>
            </Box>
            <Box width={'100%'} sx={(theme) => ({
              display: theme.isLight ? 'block' : 'none',
            })}>
              <img src={'/images/home_4.png'} width={'100%'} alt={''}/>
            </Box>
            <Stack spacing={'12px'} alignItems={width <= WidthType.lg ? "center" : "start"}>
              <Box sx={(theme) => ({
                fontSize: ['24px', "32px"],
                fontWeight: "700",
                lineHeight: ['32px', "44px"],
                color: theme.normal.text0,
                textAlign: width <= WidthType.lg ? 'center' : 'start',
              })}>
                {t`Trade easily anytime and anywhere.`}
              </Box>
              <Box sx={(theme) => ({
                fontSize: ['14px', "16px"],
                fontWeight: ['400', "700"],
                lineHeight: ['20px', "22px"],
                color: theme.normal.text2,
                textAlign: width <= WidthType.lg ? 'center' : 'start',
              })}>
                {t`Leading cryptocurrency decentralized exchange. Trade BTC/USDT, ETH/USDT and BNB/USDT futures securely,
              swiftly, and effortlessly.`}
              </Box>
              <Box pt={'28px'}>
                <Link to={'/futures'}>
                  <MainButton
                    title={t`Trade Now`}
                    style={{
                      width: '135px',
                      height: '48px',
                    }}
                    onClick={() => {
                    }}/>
                </Link>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
};

export default Home;
