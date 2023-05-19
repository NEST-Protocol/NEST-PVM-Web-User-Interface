import {FC, useEffect, useMemo, useState} from "react";
import MainButton from "../../components/MainButton/MainButton";
import {Grid, Stack} from "@mui/material";
import {styled} from "@mui/material/styles";
import {
  HomeIcon1,
  HomeIcon2,
  HomeIcon3,
  HomeIcon4,
  HomeIcon5,
  HomeIcon6
} from "../../components/icons";
import Box from "@mui/material/Box";
import ApplyModal from "./Modal/ApplyModal";
import useWindowWidth from "../../hooks/useWindowWidth";
import useTheme from "../../hooks/useTheme";
import {Link} from "react-router-dom";
import {t} from '@lingui/macro'

const Header1 = styled("header")(({theme}) => ({
  fontWeight: "700",
  fontSize: "32px",
  lineHeight: "44px",
  textAlign: 'center',
  color: theme.normal.text0,
}));

const Caption1 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.normal.text1,
  textAlign: "center",
}))

const Badge1 = styled("div")(({theme}) => ({
  display: "flex",
  padding: "12px",
  background: theme.normal.bg3,
  borderRadius: " 28px 0px 0px 28px",
  fontWeight: "700",
  fontSize: "14px",
  color: theme.normal.text0,
  alignItems: 'center',
}))

const Title1 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "48px",
  lineHeight: "50px",
  color: theme.normal.text0,
}))

const Title2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "28px",
  lineHeight: "40px",
  color: theme.normal.text0,
  textAlign: "start"
}))

const Title3 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  color: theme.normal.text0,
  textAlign: "center",
}))

const Card1 = styled("div")(({theme}) => ({
  width: '100%',
  display: "flex",
  justifyContent: "center",
  position: "relative"
}))

const Card2 = styled(Stack)(({theme}) => ({
  padding: "40px 20px",
  background: theme.normal.bg1,
  borderRadius: "20px",
  alignItems: "center",
  height: '100%',
}))

const Card3 = styled("div")(({theme}) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  width: '50%',
  height: '280px',
  zIndex: 0,
  borderRadius: '140px 0px 0px 140px',
  background: theme.normal.bg1,
}))

const BackgroundLayer = styled("div")(({theme}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: theme.normal.bg1,
  opacity: 0.6
}))

const DashSvg = styled(Box)(({theme}) => ({
  "& svg": {
    display: "block",
    "& path": {
      fill: theme.normal.text0,
    },
  },
}));

const CardBorder = styled('div')(({theme}) => ({
  border: '1px solid',
  borderColor: theme.normal.border,
  borderRadius: '12px'
}))

const MobileCard1 = styled('div')(({theme}) => ({
  background: theme.normal.bg1,
  borderRadius: '12px'
}))

const MobileCard1Caption = styled('div')(({theme}) => ({
  fontWeight: '700',
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.normal.text1
}))

const MobileCard2 = styled('div')(({theme}) => ({
  background: theme.normal.bg1,
}))

const MobileCard2Title1 = styled('div')(({theme}) => ({
  fontWeight: '700',
  fontSize: '24px',
  lineHeight: '32px',
  textAlign: 'center',
  color: theme.normal.text0
}))

const Home: FC = () => {
  const [openApplyModal, setOpenApplyModal] = useState(false)
  const {isBigMobile} = useWindowWidth()
  const [destoryData, setDestoryData] = useState({
    dayDestroy: 0,
    totalDestroy: 0,
  });
  const [kols, setKols] = useState(0);
  const {nowTheme} = useTheme()

  const fetchKOLCount = () => {
    fetch('https://api.nestfi.net/api/users/kol/count')
      .then((res) => res.json())
      .then((data) => {
        setKols(data.value)
      })
  }

  const fetchDestory = () => {
    fetch('https://api.nestfi.net/api/dashboard/destory')
      .then((res) => res.json())
      .then((data) => {
        setDestoryData(data.value)
      })
  }

  useEffect(() => {
    fetchDestory()
    const internal = setInterval(() => {
      fetchDestory()
    }, 30_000)
    return () => clearInterval(internal)
  }, [])

  useEffect(() => {
    fetchKOLCount()
  }, [])

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
        paddingBottom={['40px', '40px', '80px']}
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
          <Stack spacing={'12px'} px={['20px', '20px', '40px']} paddingTop={['40px', '40px', '80px']}>
            <Header1 sx={{fontSize: ['26px', '26px', '32px'], zIndex: 1}}>
              {t`NESTFi, A Next-Generation`}
              <br/>
              {t`Decentralized Perpetual Exchange`}
            </Header1>
            <Caption1 sx={{zIndex: 1}}>
              {t`NESTFi's economic model is deflationary, the more users trade, the more $NEST will be burned`}
            </Caption1>
          </Stack>
          {
            isBigMobile ? (
              <Stack p={'20px'} width={'100%'} zIndex={1}>
                <MobileCard1>
                  <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={"center"}
                         padding={'20px'}>
                    <Stack alignItems={"start"}>
                      <Title1
                        sx={{fontSize: ['28px', '28px', '32px']}}>{destoryData.totalDestroy === 0 ? '-' : (-1 * destoryData.totalDestroy).toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })} NEST</Title1>
                      <MobileCard1Caption>{t`Total Burned`}</MobileCard1Caption>
                    </Stack>
                    <DashSvg>
                      <HomeIcon6/>
                    </DashSvg>
                  </Stack>
                </MobileCard1>
              </Stack>
            ) : (
              <Stack direction={'row'} zIndex={1} spacing={'16px'} py={'40px'} px={['20px', '20px', '40px']}>
                <Badge1>
                  {t`Total Burned`}
                </Badge1>
                <Title1>
                  {destoryData.totalDestroy === 0 ? '-' : (-1 * destoryData.totalDestroy).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })} <span
                  style={{fontSize: '36px'}}>NEST</span>
                </Title1>
              </Stack>
            )
          }
          <Stack pb={['60px', '60px', '80px']} zIndex={1} px={['20px', '20px', '40px']}>
            <Link to={'/futures'}>
              <MainButton title={t`Start Trading`} style={{width: '200px', height: "48px"}}
                          onClick={() => {
                          }}/>
            </Link>
          </Stack>
        </Stack>
        {
          isBigMobile ? (
            <Stack width={'100%'}>
              <MobileCard2 sx={{padding: '40px 20px'}}>
                <MobileCard2Title1>{t`NESTFi offers`}<br/>
                  <span style={{
                    fontWeight: '700',
                    fontSize: '28px',
                    color: 'rgb(234, 170, 0)'
                  }}>{t`100%`}</span> {t`trading fees as`}
                  <br/> {t`commission for KOLs`}
                </MobileCard2Title1>
                <MobileCard1 sx={{paddingY: '20px'}}>
                  <CardBorder>
                    <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={"center"}
                           padding={'20px'} borderRadius={'12px'}>
                      <Stack alignItems={"start"}>
                        <Title1
                          sx={{fontSize: ['28px', '28px', '32px']}}>{kols === 0 ? '-' : kols.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}</Title1>
                        <MobileCard1Caption>{t`Number of KOLs Joined NESTFi`}</MobileCard1Caption>
                      </Stack>
                      <DashSvg>
                        <HomeIcon5/>
                      </DashSvg>
                    </Stack>
                  </CardBorder>
                </MobileCard1>
                <MainButton title={t`Become a Trading KOL`} onClick={() => {
                  setOpenApplyModal(true)
                }} style={{width: '225px', height: "48px"}}/>
              </MobileCard2>
            </Stack>
          ) : (
            <Card1>
              <BackgroundLayer/>
              <Stack width={'100%'} position={'relative'} alignItems={"center"}>
                <Stack maxWidth={'1600px'} px={['20px', '20px', '40px']} direction={'row'} width={'100%'} zIndex={1}>
                  <Stack spacing={'40px'} width={'50%'} py={'80px'} px={'20px'}>
                    <Title2>
                      {t`NESTFi offers`} <span
                      style={{fontWeight: '700', fontSize: '28px', color: 'rgb(234, 170, 0)'}}>{t`100%`}</span> {t`trading
                      fees`} <br/> {t`as commission for KOLs.`}
                    </Title2>
                    <MainButton title={t`Become a Trading KOL`}
                                style={{width: '225px', height: "48px"}}
                                onClick={() => {
                                  setOpenApplyModal(true)
                                }}/>
                  </Stack>
                  <Stack direction={'row'} width={'50%'} alignItems={"center"} pl={'120px'} spacing={'18px'}>
                    <DashSvg>
                      <HomeIcon5/>
                    </DashSvg>
                    <Stack spacing={'12px'} justifyContent={"center"} alignItems={'start'}>
                      <Title1>
                        {kols === 0 ? '-' : kols.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </Title1>
                      <Caption1>
                        {t`Number of KOLs Joined NESTFi`}
                      </Caption1>
                    </Stack>
                  </Stack>
                </Stack>
                <Card3/>
              </Stack>
            </Card1>
          )
        }
        <Stack pt={['60px', '60px', '100px']}>
          <Header1 sx={{padding: '0 20px', fontSize: ['28px', '28px', '32px']}}>
            {t`Why You Should Choose NESTFi`}
          </Header1>
          <Stack direction={'row'} pt={['20px', '20px', '40px']} spacing={'24px'} maxWidth={'1600px'}
                 px={['20px', '20px', '40px']}>
            <Grid container spacing={'24px'}>
              {
                [
                  {
                    icon: <HomeIcon1/>,
                    title: t`Decentralized`,
                    description: t`Trade directly from your wallet without the risk of misappropriating funds.`
                  },
                  {
                    icon: <HomeIcon2/>,
                    title: t`Deflationary`,
                    description: t`NEST\'s economic model is deflationary, thus settlement with $NEST will bring higher potential revenue.`,
                  },
                  {
                    icon: <HomeIcon3/>,
                    title: t`No Market Makers`,
                    description: t`The smart contract is the only seller of the system, which means there are no market marking costs, no liquidity debt, no slippage costs in the system.`,
                  },
                  {
                    icon: <HomeIcon4/>,
                    title: t`Infinite Liquidity`,
                    description: t`The smart contract guarantees the infinite liquidity through burning and issuing $NEST. This keeps positions safe from temporary wicks caused by illiquidity.`,
                  }
                ].map((item, index) => {
                  return (
                    <Grid key={index} item xs={12} sm={6} md={3}>
                      <Card2 sx={{paddingY: ['20px', '20px', '40px']}}>
                        <Stack pb={'24px'}>
                          {item.icon}
                        </Stack>
                        <Title3>
                          {item.title}
                        </Title3>
                        <Caption1
                          sx={{
                            height: '100%',
                            paddingTop: '8px',
                          }}>
                          {item.description}
                        </Caption1>
                      </Card2>
                    </Grid>
                  )
                })
              }
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
};

export default Home;
