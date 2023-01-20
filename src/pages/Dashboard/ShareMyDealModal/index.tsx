import {FC, useRef, useState} from "react";
import Popup from "reactjs-popup";
import {Divider, Stack} from "@mui/material";
import MainButton from "../../../components/MainButton";
import {QRCodeCanvas} from "qrcode.react";
import domtoimage from "../../../libs/dom-to-image";
import useWeb3 from "../../../libs/hooks/useWeb3";
import DashboardModal from "../DashboardModal";
import {DownIcon, NESTLogo, ShareIcon, ShareWhiteIcon, UpIcon} from "../../../components/Icon";
import useThemes, {ThemeType} from "../../../libs/hooks/useThemes";
import classNames from "classnames";

const ShareMyDealModal: FC<{
  value: {
    totalValue: number,
    todayValue: number,
    day7Value: number,
    day30Value: number,
    todayRate: number,
    day7Rate: number,
    day30Rate: number,
  }
}> = ({value}) => {
  const {account} = useWeb3()
  const modal = useRef<any>();
  const [select, setSelect] = useState({
    totalTrade: true,
    todayTrade: false,
    _7DaysTrade: false,
    _30DaysTrade: false,
  })
  const [show, setShow] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const { theme } = useThemes();

  const copy = () => {
    const link = `https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`
    navigator.clipboard.writeText(link).then(() => {
      setHasCopied(true)
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    })
  }

  const download = () => {
    const node = document.getElementById('my-share');
    if (node) {
      domtoimage.toPng(node, {
        bgcolor: '#f7fdf6',
        width: node.clientWidth || 360,
        height: node.clientHeight || 640,
        quality: 1,
        scale: 2,
      })
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = `${account}.png`;
          link.href = dataUrl;
          link.click();
        })
    }
  }

  const tweet = () => {
    const text = `Follow the right person, making money is as easy as breathing.
You can follow the right person on NESTFi, here is my refer link:`
    const link = `https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=${link}&hashtags=NEST,btc,eth&via=NEST_Protocol`)
  }

  return (
    <Popup
      modal
      ref={modal}
      trigger={
        <Stack style={{alignItems: "center", justifyContent: 'center', cursor: 'pointer'}}>
          { theme === ThemeType.dark ? <ShareWhiteIcon/> : <ShareIcon/> }
        </Stack>
      }
    >
      <DashboardModal
        onClose={() => {
          modal?.current?.close()
          setShow(false)
        }}
        titleName={show ? '' : 'Share'}
        classNames={classNames({
          [`dashboardModal-dark`]: theme === ThemeType.dark,
        })}
      >
        {
          show ? (
            <>
              <Stack width={'100%'} minWidth={['360px', '480px', '600px']} borderRadius={'20px'} textAlign={"center"} p={'60px'}
                     style={{
                       backgroundImage: 'url(/DashboardImage/pc_share_bg_1.png)',
                       backgroundPosition: 'center',
                       backgroundSize: 'cover',
                       overflow: 'hidden'
                     }}
                     spacing={'30px'} id={'my-share'}>
                <Stack alignItems={"center"}>
                  <NESTLogo/>
                </Stack>
                <Divider/>
                <Stack minHeight={'300px'} justifyContent={'center'} spacing={'24px'}>
                  {
                    select.totalTrade && (
                      <Stack spacing={'4px'}>
                        <p className={`shareMyDealModal-title1`}>Total Trade</p>
                        <p className={`shareMyDealModal-value1`}>{value.totalValue}</p>
                      </Stack>
                    )
                  }
                  {
                    select.todayTrade && (
                      <Stack spacing={'4px'}>
                        <p className={`shareMyDealModal-title2`}>Today Trade</p>
                        <p className={`shareMyDealModal-value2`}>{value.todayValue > 0 &&
                            <UpIcon/>} {value.todayValue < 0 && <DownIcon/>} {value.todayValue}</p>
                        {/*<p className={'shareMyDealModal-caption2'}>{value.todayRate}% Today ringgit</p>*/}
                      </Stack>
                    )
                  }
                  {
                    select._7DaysTrade && (
                      <Stack spacing={'4px'}>
                        <p className={'shareMyDealModal-title2'}>7 Day Trade</p>
                        <p className={'shareMyDealModal-value2'}>{value.day7Value > 0 &&
                            <UpIcon/>} {value.day7Value < 0 && <DownIcon/>}{value.day7Value}</p>
                        {/*<p className={'shareMyDealModal-caption2'}>{value.day7Rate}% 7 Day ringgit</p>*/}
                      </Stack>
                    )
                  }
                  {
                    select._30DaysTrade && (
                      <Stack spacing={'8px'}>
                        <p className={'shareMyDealModal-title2'}>30 Day Trade</p>
                        <p className={'shareMyDealModal-value2'}>{value.day30Value > 0 &&
                            <UpIcon/>} {value.day30Value < 0 && <DownIcon/>} {value.day30Value}</p>
                        {/*<p className={'shareMyDealModal-caption2'}>{value.day30Rate}% 30 Day ringgit</p>*/}
                      </Stack>
                    )
                  }
                </Stack>
                <Divider/>
                <Stack alignItems={"center"} pb={'40px'}>
                  <QRCodeCanvas
                    value={`https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`}
                    size={80}/>
                </Stack>
              </Stack>
              <Stack width={'100%'} minWidth={['360px', '480px', '600px']} direction={'row'} position={'absolute'} bottom={34}
                     className={theme === ThemeType.dark ? 'dark' : ''}
                     spacing={['0px', '16px']} px={'60px'} justifyContent={'center'}>
                <MainButton className={'dashboard-button'} onClick={copy}>
                  {hasCopied ? 'Copied' : 'Copy'}
                </MainButton>
                <MainButton className={'dashboard-button'} onClick={download}>
                  Download
                </MainButton>
                <MainButton className={'dashboard-button'} onClick={tweet}>
                  Twitter
                </MainButton>
              </Stack>
            </>
          ) : (
            <Stack width={'100%'} minWidth={['360px', '480px', '600px']} textAlign={"center"} p={'34px'} overflow={'hidden'}
                   className={theme === ThemeType.dark ? 'dark' : ''}>
              <Stack pb={'34px'}>
                <p className={'dashboard-label'}>Share</p>
              </Stack>
              <Divider/>
              <Stack py={'22px'} justifyContent={"center"} spacing={'10px'}
                     onClick={() => {
                       setSelect({...select, totalTrade: !select.totalTrade})
                     }}
                     style={{userSelect: 'none', cursor: 'pointer'}}
              >
                <p className={'dashboard-label'}>Total Trade</p>
                <p className={'dashboard-value'}>{value.totalValue}</p>
                <Stack position={'absolute'} right={['20px', '40px', '60px']} height={'22px'} width={'22px'}
                       border={'1px solid #EEEEEE'} boxShadow={'0px 0px 10px 0px #EEEEEE'} alignItems={"center"}
                       justifyContent={"center"}
                       bgcolor={'#EEEEEE'} borderRadius={'100%'}>
                  {select.totalTrade && (
                    <Stack width={'10px'} height={'10px'} bgcolor={'#0047BB'} borderRadius={'100%'}/>
                  )}
                </Stack>
              </Stack>
              <Divider/>
              <Stack py={'22px'} justifyContent={"center"} spacing={'10px'}
                     onClick={() => {
                       setSelect({...select, todayTrade: !select.todayTrade})
                     }}
                     style={{userSelect: 'none', cursor: 'pointer'}}
              >
                <p className={'dashboard-label'}>Today Trade</p>
                <p className={'dashboard-value'}>{value.todayValue > 0 && <UpIcon/>} {value.todayValue < 0 && <DownIcon/>} {value.todayValue.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}</p>
                {/*<p className={'dashboard-caption'}>{value.todayRate}% Today ringgit</p>*/}
                <Stack position={'absolute'} right={['20px', '40px', '60px']} height={'22px'} width={'22px'}
                       border={'1px solid #EEEEEE'} boxShadow={'0px 0px 10px 0px #EEEEEE'} alignItems={"center"}
                       justifyContent={"center"}
                       bgcolor={'#EEEEEE'} borderRadius={'100%'}>
                  {select.todayTrade && (
                    <Stack width={'10px'} height={'10px'} bgcolor={'#0047BB'} borderRadius={'100%'}/>
                  )}
                </Stack>
              </Stack>
              <Divider/>
              <Stack py={'22px'} justifyContent={"center"} spacing={'10px'}
                     onClick={() => {
                       setSelect({...select, _7DaysTrade: !select._7DaysTrade})
                     }}
                     style={{userSelect: 'none', cursor: 'pointer'}}
              >
                <p className={'dashboard-label'}>7 Day Trade</p>
                <p className={'dashboard-value'}>{value.day7Value > 0 && <UpIcon/>} {value.day7Value < 0 && <DownIcon/>} {value.day7Value.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}</p>
                {/*<p className={'dashboard-caption'}>{value.day7Rate}% Today ringgit</p>*/}
                <Stack position={'absolute'} right={['20px', '40px', '60px']} height={'22px'} width={'22px'}
                       border={'1px solid #EEEEEE'} boxShadow={'0px 0px 10px 0px #EEEEEE'} alignItems={"center"}
                       justifyContent={"center"}
                       bgcolor={'#EEEEEE'} borderRadius={'100%'}>
                  {select._7DaysTrade && (
                    <Stack width={'10px'} height={'10px'} bgcolor={'#0047BB'} borderRadius={'100%'}/>
                  )}
                </Stack>
              </Stack>
              <Divider/>
              <Stack py={'22px'} justifyContent={"center"} spacing={'10px'}
                     onClick={() => {
                       setSelect({...select, _30DaysTrade: !select._30DaysTrade})
                     }}
                     style={{userSelect: 'none', cursor: 'pointer'}}
              >
                <p className={'dashboard-label'}>30 Day Trade</p>
                <p className={'dashboard-value'}>{value.day30Value > 0 && <UpIcon/>} {value.day30Value < 0 && <DownIcon/>} {value.day30Value.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}</p>
                {/*<p className={'dashboard-caption'}>{value.day30Rate}% Today ringgit</p>*/}
                <Stack position={'absolute'} right={['20px', '40px', '60px']} height={'22px'} width={'22px'}
                       border={'1px solid #EEEEEE'} boxShadow={'0px 0px 10px 0px #EEEEEE'} alignItems={"center"}
                       justifyContent={"center"}
                       bgcolor={'#EEEEEE'} borderRadius={'100%'}>
                  {select._30DaysTrade && (
                    <Stack width={'10px'} height={'10px'} bgcolor={'#0047BB'} borderRadius={'100%'}/>
                  )}
                </Stack>
              </Stack>
              <Divider/>
              <Stack pt={'34px'} width={'100%'} alignItems={'center'}>
                <MainButton
                  className={'dashboard-button'}
                  disable={!select.todayTrade && !select.totalTrade && !select._7DaysTrade && !select._30DaysTrade}
                  onClick={() => {
                    setShow(true)
                  }}
                >
                  Confirm
                </MainButton>
              </Stack>
            </Stack>
          )
        }

      </DashboardModal>
    </Popup>
  )
}

export default ShareMyDealModal