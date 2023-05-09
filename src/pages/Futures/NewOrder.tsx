import { FC, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import useWindowWidth from "../../hooks/useWindowWidth";
import LongOrShort from "../../components/LongOrShort/LongOrShort";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import MainButton from "../../components/MainButton/MainButton";
import useFuturesNewOrder, {
  INPUT_TOKENS,
} from "../../hooks/useFuturesNewOrder";
import Box from "@mui/material/Box";
import LeverageSlider from "./Components/LeverageSlider";
import NormalInput from "../../components/NormalInput/NormalInput";
import Agree from "../../components/Agree/Agree";
import NormalInfo from "../../components/NormalInfo/NormalInfo";
import { FuturesPrice } from "./Futures";
import Modal from "@mui/material/Modal";
import TriggerRiskModal from "./Modal/LimitAndPriceModal";
import NESTInputSelect from "../../components/NormalInput/NESTInputSelect";
import ApproveNoticeModal from "./Modal/ApproveNoticeModal";
import ErrorLabel from "../../components/ErrorLabel/ErrorLabel";

interface FuturesNewOrderProps {
  price: FuturesPrice | undefined;
  tokenPair: string;
}

const FuturesNewOrder: FC<FuturesNewOrderProps> = ({ ...props }) => {
  const { isBigMobile, isPC } = useWindowWidth();
  const {
    longOrShort,
    setLongOrShort,
    tabsValue,
    changeTabs,
    showToSwap,
    lever,
    setLever,
    limitAmount,
    setLimitAmount,
    isStop,
    setIsStop,
    tp,
    setTp,
    sl,
    setSl,
    showBalance,
    maxCallBack,
    showFeeHoverText,
    showOpenPrice,
    showFee,
    showTotalPay,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    checkBalance,
    checkMinNEST,
    showLiqPrice,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    inputToken,
    setInputToken,
    inputAmount,
    setInputAmount,
    showNESTPrice,
    showPositions,
    showApproveNotice,
    setShowApproveNotice,
    approveNoticeCallBack,
    showAmountError,
    tpDefault,
    slDefault,
    tpError,
    slError
  } = useFuturesNewOrder(props.price, props.tokenPair);
  const newOrderTabsData = useMemo(() => {
    return [<p>Market</p>, <p>Limit</p>];
  }, []);
  const inputNestAmount = useCallback(() => {
    return (
      <NESTInputSelect
        tokenName={inputToken}
        tokenArray={INPUT_TOKENS}
        selectToken={(tokenName: string) => {
          setInputAmount("");
          setInputToken(tokenName);
        }}
        error={!checkBalance || checkMinNEST}
        showToSwap={showToSwap}
        showBalance={showBalance}
        maxCallBack={maxCallBack}
        nestAmount={inputAmount}
        changeNestAmount={(value: string) =>
          setInputAmount(value.formatInputNum4())
        }
        price={showNESTPrice}
      />
    );
  }, [
    inputToken,
    checkBalance,
    checkMinNEST,
    showToSwap,
    showBalance,
    maxCallBack,
    inputAmount,
    showNESTPrice,
    setInputAmount,
    setInputToken,
  ]);

  const stopPrice = useCallback(() => {
    return (
      <Stack marginTop={"16px"}>
        <Stack direction={"row"} alignItems={"center"}>
          <Agree
            value={isStop}
            changeValue={(value: boolean) => {
              setTp("");
              setSl("");
              setIsStop(value);
            }}
          />{" "}
          <Box
            component={"button"}
            sx={(theme) => ({
              fontSize: 16,
              fontWeight: 700,
              marginLeft: "4px",
              color: theme.normal.text0,
            })}
            onClick={() => {
              setTp("");
              setSl("");
              setIsStop(!isStop);
            }}
          >
            Stop-Limit
          </Box>
        </Stack>
        {isStop ? (
          <Stack spacing={"12px"} width={"100%"} marginTop={"12px"}>
            <Stack spacing={"8px"} width={"100%"}>
              <Box
                component={"p"}
                sx={(theme) => ({
                  height: `16px`,
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: `16px`,
                  color: theme.normal.text2,
                })}
              >
                Take Profit
              </Box>
              <NormalInput
                placeHolder={tpDefault}
                rightTitle={"USDT"}
                value={tp}
                error={tpError}
                changeValue={(value: string) => setTp(value.formatInputNum())}
              />
            </Stack>
            <Stack spacing={"8px"} width={"100%"}>
              <Box
                component={"p"}
                sx={(theme) => ({
                  height: `16px`,
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: `16px`,
                  color: theme.normal.text2,
                })}
              >
                Stop Loss
              </Box>
              <NormalInput
                placeHolder={slDefault}
                rightTitle={"USDT"}
                value={sl}
                error={slError}
                changeValue={(value: string) => setSl(value.formatInputNum())}
              />
            </Stack>
            {(tpError || slError) ? <ErrorLabel title={"After the limit order is executed, TP and SL price you set will trigger immediately."}/> : <></>}
            
          </Stack>
        ) : (
          <></>
        )}
      </Stack>
    );
  }, [isStop, setIsStop, setSl, setTp, sl, slDefault, slError, tp, tpDefault, tpError]);

  const newOrderTabs = useMemo(() => {
    return (
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        sx={(theme) => ({
          height: "44px",
          width: "100%",
          borderBottom: `1px solid ${theme.normal.border}`,
          boxSizing: "border-box",
        })}
      >
        <NESTTabs
          value={tabsValue}
          className={"FuturesNewOrderTabs"}
          datArray={newOrderTabsData}
          height={44}
          space={24}
          selectCallBack={changeTabs}
        />
      </Stack>
    );
  }, [newOrderTabsData, changeTabs, tabsValue]);

  const info = useCallback(() => {
    return (
      <>
        {tabsValue === 0 ? (
          <>
            <NormalInfo
              title={"Entry Price"}
              value={showOpenPrice}
              symbol={"USDT"}
              // help
              // helpInfo={
              //   <Stack>
              //     {openPriceHelpInfo.map((item, index) => (
              //       <p key={`HelpOpenPrice + ${index}`}>{item}</p>
              //     ))}
              //   </Stack>
              // }
            />
            <NormalInfo
              title={"Liq Price"}
              value={showLiqPrice}
              symbol={"USDT"}
              style={{ marginTop: "8px" }}
            />
          </>
        ) : (
          <></>
        )}
        <NormalInfo
          title={"Service Fee"}
          value={showFee}
          symbol={"NEST"}
          style={{ marginTop: tabsValue === 0 ? "8px" : "16px" }}
          help
          helpInfo={
            <Stack>
              {showFeeHoverText.map((item, index) => (
                <p key={`Help + ${index}`}>{item}</p>
              ))}
            </Stack>
          }
        />
        {inputToken === "USDT" ? (
          <NormalInfo
            title={"Positions"}
            value={showPositions}
            symbol={"NEST"}
            style={{ marginTop: "8px" }}
          />
        ) : (
          <></>
        )}
        <NormalInfo
          title={"Total Pay"}
          value={showTotalPay}
          symbol={"NEST"}
          style={{ marginTop: "8px" }}
        />
      </>
    );
  }, [
    inputToken,
    showFee,
    showFeeHoverText,
    showLiqPrice,
    showOpenPrice,
    showPositions,
    showTotalPay,
    tabsValue,
  ]);
  const modals = useMemo(() => {
    return (
      <>
        <ApproveNoticeModal
          open={showApproveNotice}
          isSuccess={true}
          onClose={() => setShowApproveNotice(false)}
          callBack={approveNoticeCallBack}
        />
        <Modal
          open={showTriggerNotice}
          onClose={() => setShowTriggerNotice(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              "& .ModalLeftButton": { width: "20px !important" },
              " & .ModalTitle": { textAlign: "center !important" },
            }}
          >
            <TriggerRiskModal
              onClose={() => setShowTriggerNotice(false)}
              callBack={triggerNoticeCallback}
            />
          </Box>
        </Modal>
      </>
    );
  }, [
    approveNoticeCallBack,
    setShowApproveNotice,
    setShowTriggerNotice,
    showApproveNotice,
    showTriggerNotice,
    triggerNoticeCallback,
  ]);
  return (
    <Stack
      sx={(theme) => ({
        border: `${isBigMobile ? "none" : `1px solid ${theme.normal.border}`}`,
        width: isPC ? "450px" : "100%",
        borderRadius: "12px",
        paddingY: `${isBigMobile ? 0 : 32}px`,
        paddingX: "20px",
      })}
    >
      {modals}
      <LongOrShort
        value={longOrShort}
        changeValue={(value: boolean) => setLongOrShort(value)}
      />
      <Stack
        spacing={"16px"}
        sx={{ paddingX: "4px", paddingTop: "8px", paddingBottom: "16px" }}
      >
        {newOrderTabs}
        {tabsValue === 0 ? (
          <></>
        ) : (
          <Stack spacing={"8px"}>
            <Box
              component={"p"}
              sx={(theme) => ({
                height: `16px`,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: `16px`,
                color: theme.normal.text2,
              })}
            >
              Price
            </Box>
            <NormalInput
              placeHolder={""}
              rightTitle={"USDT"}
              value={limitAmount}
              changeValue={(value: string) =>
                setLimitAmount(value.formatInputNum())
              }
            />
          </Stack>
        )}
        <Stack spacing={"8px"} width={"100%"}>
          {inputNestAmount()}
          {showAmountError ? <ErrorLabel title={showAmountError} /> : <></>}
        </Stack>

        <LeverageSlider
          value={lever}
          changeValue={(value: number) => setLever(value)}
        />
        {stopPrice()}
        {info()}
      </Stack>
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ height: "48px", marginTop: isBigMobile ? "0px" : "24px" }}
      />
    </Stack>
  );
};

export default FuturesNewOrder;
