import { FC } from "react";
import BaseModal from "./BaseModal";
import { t } from "@lingui/macro";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";
import useNEST from "../../../hooks/useNEST";

interface ChangeNewTokenModalProps {
  onClose: () => void;
}

const ChangeNewTokenModal: FC<ChangeNewTokenModalProps> = ({ ...props }) => {
  const { addNESTToWallet } = useNEST();
  return (
    <BaseModal title={t`Add new NEST`} onClose={props.onClose}>
      <Stack sx={(theme) => ({ width: `100%` })}>
        <MainButton
          title={t`Add NEST to wallet`}
          onClick={() => {
            localStorage.setItem("ChangeToken", "1");
            addNESTToWallet();
            props.onClose();
          }}
          style={{ width: "100%" }}
        />
      </Stack>
    </BaseModal>
  );
};

export default ChangeNewTokenModal;
