import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Drawer from "@mui/material/Drawer";
import BaseDrawer from "./BaseDrawer";
import { t } from "@lingui/macro";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import BaseModal from "./BaseModal";
import { LanguageList } from "../Head/LanguageMenu";

interface LanguageModalBaseProps {
  onClose: () => void;
}

const LanguageModalBase: FC<LanguageModalBaseProps> = ({ ...props }) => {
  return (
    <LanguageList spacing={16} paddingX={12} selectCallBack={props.onClose} />
  );
};

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

const LanguageModal: FC<LanguageModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={props.onClose}
        sx={{
            zIndex: 1300,
          "& .MuiPaper-root": { background: "none", backgroundImage: "none"},
        }}
        keepMounted
      >
        <BaseDrawer title={t`Language`} onClose={props.onClose}>
          <LanguageModalBase onClose={props.onClose} />
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
          <BaseModal title={t`Language`} onClose={props.onClose}>
            <LanguageModalBase onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default LanguageModal;
