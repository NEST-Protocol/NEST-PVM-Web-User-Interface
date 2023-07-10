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
    <BaseModal
      title={t`Temporary Suspension of Trading Services on NESTfi`}
      onClose={props.onClose}
    >
      <Stack spacing={"20px"} sx={(theme) => ({ width: `100%` })}>
        <Stack
          spacing={"5px"}
          sx={(theme) => ({
            height: "300px",
            overflow: "auto",
            "& p": {
              color: theme.normal.text0,
              fontSize: "14px",
            },
          })}
        >
          <p>Dear NESTfi Users,</p>
          <p>
            We would like to inform you about an upcoming event regarding the
            NEST token. We are currently conducting an airdrop of NEST 2.0
            tokens, which will bring significant upgrades and improvements to
            the NEST protocol.
          </p>
          <p>
            During the airdrop period, NESTfi's trading services will be
            temporarily unavailable for approximately 1-2 hours. This suspension
            is necessary to ensure a smooth and successful airdrop of NEST 2.0
            tokens to all eligible participants. We apologize for any
            inconvenience caused during this temporary interruption of services.
          </p>
          <p>
            Once the airdrop is completed, NESTfi will only support trading with
            NEST 2.0 tokens. The previous version of NEST tokens (NEST 1.0) will
            become obsolete and will no longer be accepted for trading or other
            activities on the platform.
          </p>
          <p>
            If you have any questions or require further assistance, please feel
            free to reach out to our support team. We are here to help and
            provide guidance throughout this process.
          </p>
          <p>Sincerely,</p>
          <p>The NESTfi Team</p>
        </Stack>
        <MainButton
          title={t`Understand`}
          onClick={props.onClose}
          style={{ width: "100%" }}
        />
      </Stack>
    </BaseModal>
  );
};

export default StopTransactionModal;
