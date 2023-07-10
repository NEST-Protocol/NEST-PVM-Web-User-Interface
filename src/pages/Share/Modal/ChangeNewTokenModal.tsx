import { FC } from "react";
import BaseModal from "./BaseModal";
import { Trans, t } from "@lingui/macro";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";
import useNEST from "../../../hooks/useNEST";

interface ChangeNewTokenModalProps {
  onClose: () => void;
}

const ChangeNewTokenModal: FC<ChangeNewTokenModalProps> = ({ ...props }) => {
  const { addNESTToWallet } = useNEST();
  return (
    <BaseModal
      title={t`Update: NEST 2.0 Airdrop Completed - NESTFi Services Now Available`}
      onClose={props.onClose}
    >
      <Stack sx={(theme) => ({ width: `100%` })}>
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
            <Trans>Dear NESTFi Community,</Trans>
          </p>
          <p>
            <Trans>
              We are delighted to inform you that the NEST 2.0 token airdrop has
              been successfully completed. As a result, NESTFi services are now
              fully operational, and you can resume using the platform as usual.
            </Trans>
          </p>
          <p>
            <Trans>
              Please note that NEST 1.0 tokens have been officially deprecated
              and will no longer be supported. To continue participating in the
              NESTFi ecosystem and enjoy its benefits, it is crucial that you
              add NEST 2.0 tokens to your wallet. We have provided a button
              below for your convenience to add NEST 2.0 tokens to your wallet
              effortlessly.
            </Trans>
          </p>
          <p>
            <Trans>The NESTFi Team</Trans>
          </p>
        </Stack>
        <MainButton
          title={t`Add NEST 2.0 to wallet`}
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
