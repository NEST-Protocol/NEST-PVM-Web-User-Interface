import { FC, useCallback, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { t } from "@lingui/macro";
import Drawer from "@mui/material/Drawer";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import BaseModal from "../../Share/Modal/BaseModal";
import NESTLine from "../../../components/NESTLine";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";

interface CopyStopBaseModalProps {
  onClose: () => void;
}

const CopyStopBaseModal: FC<CopyStopBaseModalProps> = ({ ...props }) => {
  const info = useCallback((title: string, value: string) => {
    return (
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "14px",
            color: theme.normal.text2,
          })}
        >
          {title}
        </Box>
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "14px",
            color: theme.normal.text0,
          })}
        >
          {value}
        </Box>
      </Stack>
    );
  }, []);
  const information = useCallback((title: string) => {
    return (
      <Box
        sx={(theme) => ({
          padding: "8px",
          borderRadius: "8px",
          background: theme.normal.bg0,
          fontWeight: "400",
          fontSize: "12px",
          lineHeight: "16px",
          color: theme.normal.text2,
        })}
      >
        {title}
      </Box>
    );
  }, []);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack spacing={"8px"} width={"100%"}>
        {info(t`Total Copy Amount`, "500NEST")}
        {info(t`Open Interest`, "500NEST")}
        {info(t`Total Profit`, "500NEST")}
      </Stack>
      <NESTLine />
      {info(t`Estimated Realized Amount`, "500NEST")}

      <Stack spacing={"12px"}>
        {information(
          t`End copy will liquidate your position with market orders, and automatically return the assets to your Account after deducting the profits sharing.`
        )}
        {information(
          t`Please note that due to price fluctuation during settlement, the PNL, profit shared and settled value may vary from displayed above.`
        )}
      </Stack>

      <MainButton title={t`Confirm`} onClick={() => {}} />
    </Stack>
  );
};

interface CopyStopModalProps {
  open: boolean;
  onClose: () => void;
}

const CopyStopModal: FC<CopyStopModalProps> = ({ ...props }) => {
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
        keepMounted
      >
        <BaseDrawer title={t`Stop Copying`} onClose={props.onClose}>
          <CopyStopBaseModal onClose={props.onClose} />
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
          <BaseModal title={t`Stop Copying`} onClose={props.onClose}>
            <CopyStopBaseModal onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default CopyStopModal;
