import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInfo from "../../../components/NormalInfo/NormalInfo";
import useFuturesClose from "../../../hooks/useFuturesClose";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import BaseModal from "../../Share/Modal/BaseModal";
import { FuturesPrice } from "../Futures";
import { t } from "@lingui/macro";
import { FuturesOrderService } from "../OrderList";

interface CloseModalBaseProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  onClose: (result?: boolean) => void;
}

const CloseModalBase: FC<CloseModalBaseProps> = ({ ...props }) => {
  const {
    showPosition,
    showClosePrice,
    showFee,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    feeTip,
  } = useFuturesClose(props.data, props.price, props.onClose);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <NESTLine />
      <Stack spacing={"8px"}>
        <NormalInfo title={t`Position`} value={""} symbol={showPosition} />
        <NormalInfo
          title={t`Close Price`}
          value={showClosePrice}
          symbol={"USDT"}
        />
        <NormalInfo
          title={t`Service Fee`}
          value={showFee}
          symbol={"NEST"}
          help
          helpInfo={<p>{feeTip}</p>}
        />
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

interface CloseModalProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  open: boolean;
  onClose: (result?: boolean) => void;
}

const CloseModal: FC<CloseModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => props.onClose()}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
      >
        <BaseDrawer title={t`Close Position`} onClose={props.onClose}>
          <CloseModalBase
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
          <BaseModal title={t`Close Position`} onClose={props.onClose}>
            <CloseModalBase
              data={props.data}
              price={props.price}
              onClose={props.onClose}
            />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default CloseModal;
