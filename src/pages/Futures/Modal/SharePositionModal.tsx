// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Modal from "@mui/material/Modal";
// import Stack from "@mui/material/Stack";
// import {styled} from "@mui/material/styles";
// import {FC, useCallback, useEffect, useMemo, useState} from "react";
// import {Back, Close, Edit, Long, Short} from "../../../components/icons";
// import MainButton from "../../../components/MainButton/MainButton";
// import NESTLine from "../../../components/NESTLine";
// import NormalInfo from "../../../components/NormalInfo/NormalInfo";
// import NESTInputSelect from "../../../components/NormalInput/NESTInputSelect";
// import {INPUT_TOKENS} from "../../../hooks/useFuturesNewOrder";
// import useFuturesNewOrder from "../../../hooks/useFuturesNewOrder";
// import useWindowWidth from "../../../hooks/useWindowWidth";
// import {getQueryVariable} from "../../../lib/queryVaribale";
// import {FuturesPrice} from "../Futures";
// import TriggerRiskModal from "./LimitAndPriceModal";
// import ApproveNoticeModal from "./ApproveNoticeModal";
// import useNEST from "../../../hooks/useNEST";
// import useReadTokenBalance from "../../../contracts/Read/useReadTokenContract";
// import useReadSwapAmountOut from "../../../contracts/Read/useReadSwapContract";
// import {BigNumber} from "ethers/lib/ethers";
// import LinkButton from "../../../components/MainButton/LinkButton";
// import LeverageSlider from "../Components/LeverageSlider";
// import NormalInput from "../../../components/NormalInput/NormalInput";
// import ErrorLabel from "../../../components/ErrorLabel/ErrorLabel";
// import {Trans, t} from "@lingui/macro";

// interface SharePositionModalProps {
//   open: boolean;
//   price: FuturesPrice | undefined;
//   onClose: () => void;
// }

// const SharePositionModal: FC<SharePositionModalProps> = ({...props}) => {
//   const [isEdit, setIsEdit] = useState(false);
//   const {account, chainsData} = useNEST();
//   const {isMobile} = useWindowWidth();
//   const [setToken, setSetToken] = useState(false);
//   const tokenName_info = useMemo(() => {
//     return getQueryVariable("pt");
//   }, []);
//   const orientation_info = useMemo(() => {
//     return getQueryVariable("po") === "0" ? false : true;
//   }, []);
//   const lever_info = useMemo(() => {
//     return getQueryVariable("pl");
//   }, []);
//   const basePrice_info = useMemo(() => {
//     return getQueryVariable("pp");
//   }, []);
//   const tp_info = useMemo(() => {
//     return getQueryVariable("pst");
//   }, []);
//   const sl_info = useMemo(() => {
//     return getQueryVariable("psl");
//   }, []);
//   const NESTTokenAddress = useMemo(() => {
//     const token = "NEST".getToken();
//     if (token && chainsData.chainId) {
//       return token.address[chainsData.chainId];
//     } else {
//       return undefined;
//     }
//   }, [chainsData.chainId]);
//   const USDTTokenAddress = useMemo(() => {
//     const token = "USDT".getToken();
//     if (token && chainsData.chainId) {
//       return token.address[chainsData.chainId];
//     } else {
//       return undefined;
//     }
//   }, [chainsData.chainId]);
//   const {balance: nestBalance} = useReadTokenBalance(
//     (NESTTokenAddress ?? String().zeroAddress) as `0x${string}`,
//     account.address ?? ""
//   );
//   const {balance: usdtBalance} = useReadTokenBalance(
//     (USDTTokenAddress ?? String().zeroAddress) as `0x${string}`,
//     account.address ?? ""
//   );
//   const {uniSwapAmountOut} = useReadSwapAmountOut(usdtBalance, [
//     USDTTokenAddress!,
//     NESTTokenAddress!,
//   ]);
//   const {
//     longOrShort,
//     setLongOrShort,
//     setTabsValue,
//     showToSwap,
//     lever,
//     setLever,
//     limitAmount,
//     setLimitAmount,
//     setIsStop,
//     tp,
//     setTp,
//     sl,
//     setSl,
//     showBalance,
//     maxCallBack,
//     showFeeHoverText,
//     showFee,
//     showTotalPay,
//     mainButtonTitle,
//     mainButtonLoading,
//     mainButtonDis,
//     mainButtonAction,
//     checkBalance,
//     checkMinNEST,
//     showTriggerNotice,
//     setShowTriggerNotice,
//     triggerNoticeCallback,
//     inputToken,
//     setInputToken,
//     inputAmount,
//     setInputAmount,
//     showNESTPrice,
//     showPositions,
//     tpDefault,
//     slDefault,
//     showApproveNotice,
//     setShowApproveNotice,
//     approveNoticeCallBack,
//     showAmountError,
//     tpError,
//     slError,
//   } = useFuturesNewOrder(
//     props.price,
//     tokenName_info ? tokenName_info.toLocaleUpperCase() : "ETH"
//   );
//   const tokenPriceDecimals = useMemo(() => {
//     return tokenName_info ? tokenName_info.getTokenPriceDecimals() : 2;
//   }, [tokenName_info]);
//   const getOrderInfo = useCallback(() => {
//     setLongOrShort(orientation_info);
//     setTabsValue(1);
//     setLever(lever_info ? parseInt(lever_info) : 1);

//     setLimitAmount(
//       basePrice_info
//         ? (
//           parseFloat(basePrice_info) / Math.pow(10, tokenPriceDecimals)
//         ).toFixed(tokenPriceDecimals)
//         : ""
//     );
//     if (
//       (tp_info && parseInt(tp_info) !== 0) ||
//       (sl_info && parseInt(sl_info) !== 0)
//     ) {
//       setTp(
//         tp_info
//           ? (parseFloat(tp_info) / Math.pow(10, tokenPriceDecimals)).toFixed(
//             tokenPriceDecimals
//           )
//           : ""
//       );
//       setSl(
//         sl_info
//           ? (parseFloat(sl_info) / Math.pow(10, tokenPriceDecimals)).toFixed(
//             tokenPriceDecimals
//           )
//           : ""
//       );
//     }
//   }, [
//     basePrice_info,
//     lever_info,
//     orientation_info,
//     setLever,
//     setLimitAmount,
//     setLongOrShort,
//     setSl,
//     setTabsValue,
//     setTp,
//     sl_info,
//     tokenPriceDecimals,
//     tp_info,
//   ]);
//   useEffect(() => {
//     getOrderInfo();
//   }, [getOrderInfo]);
//   useEffect(() => {
//     if (tp === "" && sl === "") {
//       setIsStop(false);
//     } else {
//       setIsStop(true);
//     }
//   }, [setIsStop, sl, tp]);
//   useEffect(() => {
//     if (chainsData.chainId !== 534353) {
//       if (nestBalance && usdtBalance && !setToken) {
//         if (
//           BigNumber.from("0").eq(nestBalance) &&
//           BigNumber.from("0").eq(usdtBalance)
//         ) {
//           setInputToken("USDT");
//           setInputAmount("200");
//         } else if (
//           !BigNumber.from("0").eq(nestBalance) &&
//           BigNumber.from("0").eq(usdtBalance)
//         ) {
//           setInputToken("NEST");
//           setInputAmount("10000");
//         } else if (uniSwapAmountOut && uniSwapAmountOut[1].lt(nestBalance)) {
//           setInputToken("NEST");
//           setInputAmount("10000");
//         } else {
//           setInputToken("USDT");
//           setInputAmount("200");
//         }
//         setSetToken(true);
//       }
//     } else {
//       setInputToken("NEST");
//       setInputAmount("100");
//       setSetToken(true);
//     }
//   }, [
//     chainsData.chainId,
//     nestBalance,
//     setInputAmount,
//     setInputToken,
//     setToken,
//     uniSwapAmountOut,
//     usdtBalance,
//   ]);
//   const TopStack = useMemo(() => {
//     return styled(Stack)(({theme}) => {
//       return {
//         width: "100%",
//         marginBottom: 20,
//         "& button": {
//           width: 20,
//           height: 20,
//           "&:hover": {
//             cursor: "pointer",
//           },
//           "& svg": {
//             width: 20,
//             height: 20,
//             "& path": {
//               fill: theme.normal.text2,
//             },
//           },
//         },
//         "& .ModalLeftButton": {
//           width: 20,
//         },
//       };
//     });
//   }, []);
//   const title = useMemo(() => {
//     const BaseToken = "USDT".getToken()!.icon;
//     const TokenIcon = tokenName_info
//       ? tokenName_info.getToken()
//         ? tokenName_info.getToken()!.icon
//         : "ETH".getToken()!.icon
//       : "ETH".getToken()!.icon;

//     return isEdit ? (
//       <Box
//         sx={(theme) => ({
//           color: theme.normal.text0,
//           fontWeight: 700,
//           fontSize: 16,
//         })}
//         component={"p"}
//       >
//         <Trans>Edit</Trans>
//       </Box>
//     ) : (
//       <Stack
//         direction={"row"}
//         alignItems={"center"}
//         spacing={"8px"}
//         sx={() => ({
//           height: "24px",
//         })}
//       >
//         <Stack
//           direction={"row"}
//           sx={{"& svg": {width: "24px", height: "24px", display: "block"}}}
//         >
//           <TokenIcon style={{marginRight: "-8px", position: "relative"}}/>
//           <BaseToken/>
//         </Stack>

//         <Box
//           component={"p"}
//           sx={(theme) => ({
//             fontWeight: 700,
//             fontSize: 16,
//             color: theme.normal.text0,
//             marginLeft: "8px !important",
//           })}
//         >{`${tokenName_info}/USDT`}</Box>
//         <Divider
//           orientation="vertical"
//           sx={(theme) => ({
//             borderColor: theme.normal.border,
//             height: "16px",
//           })}
//         />
//         <Box
//           component={"p"}
//           sx={(theme) => ({
//             height: "20px",
//             paddingX: "4px",
//             textAlign: "center",
//             color: theme.normal.text2,
//             fontWeight: 400,
//             fontSize: 16,
//           })}
//         >{`${lever}X`}</Box>
//         <Divider
//           orientation="vertical"
//           sx={(theme) => ({
//             borderColor: theme.normal.border,
//             height: "16px",
//           })}
//         />

//         <Stack
//           direction={"row"}
//           justifyContent={"center"}
//           spacing={"4px"}
//           alignItems={"center"}
//           sx={(theme) => ({
//             height: "22px",
//             fontSize: 10,
//             fontWeight: 700,
//             color: longOrShort ? theme.normal.success : theme.normal.danger,
//             borderRadius: "4px",
//             paddingX: "4px",
//             background: longOrShort
//               ? theme.normal.success_light_hover
//               : theme.normal.danger_light_hover,
//             "& svg": {
//               width: "10px",
//               height: "10px",
//               display: "block",
//               "& path": {
//                 fill: longOrShort ? theme.normal.success : theme.normal.danger,
//               },
//             },
//           })}
//         >
//           {longOrShort ? <Long/> : <Short/>}
//           {longOrShort ? (
//             <p>
//               <Trans>Long</Trans>
//             </p>
//           ) : (
//             <p>
//               <Trans>Short</Trans>
//             </p>
//           )}
//         </Stack>
//       </Stack>
//     );
//   }, [isEdit, lever, longOrShort, tokenName_info]);
//   const info1 = useMemo(() => {
//     return (
//       <Stack spacing={"8px"}>
//         <NormalInfo
//           title={t`Limit Price`}
//           value={limitAmount}
//           symbol={"USDT"}
//         />
//         {tp !== "" ? (
//           <NormalInfo title={t`Take Profit`} value={tp} symbol={"USDT"}/>
//         ) : (
//           <></>
//         )}
//         {sl !== "" ? (
//           <NormalInfo title={t`Stop Loss`} value={sl} symbol={"USDT"}/>
//         ) : (
//           <></>
//         )}
//         <Stack
//           direction={"row"}
//           justifyContent={"flex-end"}
//           alignItems={"center"}
//           height={"20px"}
//         >
//           <LinkButton onClick={() => setIsEdit(true)}>
//             <Stack
//               direction={"row"}
//               spacing={"4px"}
//               justifyContent={"flex-end"}
//               alignItems={"center"}
//               sx={() => ({
//                 "& svg": {
//                   width: "12px",
//                   height: "12px",
//                 },
//                 "& p": {
//                   lineHeight: "20px",
//                   fontWeight: 400,
//                   fontSize: "14px",
//                 },
//               })}
//             >
//               <Edit/>
//               <p>
//                 <Trans>Edit</Trans>
//               </p>
//             </Stack>
//           </LinkButton>
//         </Stack>
//       </Stack>
//     );
//   }, [limitAmount, sl, tp]);

//   const info2 = useMemo(() => {
//     return (
//       <Stack spacing={"8px"} width={"100%"}>
//         <NormalInfo
//           title={t`Service Fee`}
//           value={showFee}
//           symbol={"NEST"}
//           help
//           helpInfo={
//             <Stack>
//               {showFeeHoverText.map((item, index) => (
//                 <p key={`Help + ${index}`}>{item}</p>
//               ))}
//             </Stack>
//           }
//         />
//         {inputToken === "USDT" ? (
//           <NormalInfo
//             title={t`Positions`}
//             value={showPositions}
//             symbol={"NEST"}
//           />
//         ) : (
//           <></>
//         )}
//         <NormalInfo title={t`Total Pay`} value={showTotalPay} symbol={"NEST"}/>
//       </Stack>
//     );
//   }, [inputToken, showFee, showFeeHoverText, showPositions, showTotalPay]);
//   const inputTokenArray = useMemo(() => {
//     return chainsData.chainId === 534353 ? [inputToken] : INPUT_TOKENS;
//   }, [chainsData.chainId, inputToken]);
//   const inputNestAmount = useMemo(() => {
//     return (
//       <NESTInputSelect
//         tokenName={inputToken}
//         tokenArray={inputTokenArray}
//         selectToken={(tokenName: string) => {
//           setInputAmount("");
//           setInputToken(tokenName);
//         }}
//         error={!checkBalance || checkMinNEST}
//         showToSwap={showToSwap}
//         showBalance={showBalance}
//         maxCallBack={maxCallBack}
//         nestAmount={inputAmount}
//         changeNestAmount={(value: string) =>
//           setInputAmount(value.formatInputNum4())
//         }
//         price={showNESTPrice}
//       />
//     );
//   }, [
//     checkBalance,
//     checkMinNEST,
//     inputAmount,
//     inputToken,
//     inputTokenArray,
//     maxCallBack,
//     setInputAmount,
//     setInputToken,
//     showBalance,
//     showNESTPrice,
//     showToSwap,
//   ]);

//   const modals = useMemo(() => {
//     return (
//       <>
//         <ApproveNoticeModal
//           open={showApproveNotice}
//           isSuccess={true}
//           onClose={() => setShowApproveNotice(false)}
//           callBack={approveNoticeCallBack}
//         />
//         <Modal
//           open={showTriggerNotice}
//           onClose={() => setShowTriggerNotice(false)}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box
//             sx={{
//               "& .ModalLeftButton": {width: "20px !important"},
//               " & .ModalTitle": {textAlign: "center !important"},
//             }}
//           >
//             <TriggerRiskModal
//               onClose={() => setShowTriggerNotice(false)}
//               callBack={triggerNoticeCallback}
//             />
//           </Box>
//         </Modal>
//       </>
//     );
//   }, [
//     approveNoticeCallBack,
//     setShowApproveNotice,
//     setShowTriggerNotice,
//     showApproveNotice,
//     showTriggerNotice,
//     triggerNoticeCallback,
//   ]);

//   const normalView = useMemo(() => {
//     return (
//       <>
//         <Stack spacing={"24px"} width={"100%"}>
//           <Stack spacing={"8px"} width={"100%"}>
//             {inputNestAmount}
//             {showAmountError ? <ErrorLabel title={showAmountError}/> : <></>}
//           </Stack>
//           {info1}
//           <NESTLine/>
//           {info2}
//           <MainButton
//             title={mainButtonTitle}
//             disable={mainButtonDis}
//             isLoading={mainButtonLoading}
//             onClick={mainButtonAction}
//             style={{
//               height: "48px",
//               fontSize: 16,
//             }}
//           />
//         </Stack>
//       </>
//     );
//   }, [
//     info1,
//     info2,
//     inputNestAmount,
//     mainButtonAction,
//     mainButtonDis,
//     mainButtonLoading,
//     mainButtonTitle,
//     showAmountError,
//   ]);

//   const editView = useMemo(() => {
//     return (
//       <Stack spacing={"24px"} width={"100%"}>
//         <Stack spacing={"16px"} width={"100%"}>
//           <LeverageSlider
//             value={lever}
//             changeValue={(value: number) => setLever(value)}
//           />

//           <Stack spacing={"8px"} width={"100%"}>
//             <Box
//               sx={(theme) => ({
//                 fontWeight: 400,
//                 fontSize: 12,
//                 color: theme.normal.text2,
//               })}
//             >
//               <Trans>Limit Price</Trans>
//             </Box>

//             <NormalInput
//               placeHolder={""}
//               rightTitle={"USDT"}
//               value={limitAmount}
//               changeValue={(value: string) =>
//                 setLimitAmount(value.formatInputNum())
//               }
//             />
//           </Stack>

//           <Stack spacing={"8px"} width={"100%"}>
//             <Box
//               sx={(theme) => ({
//                 fontWeight: 400,
//                 fontSize: 12,
//                 color: theme.normal.text2,
//               })}
//             >
//               <Trans>Take Profit</Trans>
//             </Box>

//             <NormalInput
//               placeHolder={tpDefault}
//               rightTitle={"USDT"}
//               value={tp}
//               error={tpError}
//               changeValue={(value: string) => setTp(value.formatInputNum())}
//             />
//           </Stack>

//           <Stack spacing={"8px"} width={"100%"}>
//             <Box
//               sx={(theme) => ({
//                 fontWeight: 400,
//                 fontSize: 12,
//                 color: theme.normal.text2,
//               })}
//             >
//               <Trans>Stop Loss</Trans>
//             </Box>

//             <NormalInput
//               placeHolder={slDefault}
//               rightTitle={"USDT"}
//               value={sl}
//               error={slError}
//               changeValue={(value: string) => setSl(value.formatInputNum())}
//             />
//           </Stack>

//           {tpError || slError ? (
//             <ErrorLabel
//               title={t`TP and SL price you set will trigger immediately.`}
//             />
//           ) : (
//             <></>
//           )}
//         </Stack>
//         <MainButton
//           title={t`Confirm`}
//           disable={tpError || slError}
//           isLoading={false}
//           onClick={() => {
//             if (tpError || slError) {
//               return;
//             }
//             setIsEdit(false);
//           }}
//           style={{
//             height: "48px",
//             fontSize: 16,
//           }}
//         />
//       </Stack>
//     );
//   }, [
//     lever,
//     limitAmount,
//     setLever,
//     setLimitAmount,
//     setSl,
//     setTp,
//     sl,
//     slDefault,
//     slError,
//     tp,
//     tpDefault,
//     tpError,
//   ]);

//   return (
//     <Modal
//       open={props.open}
//       onClose={() => props.onClose()}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box>
//         <Stack width={'100vw'} height={'100vh'} justifyContent={"center"} alignItems={"center"}>
//           <Stack justifyContent={"center"} alignItems={"center"} width={'100vw'} height={'100vh'}>
//             <Box sx={{
//               width: ["100%", "100%", "450px"],
//               padding: '20px',
//               maxHeight: '100vh',
//               overflow: 'scroll',
//             }}>
//               <Stack sx={(theme) => ({
//                 width: '100%',
//                 borderRadius: "12px",
//                 background: theme.normal.bg2,
//                 padding: "20px",
//               })} justifyContent="center" alignItems="center" spacing={0}>
//                 {modals}
//                 <TopStack
//                   direction={"row"}
//                   justifyContent="space-between"
//                   alignItems="center"
//                   spacing={0}
//                 >
//                   <button
//                     className="ModalLeftButton"
//                     onClick={() => {
//                       setSl("");
//                       setTp("");
//                       getOrderInfo();
//                       setIsEdit(false);
//                     }}
//                   >
//                     {isEdit ? <Back/> : <></>}
//                   </button>
//                   {title}
//                   <button onClick={props.onClose}>
//                     <Close/>
//                   </button>
//                 </TopStack>
//                 {isEdit ? editView : normalView}
//               </Stack>
//             </Box>
//           </Stack>
//         </Stack>
//       </Box>
//     </Modal>
//   );
// };

export const a = 0;
