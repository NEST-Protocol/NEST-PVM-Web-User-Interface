import { FC } from "react";
import BaseModal from "./BaseModal";
import { t } from "@lingui/macro";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";

interface StopTransactionModalProps {
  onClose: () => void;
}

const StopTransactionModal: FC<StopTransactionModalProps> = ({ ...props }) => {
  return (
    <BaseModal title={t`Suspend trading`} onClose={props.onClose}>
      <Stack sx={(theme) => ({width: `100%`})}>
        <MainButton title={t`Understand`} onClick={props.onClose} style={{width: '100%'}}/>
      </Stack>
    </BaseModal>
  );
};

export default StopTransactionModal;
