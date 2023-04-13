import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MainButton from "../../../components/MainButton/MainButton";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import useNEST from "../../../hooks/useNEST";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import FuturesTableTitle from "../Components/TableTitle";
import useTheme from "../../../hooks/useTheme";
import useWindowWidth from "../../../hooks/useWindowWidth";

const Mine = () => {
  const {account} = useNEST()
  const {messageSnackBar} = useNESTSnackBar()
  const {nowTheme} = useTheme()
  const {isBigMobile} = useWindowWidth()

  const PCOrderRow = (item: any, index: number) => {
    return (
      <TableRow key={index} sx={(theme) => ({
        ":hover": {
          background: theme.normal.bg1,
        }
      })}>
        <TableCell>
          <div>@dddd</div>
        </TableCell>
        <TableCell>
          <div>0xsjdkekwod</div>
        </TableCell>
        <TableCell>
          <div>278229</div>
        </TableCell>
        <TableCell>
          <div>232</div>
        </TableCell>
      </TableRow>
    )
  }

  const MobileOrderCard = (item: any, index: number) => {
    return (
      <Stack spacing={'4px'} p={'20px 16px'} sx={(theme) => ({
        background: theme.normal.bg1,
        borderRadius: '12px',
      })}>
        <Box sx={(theme) => ({
          fontSize: '14px',
          lineHeight: '20px',
          color: theme.normal.text0,
          fontWeight: 700,
        })}>
          @murtaza
        </Box>
        <Box sx={(theme) => ({
          fontSize: '12px',
          lineHeight: '16px',
          color: theme.normal.text2,
          fontWeight: 400,
          borderBottom: `1px solid ${theme.normal.border}`,
          paddingBottom: '8px',
        })}>
          0xsjdkekwod
        </Box>
        <Stack direction={'row'} justifyContent={'space-between'} pt={'8px'}>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              Total rewards
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              6418.00 USDT
            </Box>
          </Stack>
          <Stack spacing={'4px'} width={'100%'}>
            <Box sx={(theme) => ({
              fontSize: '12px',
              lineHeight: '16px',
              color: theme.normal.text2,
              fontWeight: 400,
            })}>
              Week rewards
            </Box>
            <Box sx={(theme) => ({
              fontSize: '14px',
              lineHeight: '20px',
              color: theme.normal.text0,
              fontWeight: 700,
            })}>
              6418.00 USDT
            </Box>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack alignItems={"center"} width={'100%'}>
      {/*TODO: (option show)*/}
      <Stack direction={'row'} width={'100%'} justifyContent={"center"} spacing={'32px'} sx={(theme) => ({
        color: theme.normal.text0,
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '22px',
        background: '#1F2329',
        borderBottom: `1px solid ${theme.normal.border}`,
        borderTop: `1px solid ${theme.normal.border}`,
      })}>
        <Stack sx={(theme) => ({
          paddingY: '11px',
          alignItems: 'center',
          width: isBigMobile ? '100%' : 'auto',
          a: {
            color: theme.normal.text0,
            cursor: 'pointer',
            '&:hover': {
              color: theme.normal.primary,
            }
          }
        })}>
          <a href={'/#/dashboard'}>Dashboard</a>
        </Stack>
        <Stack sx={(theme) => ({
          paddingY: '11px',
          alignItems: 'center',
          width: isBigMobile ? '100%' : 'auto',
          borderBottom: `2px solid ${theme.normal.primary}`,
          a: {
            color: theme.normal.primary,
            cursor: 'pointer',
            '&:hover': {
              color: theme.normal.primary,
            }
          }
        })}>
          <a href={'/#/dashboard/mine'}>我的管理</a>
        </Stack>
      </Stack>
      <Stack maxWidth={'1600px'} px={['0', '0', '20px']} width={'100%'} spacing={['20px', '20px', '40px']}
             py={['20px', '20px', '40px']}>
        <Stack spacing={'40px'} sx={(theme) => ({
          width: '100%',
          padding: '20px',
          border: isBigMobile ? '' : `1px solid ${theme.normal.border}`,
          borderRadius: '12px',
        })}>
          {
            isBigMobile ? (
              <Stack direction={'row'} alignItems={"center"} spacing={'8px'}>
                <Box sx={(theme) => ({
                  color: theme.normal.text0,
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '22px',
                })}>
                  @muridh
                </Box>
                <Box sx={(theme) => ({
                  color: theme.normal.text2,
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                })}>
                  {account.address?.toString().showAddress()}
                </Box>
                <Box>
                  Copy
                </Box>
              </Stack>
            ) : (
              <Stack direction={'row'} width={'100%'} justifyContent={"space-between"} alignItems={"center"}>
                <Stack spacing={'20px'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                  })}>
                    账户总览
                  </Box>
                  <Stack direction={'row'} alignItems={"center"} spacing={'12px'}>
                    <Box sx={(theme) => ({
                      color: theme.normal.text0,
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '32px',
                    })}>
                      @murphy
                    </Box>
                    <Box sx={(theme) => ({
                      color: theme.normal.text2,
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '22px',
                    })}>
                      {account.address?.toString().showAddress()}
                    </Box>
                    <div>
                      copy
                    </div>
                  </Stack>
                </Stack>
                <Box py={'4px'}>
                  <MainButton
                    style={{
                      padding: '0px 12px',
                      height: '36px',
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '16px',
                    }}
                    title={'Copy Invitation Link'}
                    disable={!account?.address}
                    onClick={() => {
                      if (!account?.address) return;
                      const link = 'https://finance.nestprotocol.org/?a=' + account.address.slice(-8).toLowerCase()
                      copy(link);
                      messageSnackBar("Copy Successfully");
                    }}/>
                </Box>
              </Stack>
            )
          }
          {
            !isBigMobile && (
              <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} spacing={'16px'}>
                <Stack spacing={'12px'} sx={(theme) => ({
                  width: '100%',
                  color: theme.normal.text0,
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '40px',
                  'span': {
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                  },
                  padding: '40px',
                  background: theme.normal.bg1,
                  borderRadius: '12px'
                })}>
                  <div>12,564,897.00 NEST</div>
                  <span>Total Rewards</span>
                </Stack>
                <Stack spacing={'12px'} sx={(theme) => ({
                  width: '100%',
                  color: theme.normal.text0,
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '40px',
                  'span': {
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                  },
                  padding: '40px',
                  background: theme.normal.bg1,
                  borderRadius: '12px'
                })}>
                  <div>12,564,897.00 NEST</div>
                  <span>Total Rewards</span>
                </Stack>
                <Stack spacing={'12px'} sx={(theme) => ({
                  width: '100%',
                  color: theme.normal.text0,
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '40px',
                  'span': {
                    color: theme.normal.text2,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                  },
                  padding: '40px',
                  background: theme.normal.bg1,
                  borderRadius: '12px'
                })}>
                  <div>12,564,897.00 NEST</div>
                  <span>Total Rewards</span>
                </Stack>
              </Stack>
            )
          }
          <Stack>
            <Stack width={'100%'} height={'200px'} bgcolor={'red'}>
            </Stack>
          </Stack>
          {
            isBigMobile && (
              <Stack sx={(theme) => ({
                background: theme.normal.bg1,
                borderRadius: '12px',
                padding: '20px 12px',
              })} spacing={'20px'}>
                <Stack spacing={'4px'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                  })}>
                    Total Rewards
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                  })}>
                    12,564,897.00 NEST
                  </Box>
                </Stack>
                <Box sx={(theme) => ({
                  borderBottom: `1px solid ${theme.normal.border}`,
                })}>
                </Box>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    Not Settled
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    3922 USDT
                  </Box>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                  })}>
                    Total Number
                  </Box>
                  <Box sx={(theme) => ({
                    color: theme.normal.text0,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 700,
                  })}>
                    3922 USDT
                  </Box>
                </Stack>
                <Stack width={'100%'} alignItems={'end'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text1,
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontWeight: 400,
                    padding: '8px 12px',
                    background: theme.normal.bg3,
                    borderRadius: '16px 0 16px 16px',
                  })}>
                    {/*TODO*/}
                    有233人从未交易过
                  </Box>
                </Stack>
                <MainButton title={'Copy Invitation Link'} onClick={() => {
                }}/>
              </Stack>
            )
          }
        </Stack>
        <Stack width={'100%'} spacing={'24px'}>
          {
            isBigMobile ? (
              <Stack px={'20px'} spacing={'12px'}>
                <Stack pb={'4px'} direction={'row'} color={'white'} justifyContent={'space-between'}>
                  <Stack width={'100%'}>5th</Stack>
                  <Stack width={'100%'}>按本周佣金</Stack>
                </Stack>
                <MobileOrderCard item={''} index={1}/>
                <MobileOrderCard item={''} index={1}/>
                <MobileOrderCard item={''} index={1}/>
              </Stack>
            ) : (
              <>
                <Stack direction={'row'} justifyContent={'space-between'} px={'20px'} sx={(theme) => ({
                  color: theme.normal.text0,
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '22px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.normal.border}`,
                })}>
                  <div>
                    跟单名单
                  </div>
                  <div>
                    日期选择
                  </div>
                </Stack>
                <FuturesTableTitle
                  dataArray={[
                    "Name",
                    "Wallet",
                    "Total rewards",
                    "Week rewards",
                  ]}
                  noOrder={false}
                >
                  <PCOrderRow item={''} index={1}/>
                </FuturesTableTitle>
                <Stack direction={'row'} spacing={'10px'} justifyContent={'end'} px={'20px'}>
                  <MainButton title={'<'} onClick={() => {

                  }} style={{
                    width: '32px', height: '32px', fontSize: '14px', fontWeight: 400, borderRadius: '8px',
                    background: nowTheme.normal.bg1, color: nowTheme.normal.text2
                  }}/>
                  <MainButton title={'1'} onClick={() => {

                  }} style={{
                    width: '32px', height: '32px', fontSize: '14px', fontWeight: 400, borderRadius: '8px',
                    background: nowTheme.normal.bg1, color: nowTheme.normal.text2
                  }}/>
                  <MainButton title={'2'} onClick={() => {

                  }} style={{
                    width: '32px', height: '32px', fontSize: '14px', fontWeight: 400, borderRadius: '8px',
                    background: nowTheme.normal.bg1, color: nowTheme.normal.text2
                  }}/>
                  <MainButton title={'>'} onClick={() => {

                  }} style={{
                    width: '32px', height: '32px', fontSize: '14px', fontWeight: 400, borderRadius: '8px',
                    background: nowTheme.normal.bg1, color: nowTheme.normal.text2
                  }}/>
                </Stack>
              </>
            )
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Mine