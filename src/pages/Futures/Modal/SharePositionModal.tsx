import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useEffect, useMemo, useState } from "react";
import { Close, Long, Short } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInfo from "../../../components/NormalInfo/NormalInfo";
import NESTInputSelect from "../../../components/NormalInput/NESTInputSelect";
import { INPUT_TOKENS } from "../../../hooks/useFuturesNewOrder";
import useFuturesNewOrder from "../../../hooks/useFuturesNewOrder";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { getQueryVariable } from "../../../lib/queryVaribale";
import { FuturesPrice } from "../Futures";
import ProtocolModal from "./ProtocolModal";
import TriggerRiskModal from "./LimitAndPriceModal";
import ApproveNoticeModal from "./ApproveNoticeModal";
import useNEST from "../../../hooks/useNEST";
import useReadTokenBalance from "../../../contracts/Read/useReadTokenContract";
import useReadSwapAmountOut from "../../../contracts/Read/useReadSwapContract";
import { BigNumber } from "ethers/lib/ethers";

interface SharePositionModalProps {
  open: boolean;
  price: FuturesPrice | undefined;
  onClose: () => void;
}

const SharePositionModal: FC<SharePositionModalProps> = ({ ...props }) => {
  const { account, chainsData } = useNEST();
  const { isMobile } = useWindowWidth();
  const [showApproveNotice, setShowApproveNotice] = useState(false);
  const [showApproveNoticeDone, setShowApproveNoticeDone] = useState(false);
  const tokenName_info = useMemo(() => {
    return getQueryVariable("pt");
  }, []);
  const orientation_info = useMemo(() => {
    return getQueryVariable("po") === "0" ? false : true;
  }, []);
  const lever_info = useMemo(() => {
    return getQueryVariable("pl");
  }, []);
  const basePrice_info = useMemo(() => {
    return getQueryVariable("pp");
  }, []);
  const tp_info = useMemo(() => {
    return getQueryVariable("pst");
  }, []);
  const sl_info = useMemo(() => {
    return getQueryVariable("psl");
  }, []);
  const NESTTokenAddress = useMemo(() => {
    const token = "NEST".getToken();
    if (token && chainsData.chainId) {
      return token.address[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId]);
  const USDTTokenAddress = useMemo(() => {
    const token = "USDT".getToken();
    if (token && chainsData.chainId) {
      return token.address[chainsData.chainId];
    } else {
      return undefined;
    }
  }, [chainsData.chainId]);
  const { balance: nestBalance } = useReadTokenBalance(
    (NESTTokenAddress ?? String().zeroAddress) as `0x${string}`,
    account.address ?? ""
  );
  const { balance: usdtBalance } = useReadTokenBalance(
    (USDTTokenAddress ?? String().zeroAddress) as `0x${string}`,
    account.address ?? ""
  );
  const { uniSwapAmountOut } = useReadSwapAmountOut(usdtBalance, [
    USDTTokenAddress!,
    NESTTokenAddress!,
  ]);
  const {
    longOrShort,
    setLongOrShort,
    setTabsValue,
    showToSwap,
    lever,
    setLever,
    limitAmount,
    setLimitAmount,
    setIsStop,
    tp,
    setTp,
    sl,
    setSl,
    showBalance,
    maxCallBack,
    showFeeHoverText,
    showFee,
    showTotalPay,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    checkBalance,
    showProtocol,
    setShowProtocol,
    protocolCallBack,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    inputToken,
    setInputToken,
    inputAmount,
    setInputAmount,
    showNESTPrice,
    showPositions,
    tokenAllowance,
    tokenApprove,
  } = useFuturesNewOrder(
    props.price,
    tokenName_info ? tokenName_info.toLocaleUpperCase() : "ETH"
  );
  useEffect(() => {
    setInputAmount("10000");
    setLongOrShort(orientation_info);
    setTabsValue(1);
    setLever(lever_info ? parseInt(lever_info) : 1);
    setLimitAmount(
      basePrice_info ? (parseFloat(basePrice_info) / 100).toFixed(2) : ""
    );
    if (
      (tp_info && parseInt(tp_info) !== 0) ||
      (sl_info && parseInt(sl_info) !== 0)
    ) {
      setIsStop(true);
      setTp(tp_info ? (parseFloat(tp_info) / 100).toFixed(2) : "");
      setSl(sl_info ? (parseFloat(sl_info) / 100).toFixed(2) : "");
    } else {
      setIsStop(false);
    }
    if (nestBalance && usdtBalance) {
      if (
        BigNumber.from("0").eq(nestBalance) &&
        BigNumber.from("0").eq(usdtBalance)
      ) {
        setInputToken("USDT");
        setInputAmount("200");
      } else if (uniSwapAmountOut && uniSwapAmountOut[1].lt(nestBalance)) {
        setInputToken("NEST");
        setInputAmount("10000");
      } else {
        setInputToken("USDT");
        setInputAmount("200");
      }
    }
    if (
      account.address &&
      !showApproveNoticeDone &&
      tokenAllowance &&
      BigNumber.from("0").eq(tokenAllowance)
    ) {
      setShowApproveNotice(true);
    }
  }, [
    account.address,
    basePrice_info,
    lever_info,
    nestBalance,
    orientation_info,
    setInputAmount,
    setInputToken,
    setIsStop,
    setLever,
    setLimitAmount,
    setLongOrShort,
    setSl,
    setTabsValue,
    setTp,
    showApproveNoticeDone,
    sl_info,
    tokenAllowance,
    tp_info,
    uniSwapAmountOut,
    usdtBalance,
  ]);
  const BaseBox = useMemo(() => {
    return styled(Box)(({ theme }) => {
      const width = isMobile ? "100%" : 450;
      const config = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
      return {
        ...config,
        width: width,
        padding: isMobile ? 20 : 0,
      };
    });
  }, [isMobile]);
  const BaseModalStack = useMemo(() => {
    return styled(Stack)(({ theme }) => {
      const width = isMobile ? "100%" : 450;
      return {
        width: width,
        borderRadius: 12,
        background: theme.normal.bg2,
        padding: 20,
      };
    });
  }, [isMobile]);
  const TopStack = useMemo(() => {
    return styled(Stack)(({ theme }) => {
      return {
        width: "100%",
        marginBottom: 20,
        "& button": {
          width: 20,
          height: 20,
          "&:hover": {
            cursor: "pointer",
          },
          "& svg": {
            width: 20,
            height: 20,
            "& path": {
              fill: theme.normal.text2,
            },
          },
        },
        "& .ModalLeftButton": {
          width: isMobile ? 0 : 20,
        },
      };
    });
  }, [isMobile]);
  const title = useMemo(() => {
    const BaseToken = "USDT".getToken()!.icon;
    const TokenIcon = tokenName_info
      ? tokenName_info.getToken()
        ? tokenName_info.getToken()!.icon
        : "ETH".getToken()!.icon
      : "ETH".getToken()!.icon;
    return (
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"8px"}
        sx={() => ({
          height: "24px",
        })}
      >
        <Stack
          direction={"row"}
          sx={{ "& svg": { width: "24px", height: "24px", display: "block" } }}
        >
          <TokenIcon style={{ marginRight: "-8px", position: "relative" }} />
          <BaseToken />
        </Stack>

        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 16,
            color: theme.normal.text0,
            marginLeft: "8px !important",
          })}
        >{`${tokenName_info}/USDT`}</Box>
        <Divider
          orientation="vertical"
          sx={(theme) => ({
            borderColor: theme.normal.border,
            height: "16px",
          })}
        />
        <Box
          component={"p"}
          sx={(theme) => ({
            height: "20px",
            paddingX: "4px",
            textAlign: "center",
            color: theme.normal.text2,
            fontWeight: 400,
            fontSize: 16,
          })}
        >{`${lever}X`}</Box>
        <Divider
          orientation="vertical"
          sx={(theme) => ({
            borderColor: theme.normal.border,
            height: "16px",
          })}
        />
        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={"4px"}
          alignItems={"center"}
          sx={(theme) => ({
            height: "22px",
            fontSize: 10,
            fontWeight: 700,
            color: longOrShort ? theme.normal.success : theme.normal.danger,
            borderRadius: "4px",
            paddingX: "4px",
            background: longOrShort
              ? theme.normal.success_light_hover
              : theme.normal.danger_light_hover,
            "& svg": {
              width: "10px",
              height: "10px",
              display: "block",
              "& path": {
                fill: longOrShort ? theme.normal.success : theme.normal.danger,
              },
            },
          })}
        >
          {longOrShort ? <Long /> : <Short />}
          {longOrShort ? <p>Long</p> : <p>Short</p>}
        </Stack>
      </Stack>
    );
  }, [lever, longOrShort, tokenName_info]);
  const info1 = useMemo(() => {
    return (
      <Stack spacing={"8px"}>
        <NormalInfo title={"Limit Price"} value={limitAmount} symbol={"USDT"} />
        {tp !== "" ? (
          <NormalInfo title={"Take Profit"} value={tp} symbol={"USDT"} />
        ) : (
          <></>
        )}
        {sl !== "" ? (
          <NormalInfo title={"Stop Loss"} value={sl} symbol={"USDT"} />
        ) : (
          <></>
        )}
      </Stack>
    );
  }, [limitAmount, sl, tp]);

  const info2 = useMemo(() => {
    return (
      <Stack spacing={"8px"} width={"100%"}>
        <NormalInfo
          title={"Service Fee"}
          value={showFee}
          symbol={"NEST"}
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
          />
        ) : (
          <></>
        )}
        <NormalInfo title={"Total Pay"} value={showTotalPay} symbol={"NEST"} />
      </Stack>
    );
  }, [inputToken, showFee, showFeeHoverText, showPositions, showTotalPay]);
  const inputNestAmount = useMemo(() => {
    return (
      <NESTInputSelect
        tokenName={inputToken}
        tokenArray={INPUT_TOKENS}
        selectToken={(tokenName: string) => {
          setInputAmount("");
          setInputToken(tokenName);
        }}
        checkBalance={checkBalance}
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
    checkBalance,
    inputAmount,
    inputToken,
    maxCallBack,
    setInputAmount,
    setInputToken,
    showBalance,
    showNESTPrice,
    showToSwap,
  ]);

  const modals = useMemo(() => {
    return (
      <>
        <Modal
          open={showProtocol}
          onClose={() => setShowProtocol(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              "& .ModalLeftButton": { width: "20px !important" },
              " & .ModalTitle": { textAlign: "center !important" },
            }}
          >
            <ProtocolModal
              onClose={() => setShowProtocol(false)}
              callBack={protocolCallBack}
            />
          </Box>
        </Modal>
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
        <ApproveNoticeModal
          open={showApproveNotice}
          isSuccess={true}
          onClose={() => {
            setShowApproveNoticeDone(true);
            setShowApproveNotice(false);
          }}
          callBack={() => {
            tokenApprove.write?.();
            setShowApproveNoticeDone(true);
            setShowApproveNotice(false);
          }}
        />
      </>
    );
  }, [
    protocolCallBack,
    setShowProtocol,
    setShowTriggerNotice,
    showApproveNotice,
    showProtocol,
    showTriggerNotice,
    tokenApprove,
    triggerNoticeCallback,
  ]);

  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseBox>
          <BaseModalStack
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            {modals}
            <TopStack
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
            >
              <button className="ModalLeftButton"></button>
              {title}
              <button onClick={props.onClose}>
                <Close />
              </button>
            </TopStack>
            <Stack spacing={"24px"} width={"100%"}>
              {inputNestAmount}
              {info1}
              <NESTLine />
              {info2}
              <MainButton
                title={mainButtonTitle}
                disable={mainButtonDis}
                isLoading={mainButtonLoading}
                onClick={mainButtonAction}
                style={{
                  height: "48px",
                  fontSize: 16,
                }}
              />
            </Stack>
          </BaseModalStack>
        </BaseBox>
      </Box>
    </Modal>
  );
};

export default SharePositionModal;
