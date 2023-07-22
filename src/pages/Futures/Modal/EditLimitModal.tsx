import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInput from "../../../components/NormalInput/NormalInput";
import useFuturesEditLimit from "../../../hooks/useFuturesEditLimit";
import { FuturesOrderService } from "../../../hooks/useFuturesOrderList";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import BaseModal from "../../Share/Modal/BaseModal";
import { t } from "@lingui/macro";

interface EditLimitModalBaseProps {
  data: FuturesOrderService;
  onClose: () => void;
}

const EditLimitModalBase: FC<EditLimitModalBaseProps> = ({ ...props }) => {
  const {
    limitPrice,
    setLimitPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useFuturesEditLimit(props.data, props.onClose);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <NormalInput
        placeHolder={t`Limit Price`}
        rightTitle={"USDT"}
        value={limitPrice}
        changeValue={(value: string) => setLimitPrice(value.formatInputNum())}
      />
      <NESTLine />
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

interface EditLimitModalProps {
  data: FuturesOrderService;
  open: boolean;
  onClose: () => void;
}

const EditLimitModal: FC<EditLimitModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={props.onClose}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
      >
        <BaseDrawer title={t`Limit Price`} onClose={props.onClose}>
          <EditLimitModalBase data={props.data} onClose={props.onClose} />
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
          <BaseModal title={t`Limit Price`} onClose={props.onClose}>
            <EditLimitModalBase data={props.data} onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default EditLimitModal;
