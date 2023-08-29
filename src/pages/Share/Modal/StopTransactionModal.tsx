import { FC } from "react";
import BaseModal from "./BaseModal";
import { Trans, t } from "@lingui/macro";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";

interface StopTransactionModalProps {
  onClose: () => void;
}

const StopTransactionModal: FC<StopTransactionModalProps> = ({ ...props }) => {
  return (
    <BaseModal
      title={t`Important Announcement: Temporary Suspension of Trading Services on NESTfi`}
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
          <p>
            <Trans>Dear NESTfi Users,</Trans>
          </p>
          <p>
            <Trans>
              We would like to inform you about an upcoming event regarding the
              NEST token. We are currently conducting an airdrop of NEST 2.0
              tokens, which will bring significant upgrades and improvements to
              the NEST protocol.
            </Trans>
          </p>
          <p>
            <Trans>
              During the airdrop period, NESTfi's trading services will be
              temporarily unavailable for approximately 1-2 hours. This
              suspension is necessary to ensure a smooth and successful airdrop
              of NEST 2.0 tokens to all eligible participants. We apologize for
              any inconvenience caused during this temporary interruption of
              services.
            </Trans>
          </p>
          <p>
            <Trans>
              Once the airdrop is completed, NESTfi will only support trading
              with NEST 2.0 tokens. The previous version of NEST tokens (NEST
              1.0) will become obsolete and will no longer be accepted for
              trading or other activities on the platform.
            </Trans>
          </p>
          <p>
            <Trans>
              If you have any questions or require further assistance, please
              feel free to reach out to our support team. We are here to help
              and provide guidance throughout this process.
            </Trans>
          </p>
          <p>
            <Trans>Sincerely,</Trans>
          </p>
          <p>
            <Trans>The NESTfi Team</Trans>
          </p>
        </Stack>
        <MainButton
          title={t`I understand`}
          onClick={props.onClose}
          style={{ width: "100%" }}
        />
      </Stack>
    </BaseModal>
  );
};

export default StopTransactionModal;
