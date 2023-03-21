import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FC, useMemo } from "react";
import BaseNoticeModal from "../../Share/Modal/BaseNoticeModal";
import Stack from "@mui/material/Stack";
import { Fail, Success } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";

interface ApproveNoticeModalProps {
  open: boolean;
  isSuccess: boolean;
  onClose: () => void;
  callBack: () => void;
}

const ApproveNoticeModal: FC<ApproveNoticeModalProps> = ({ ...props }) => {
  const Icon = useMemo(() => {
    return props.isSuccess ? Success : Fail;
  }, [props.isSuccess]);
  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseNoticeModal>
          <Stack spacing={"16px"} alignItems="center">
            <Box
              sx={(theme) => ({
                width: "48px",
                height: "48px",
                "& svg path": {
                  fill: props.isSuccess
                    ? theme.normal.success
                    : theme.normal.danger,
                },
              })}
            >
              <Icon />
            </Box>
            <Stack spacing={"8px"} alignItems="center">
              <Box
                component={"p"}
                sx={(theme) => ({
                  color: theme.normal.text0,
                  fontSize: 16,
                  fontWeight: 700,
                })}
              >
                You have connected your wallet
              </Box>
              <Box
                component={"p"}
                sx={(theme) => ({
                  color: theme.normal.text0,
                  fontSize: 12,
                  fontWeight: 400,
                  textAlign: "center",
                })}
              >
                Please click Approve for authorization and then you can open the
                position, this process will consume some GAS.
              </Box>
            </Stack>
          </Stack>
          <MainButton
            title={"Approve"}
            onClick={props.callBack}
            style={{
              fontSize: 14,
              height: "40px",
            }}
          />
        </BaseNoticeModal>
      </Box>
    </Modal>
  );
};

export default ApproveNoticeModal;
