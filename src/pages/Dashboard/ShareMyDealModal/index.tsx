import {FC, useRef, useState} from "react";
import BaseModal from "../../../components/BaseModal";
import Popup from "reactjs-popup";
import {Divider, Stack} from "@mui/material";
import MainButton from "../../../components/MainButton";

const ShareMyDealModal: FC = () => {
  const modal = useRef<any>();
  const [select, setSelect] = useState({
    totalTrade: true,
    todayTrade: false,
    _7DaysTrade: false,
    _30DaysTrade: false,
  })

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
        onClose={() => modal?.current?.close()}
        titleName={'Share'}
      >
        <Stack width={['360px', '480px', '600px']} textAlign={"center"} pt={'10px'}>
          <Divider/>
          <Stack height={'120px'} justifyContent={"center"} spacing={'10px'}
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
          <Stack height={'120px'} justifyContent={"center"} spacing={'10px'}
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
          <Stack height={'120px'} justifyContent={"center"} spacing={'10px'}
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
          <Stack height={'120px'} justifyContent={"center"} spacing={'10px'}
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
            <MainButton disable={!select.todayTrade && !select.totalTrade && !select._7DaysTrade && !select._30DaysTrade}>
              Confirm
            </MainButton>
          </Stack>
        </Stack>
      </BaseModal>
    </Popup>
  )
}

export default ShareMyDealModal