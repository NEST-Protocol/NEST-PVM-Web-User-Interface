import {FC, useRef, useState} from "react";
import Popup from "reactjs-popup";
import {Divider, Stack} from "@mui/material";
import MainButton from "../../../components/MainButton";
import {QRCodeCanvas} from "qrcode.react";
import domtoimage from "../../../libs/dom-to-image";
import useWeb3 from "../../../libs/hooks/useWeb3";
import BaseModal from "../BaseModal";

const ShareMyDealModal: FC = () => {
  const { account } = useWeb3()
  const modal = useRef<any>();
  const [select, setSelect] = useState({
    totalTrade: true,
    todayTrade: false,
    _7DaysTrade: false,
    _30DaysTrade: false,
  })
  const [show, setShow] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

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
        bgcolor: '#f1fff9',
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
        <button>
          share
        </button>
      }
    >
      <BaseModal
        onClose={() => {
          modal?.current?.close()
          setShow(false)
        }}
        titleName={show ? '' : 'Share'}
      >
        {
          show ? (
            <>
              <Stack width={['360px', '480px', '600px']} borderRadius={'20px'} textAlign={"center"} p={'60px'} spacing={'30px'} id={'my-share'}>
                <p>NEST</p>
                <Divider/>
                <Stack minHeight={'300px'} justifyContent={'center'} spacing={'24px'}>
                  {
                    select.totalTrade && (
                      <Stack spacing={'4px'}>
                        <p className={'shareMyDealModal-title1'}>Total Trade</p>
                        <p className={'shareMyDealModal-value1'}>-10293.1</p>
                      </Stack>
                    )
                  }
                  {
                    select.todayTrade && (
                      <Stack spacing={'4px'}>
                        <p className={'shareMyDealModal-title2'}>Today Trade</p>
                        <p className={'shareMyDealModal-value2'}>-102922</p>
                        <p className={'shareMyDealModal-caption2'}>-25% Today ringgit</p>
                      </Stack>
                    )
                  }
                  {
                    select._7DaysTrade && (
                      <Stack spacing={'4px'}>
                        <p className={'shareMyDealModal-title2'}>7 Day Trade</p>
                        <p className={'shareMyDealModal-value2'}>-1028301</p>
                        <p className={'shareMyDealModal-caption2'}>-25% 7 Day ringgit</p>
                      </Stack>
                    )
                  }
                  {
                    select._30DaysTrade && (
                      <Stack spacing={'8px'}>
                        <p className={'shareMyDealModal-title2'}>30 Day Trade</p>
                        <p className={'shareMyDealModal-value2'}>-1029002</p>
                        <p className={'shareMyDealModal-caption2'}>-25% 30 Day ringgit</p>
                      </Stack>
                    )
                  }
                </Stack>
                <Divider/>
                <Stack alignItems={"center"} pb={'40px'}>
                  <QRCodeCanvas value={`https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`} size={80}/>
                </Stack>
              </Stack>
              <Stack width={['360px', '480px', '600px']} direction={'row'} position={'absolute'} bottom={34} spacing={'16px'} px={'60px'}>
                <MainButton className={'shareMyDealModal-button'} onClick={copy}>
                  { hasCopied ? 'Copied' : 'Copy' }
                </MainButton>
                <MainButton className={'shareMyDealModal-button'} onClick={download}>
                  Download
                </MainButton>
                <MainButton className={'shareMyDealModal-button'} onClick={tweet}>
                  Twitter
                </MainButton>
              </Stack>
            </>
          ) : (
            <Stack width={['360px', '480px', '600px']} textAlign={"center"} p={'34px'} overflow={'hidden'}>
              <Stack pb={'34px'}>
                <p className={'dashboard-label'}>Share</p>
              </Stack>
              <Divider/>
              <Stack py={'22px'} justifyContent={"center"} spacing={'10px'}
                     onClick={() => {
                       setSelect({...select, totalTrade: !select.totalTrade})
                     }}
                     style={{ userSelect: 'none', cursor: 'pointer' }}
              >
                <p className={'dashboard-label'}>Total Trade</p>
                <p className={'dashboard-value'}>-1029301.02</p>
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
                     style={{ userSelect: 'none', cursor: 'pointer' }}
              >
                <p className={'dashboard-label'}>Today Trade</p>
                <p className={'dashboard-value'}>-1029301.02</p>
                <p>-25% Today ringgit</p>
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
                     style={{ userSelect: 'none', cursor: 'pointer' }}
              >
                <p className={'dashboard-label'}>7 Day Trade</p>
                <p className={'dashboard-value'}>-1029301.02</p>
                <p>-25% Today ringgit</p>
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
                     style={{ userSelect: 'none', cursor: 'pointer' }}
              >
                <p className={'dashboard-label'}>30 Day Trade</p>
                <p className={'dashboard-value'}>-1029301.02</p>
                <p>-25% Today ringgit</p>
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
              <Stack pt={'34px'} px={['10px', '40px', '100px']}>
                <MainButton
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

      </BaseModal>
    </Popup>
  )
}

export default ShareMyDealModal