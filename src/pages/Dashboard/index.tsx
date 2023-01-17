import {FC, useState} from "react";
import {Stack} from "@mui/material";
import MainCard from "../../components/MainCard";
import MainButton from "../../components/MainButton";
import "./styles";
import ShareMyDealModal from "./ShareMyDealModal";
import {checkWidth} from "../../libs/utils";

const Dashboard: FC = () => {
  // 获取销毁接口: GET http://api.nestfi.net/api/dashboard/destory
  // 每日交易折线图: GET http://api.nestfi.net/api/dashboard/txVolume/list
  // 交易历史: GET http://api.nestfi.net/api/dashboard/history/list?address=0x481a74d43ae3A7BdE38B7fE36E46CF9a6cbb4F39
  // 盈亏: GET http://api.nestfi.net/api/dashboard/myTx/info?address=0x481a74d43ae3A7BdE38B7fE36E46CF9a6cbb4F39
  const [showHold, setShowHold] = useState(true)
  const isPC = checkWidth();

  return (
    <Stack alignItems={"center"} width={'100%'}>
      <Stack paddingTop={['10px', '22px']} spacing={{ xs: '10px', sm: '22px'}} paddingX={['10px', '45px']} width={'100%'} maxWidth={['100%', '1366px']}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: '10px', sm: '22px'}}>
          <MainCard classNames={'dashboard-card'}>
            <Stack alignItems={"center"} justifyContent={"center"} height={['100px', "210px"]} spacing={['4px', '18px']}>
              <p className={'dashboard-label'}>NEST Total Destruction</p>
              <p className={'dashboard-value'}>-1029301.02</p>
            </Stack>
          </MainCard>
          <MainCard classNames={'dashboard-card'}>
            <Stack alignItems={"center"} justifyContent={"center"} height={['100px', "210px"]} spacing={['4px', '18px']}>
              <p className={'dashboard-label'}>NEST Today Destruction</p>
              <p className={'dashboard-value'}>-1029301.02</p>
            </Stack>
          </MainCard>
        </Stack>
        <MainCard>
          <Stack padding={['15px','28px']} height={['240px', '440px']} spacing={['24px', '28px']}>
            <p className={'dashboard-label'}>Total Transaction Volume</p>
            <Stack width={'100%'} height={'100%'} style={{background: '#EEEEEE'}} borderRadius={'20px'}>
            </Stack>
          </Stack>
        </MainCard>
        <MainCard>
          <Stack padding={['15px', '28px']} spacing={{ xs: '10px', sm: '22px'}}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} pb={['10px', '0px']}>
              <p className={'dashboard-label'}>My Deal</p>
              <Stack direction={'row'} spacing={['15px', '30px']}>
                <MainButton>
                  Copy Invitation Link
                </MainButton>
                <ShareMyDealModal/>
              </Stack>
            </Stack>
            <MainCard classNames={'dashboard-card'}>
              <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                <p className={'dashboard-label'}>Total Trade</p>
                <p className={'dashboard-value'}>-1029392.2</p>
              </Stack>
            </MainCard>
            <Stack spacing={{ xs: '10px', sm: '22px'}} direction={{ xs: 'column', sm: 'column', md: 'row' }}>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>Total Trade</p>
                  <p className={'dashboard-value'}>-1029392.2</p>
                  <p className={'dashboard-caption'}>-25% Today ringgit</p>
                </Stack>
              </MainCard>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>7 Day Trade</p>
                  <p className={'dashboard-value'}>-1029392.2</p>
                  <p className={'dashboard-caption'}>-25% Today ringgit</p>
                </Stack>
              </MainCard>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>30 Day Trade</p>
                  <p className={'dashboard-value'}>-1029392.2</p>
                  <p className={'dashboard-caption'}>-25% Today ringgit</p>
                </Stack>
              </MainCard>
            </Stack>
            {
              isPC && (
                <>
                  <Stack direction={'row'}>
                    <MainButton className={`dashboard-leftButton ${showHold ? '' : 'outline'}`} onClick={() => setShowHold(true)}>
                      Hold
                    </MainButton>
                    <MainButton className={`dashboard-rightButton ${showHold ? 'outline' : ''}`} onClick={() => setShowHold(false)}>
                      History
                    </MainButton>
                  </Stack>
                  <MainCard>
                    <Stack paddingX={'55px'} height={'60px'} direction={'row'} justifyContent={"space-between"}
                           alignItems={"center"}>
                      <p className={'dashboard-label'}>Token Pair</p>
                      <p className={'dashboard-label'}>Type</p>
                      <p className={'dashboard-label'}>Leverage</p>
                      <p className={'dashboard-label'}>Initial Margin</p>
                      <p className={'dashboard-label'}>Open Price</p>
                      <p className={'dashboard-label'}>Actual Margin</p>
                      <p className={'dashboard-label'}>Operate</p>
                    </Stack>
                  </MainCard>
                </>
              )
            }
          </Stack>
        </MainCard>
      </Stack>
    </Stack>
  )
}

export default Dashboard;