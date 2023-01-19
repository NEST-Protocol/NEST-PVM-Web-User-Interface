import {FC, useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import MainCard from "../../components/MainCard";
import MainButton from "../../components/MainButton";
import "./styles";
import ShareMyDealModal from "./ShareMyDealModal";
import {checkWidth} from "../../libs/utils";
import useWeb3 from "../../libs/hooks/useWeb3";
import axios from "axios"
import FuturesList from "./FuturesList";
import FuturesListMobile from "./FuturesListMobile";
import TVChart from "./TVChart";
import {DownIcon, TipsIcon, UpIcon} from "../../components/Icon";

const Dashboard: FC = () => {
  const [showHold, setShowHold] = useState(true);
  const isPC = checkWidth();
  const { account } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [destoryData, setDestoryData] = useState({
    dayDestroy: 0,
    totalDestroy: 0,
  })
  const [myTxInfo, setMyTxInfo] = useState({
    totalValue: 0,
    todayValue: 0,
    day7Value: 0,
    day30Value: 0,
    todayRate: 0,
    day7Rate: 0,
    day30Rate: 0,
  })
  const [historyList, setHistoryList] = useState<{
    owner: string,
    leverage: string,
    orientation: string,
    actualRate: number,
    index: number,
    openPrice: number,
    tokenPair: string,
    actualMargin: number,
    initialMargin: number,
    lastPrice: number,
  }[]>([])
  const [positionList, setPositionList] = useState<{
    owner: string,
    leverage: string,
    orientation: string,
    actualRate: number,
    index: number,
    openPrice: number,
    tokenPair: string,
    actualMargin: number,
    initialMargin: number,
    lastPrice?: number,
  }[]>([])
  const [showMore, setShowMore] = useState(false)

  const fetchDestory = useCallback(async () => {
    try {
      const res = await axios({
        method: 'get',
        url: 'https://api.nestfi.net/api/dashboard/destory',
      })
      if (res.data) {
        setDestoryData(res.data.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const fetchMyTxInfo = useCallback(async () => {
    if (!account) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        url: `https://api.nestfi.net/api/dashboard/myTx/info?address=${account}`,
      })
      if (res.data) {
        setMyTxInfo(res.data.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [account])

  const fetchHistoryList = useCallback(async () => {
    if (!account) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        // url: `https://api.nestfi.net/api/dashboard/history/list?address=${account}`,
        url: `https://api.nestfi.net/api/dashboard/history/list?address=0x481a74d43ae3A7BdE38B7fE36E46CF9a6cbb4F39`,
      })
      if (res.data) {
        setHistoryList(res.data.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [account])

  const fetchPositionList = useCallback(async () => {
    if (!account) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        // url: `https://api.nestfi.net/api/dashboard/position/list?address=${account}`,
        url: `https://api.nestfi.net/api/dashboard/position/list?address=0x481a74d43ae3A7BdE38B7fE36E46CF9a6cbb4F39`,
      })
      if (res.data) {
        setPositionList(res.data.value)
      }
    } catch (e) {
      console.log(e)
    }
  }, [account])

  useEffect(() => {
    fetchDestory()
  }, [fetchDestory])

  useEffect(() => {
    fetchMyTxInfo()
  }, [fetchMyTxInfo])

  useEffect(() => {
    fetchHistoryList()
  }, [fetchHistoryList])

  useEffect(() => {
    fetchPositionList()
  }, [fetchPositionList])

  return (
    <Stack alignItems={"center"} width={'100%'}>
      <Stack paddingTop={['10px', '22px']} spacing={{ xs: '10px', sm: '22px'}} paddingX={['10px', '45px']} width={'100%'} maxWidth={['100%', '1366px']}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: '10px', sm: '22px'}}>
          <MainCard classNames={'dashboard-card'}>
            <Stack alignItems={"center"} justifyContent={"center"} height={['100px', "210px"]} spacing={['4px', '18px']}>
              <p className={'dashboard-label'}>NEST Total Destruction</p>
              <p className={'dashboard-value'}>{destoryData.totalDestroy.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
            </Stack>
          </MainCard>
          <MainCard classNames={'dashboard-card'}>
            <Stack alignItems={"center"} justifyContent={"center"} height={['100px', "210px"]} spacing={['4px', '18px']}>
              <p className={'dashboard-label'}>NEST Today Destruction</p>
              <p className={'dashboard-value'}>{destoryData.dayDestroy.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
            </Stack>
          </MainCard>
        </Stack>
        <MainCard>
          <Stack padding={['15px','28px']} height={['240px', '440px']} spacing={['24px', '28px']}>
            <p className={'dashboard-label'}>Total Transaction Volume</p>
            <TVChart />
          </Stack>
        </MainCard>
        <MainCard>
          <Stack padding={['15px', '28px']} spacing={{ xs: '10px', sm: '22px'}}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} pb={['10px', '0px']}>
              <Stack direction={'row'} spacing={['8px', '16px']} alignItems={"center"}>
                <p className={'dashboard-label'}>My Deal</p>
                <TipsIcon />
              </Stack>

              <Stack direction={'row'} spacing={['15px', '30px']}>
                <MainButton onClick={() => {
                  if (account) {
                    navigator.clipboard.writeText( 'https://finance.nestprotocol.org/#/futures?a=' + account.slice(-8) || '').then(() => {
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 1000)
                    });
                  } else {
                    navigator.clipboard.writeText( 'https://finance.nestprotocol.org/#/futures').then(() => {
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 1000)
                    });
                  }
                }}>
                  { copied ? 'Copied success!' : 'Copy Invitation Link' }
                </MainButton>
                <ShareMyDealModal value={myTxInfo}/>
              </Stack>
            </Stack>
            <MainCard classNames={'dashboard-card'}>
              <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                <p className={'dashboard-label'}>Total Trade</p>
                <p className={'dashboard-value'}>{myTxInfo.totalValue.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
              </Stack>
            </MainCard>
            <Stack spacing={{ xs: '10px', sm: '22px'}} direction={{ xs: 'column', sm: 'column', md: 'row' }}>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>Day Trade</p>
                  <p className={'dashboard-value'}>{myTxInfo.todayValue > 0 && <UpIcon/>} {myTxInfo.todayValue < 0 && <DownIcon/>} {myTxInfo.todayValue.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
                  <p className={'dashboard-caption'}>{myTxInfo.todayRate}% Today ringgit</p>
                </Stack>
              </MainCard>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>7 Day Trade</p>
                  <p className={'dashboard-value'}>{myTxInfo.day7Value > 0 && <UpIcon/>} {myTxInfo.day7Value < 0 && <DownIcon/>} {myTxInfo.day7Value.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
                  <p className={'dashboard-caption'}>{myTxInfo.day7Rate}% Today ringgit</p>
                </Stack>
              </MainCard>
              <MainCard classNames={'dashboard-card'}>
                <Stack height={['100px', '200px']} alignItems={"center"} justifyContent={"center"} spacing={['4px', '10px']}>
                  <p className={'dashboard-label'}>30 Day Trade</p>
                  <p className={'dashboard-value'}>{myTxInfo.day30Value > 0 && <UpIcon/>} {myTxInfo.day30Value < 0 && <DownIcon/>} {myTxInfo.day30Value.toLocaleString('en-US',{maximumFractionDigits: 2})}</p>
                  <p className={'dashboard-caption'}>{myTxInfo.day30Rate}% Today ringgit</p>
                </Stack>
              </MainCard>
            </Stack>
            {
              isPC && (
                <>
                  <Stack direction={'row'}>
                    <MainButton className={`dashboard-leftButton ${showHold ? '' : 'outline'}`} onClick={() => {
                      setShowHold(true);
                    }}>
                      Hold
                    </MainButton>
                    <MainButton className={`dashboard-rightButton ${!showHold ? '' : 'outline'}`} onClick={() => {
                      setShowHold(false);
                    }}>
                      History
                    </MainButton>
                  </Stack>
                  <table className={`dashboard-table`}>
                    <thead>
                    <tr className={`Futures-table-title`}>
                      <th>Token Pair</th>
                      <th>Type</th>
                      <th>Leverage</th>
                      <th>Initial Margin</th>
                      <th>Open Price</th>
                      <th>Actual Margin</th>
                      <th>Operate</th>
                    </tr>
                    </thead>
                    <tbody>
                    { showHold && positionList.filter((item, index) => {
                      if (showMore) {
                        return true;
                      }
                      return index < 5;
                    } ).map((item, index) => (
                      <FuturesList item={item} key={index} className={'Futures'}/>
                    )) }
                    { !showHold && historyList.filter((item, index) => {
                      if (showMore) {
                        return true;
                      }
                      return index < 5;
                    } ).map((item, index) => (
                      <FuturesList item={item} key={index} className={'Futures'}/>
                    )) }
                    </tbody>
                  </table>
                  <Stack alignItems={"center"}>
                    <button className={'dashboard-button-more'} onClick={() => setShowMore(!showMore)}>
                      { showMore ? 'Less' : 'More' }
                    </button>
                  </Stack>
                </>
              )
            }
          </Stack>
        </MainCard>
        { !isPC && (
          <Stack direction={"row"} spacing={'28px'} px={'28px'} pt={'10px'} pb={'10px'}>
            <button className={`dashboard-leftButton ${showHold ? '' : 'outline'}`} onClick={() => {
              setShowHold(true);
            }}>
              Hold
            </button>
            <button className={`dashboard-rightButton ${!showHold ? '' : 'outline'}`} onClick={() => {
              setShowHold(false);
            }}>
              History
            </button>
          </Stack>
        ) }
        { !isPC && (
          <>
            {
               showHold ? (
                 <>
                   {
                     positionList.filter((item, index) => {
                       if (showMore) {
                         return true;
                       }
                       return index < 5;
                     } ).map((item, index) => (
                       <FuturesListMobile item={item} key={index} className={'Futures'}/>
                     ))
                   }
                 </>
               ) : (
                 <>
                   {
                     historyList.filter((item, index) => {
                       if (showMore) {
                         return true;
                       }
                       return index < 5;
                     } ).map((item, index) => (
                       <FuturesListMobile item={item} key={index} className={'Futures'}/>
                     ))
                   }
                 </>
               )
            }
            <Stack alignItems={"center"}>
              <button className={'dashboard-button-more'} onClick={() => setShowMore(!showMore)}>
                { showMore ? 'Less' : 'More' }
              </button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default Dashboard;