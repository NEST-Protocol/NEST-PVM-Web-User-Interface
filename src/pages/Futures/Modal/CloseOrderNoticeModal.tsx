import { FC } from "react";
import BaseModal from "../../Share/Modal/BaseModal";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";
import { BigNumber } from "ethers";
import { Trans, t } from "@lingui/macro";

interface ProtocolModalProps {
  onClose: () => void;
  hideOrder: (index: BigNumber) => void;
  orderIndex?: BigNumber;
  hash?: string;
}

const CloseOrderNoticeModal: FC<ProtocolModalProps> = ({ ...props }) => {
  return (
    <BaseModal title={t`Close Risk`} onClose={props.onClose}>
      <Stack
        spacing={"18px"}
        width={"100%"}
        alignItems={"center"}
        sx={(theme) => ({
          overflow: "auto",
          fontSize: 12,
          fontWeight: 400,
          color: theme.normal.text2,
        })}
      >
        <p style={{ textAlign: "center" }}>
          <Trans>Will not be displayed after closing</Trans>
        </p>
        <MainButton
          title={t`I understand`}
          onClick={() => {
            if (props.orderIndex) {
              props.hideOrder(props.orderIndex);
            }
            props.onClose();
          }}
        />
      </Stack>
    </BaseModal>
  );
};

export default CloseOrderNoticeModal;
