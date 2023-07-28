import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInfo from "../../../components/NormalInfo/NormalInfo";
import NormalInputWithCloseButton from "../../../components/NormalInput/NormalInputWithCloseButton";
import useFuturesEditPosition from "../../../hooks/useFuturesEditPosition";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import BaseModal from "../../Share/Modal/BaseModal";
import { FuturesPrice } from "../Futures";
import TriggerRiskModal from "./LimitAndPriceModal";
import ErrorLabel from "../../../components/ErrorLabel/ErrorLabel";
import { Trans, t } from "@lingui/macro";
import { FuturesOrderService } from "../OrderList";

interface EditPositionModalBaseProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  onClose: (res?: boolean) => void;
}

const EditPositionModalBase: FC<EditPositionModalBaseProps> = ({
  ...props
}) => {
  const {
    stopProfitPriceInput,
    setStopProfitPriceInput,
    stopLossPriceInput,
    setStopLossPriceInput,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    placeHolder,
    closeTP,
    closeSL,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
    tpError,
    slError,
  } = useFuturesEditPosition(props.data, props.price, props.onClose);
  const triggerNoticeModal = useMemo(() => {
    return (
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
    );
  }, [setShowTriggerNotice, showTriggerNotice, triggerNoticeCallback]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      {triggerNoticeModal}
      <Stack spacing={"16px"} width={"100%"}>
        <Stack spacing={"8px"} width={"100%"}>
          <Box
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: 12,
              color: theme.normal.text2,
            })}
          >
            <Trans>Take Profit</Trans>
          </Box>

          <NormalInputWithCloseButton
            placeHolder={placeHolder[0]}
            rightTitle={"USDT"}
            value={stopProfitPriceInput}
            changeValue={(value: string) =>
              setStopProfitPriceInput(value.formatInputNum())
            }
            onClose={closeTP}
            error={tpError}
          />
        </Stack>
        <Stack spacing={"8px"} width={"100%"}>
          <Box
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: 12,
              color: theme.normal.text2,
            })}
          >
            <Trans>Stop Loss</Trans>
          </Box>
          <NormalInputWithCloseButton
            placeHolder={placeHolder[1]}
            rightTitle={"USDT"}
            value={stopLossPriceInput}
            changeValue={(value: string) =>
              setStopLossPriceInput(value.formatInputNum())
            }
            onClose={closeSL}
            error={slError}
          />
        </Stack>
        {tpError || slError ? (
          <ErrorLabel
            title={t`After the limit order is executed, TP and SL price you set will trigger immediately.`}
          />
        ) : (
          <></>
        )}
      </Stack>
      <NESTLine />
      <Stack spacing={"8px"}>
        <NormalInfo title={t`Position`} value={""} symbol={showPosition} />
        <NormalInfo
          title={t`Open Price`}
          value={showOpenPrice}
          symbol={"USDT"}
        />
        <NormalInfo title={t`Liq Price`} value={showLiqPrice} symbol={"USDT"} />
      </Stack>
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ fontSize: 14 }}
      />
    </Stack>
  );
};

interface EditPositionModalProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  open: boolean;
  onClose: (res?: boolean) => void;
}

const EditPositionModal: FC<EditPositionModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const title = useMemo(() => {
    return !(props.data.stopLossPrice === 0 && props.data.takeProfitPrice === 0)
      ? t`Edit Position`
      : t`Trigger Position`;
  }, [props.data.stopLossPrice, props.data.takeProfitPrice]);
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => {
          props.onClose(undefined);
        }}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
      >
        <BaseDrawer
          title={title}
          onClose={() => {
            props.onClose(undefined);
          }}
        >
          <EditPositionModalBase
            data={props.data}
            price={props.price}
            onClose={props.onClose}
          />
        </BaseDrawer>
      </Drawer>
    ) : (
      <Modal
        open={props.open}
        onClose={() => props.onClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <BaseModal
            title={title}
            onClose={() => {
              props.onClose(undefined);
            }}
          >
            <EditPositionModalBase
              data={props.data}
              price={props.price}
              onClose={props.onClose}
            />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props, title]);

  return view;
};

export default EditPositionModal;
