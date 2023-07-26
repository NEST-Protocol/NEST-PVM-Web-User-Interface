import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Drawer from "@mui/material/Drawer";
import BaseDrawer from "./BaseDrawer";
import { Trans, t } from "@lingui/macro";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import BaseModal from "./BaseModal";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";
import NESTInput from "../../../components/NormalInput/NESTInput";
import ErrorLabel from "../../../components/ErrorLabel/ErrorLabel";
import TokenAmountButtons from "./TokenAmountButtons";
import useWithDrawModal from "../../../hooks/useWithDrawModal";

interface WithDrawModalBaseProps {
  onClose: (res?: boolean) => void;
}

const WithDrawModalBase: FC<WithDrawModalBaseProps> = ({ ...props }) => {
  const {
    tokenAmount,
    setTokenAmount,
    selectButton,
    setSelectButton,
    showBalance,
    maxCallBack,
    selectButtonCallBack,
    isError,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useWithDrawModal(props.onClose);

  const inputNestAmount = useMemo(() => {
    return (
      <NESTInput
        checkBalance={!isError}
        showToSwap={false}
        showBalance={showBalance}
        maxCallBack={maxCallBack}
        nestAmount={tokenAmount}
        hideSwapTitle={true}
        changeNestAmount={(value: string) => {
          setTokenAmount(value.formatInputNum4());
          setSelectButton(0);
        }}
        otherCallBack={() => {}}
      />
    );
  }, [
    isError,
    maxCallBack,
    setSelectButton,
    setTokenAmount,
    showBalance,
    tokenAmount,
  ]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack spacing={"16px"}>
        {inputNestAmount}
        {isError ? (
          <ErrorLabel title={t`Exceed maximum withdrawal amount.`} />
        ) : (
          <></>
        )}

        <TokenAmountButtons
          nowValue={selectButton ?? 0}
          callBack={selectButtonCallBack}
        />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px",
        }}
      >
        <Box
          sx={(theme) => ({
            color: theme.normal.text2,
          })}
        >
          <Trans>Service Fee</Trans>
        </Box>
        <Box
          sx={(theme) => ({
            color: theme.normal.text0,
          })}
        >
          15 NEST
        </Box>
      </Stack>
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ height: "48px" }}
      />
    </Stack>
  );
};

interface WithDrawModalProps {
  open: boolean;
  onClose: (res?: boolean) => void;
}

const WithDrawModal: FC<WithDrawModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => {
          props.onClose(undefined);
        }}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
        keepMounted
      >
        <BaseDrawer
          title={t`Withdraw`}
          onClose={() => {
            props.onClose(undefined);
          }}
        >
          <WithDrawModalBase onClose={props.onClose} />
        </BaseDrawer>
      </Drawer>
    ) : (
      <Modal
        open={props.open}
        onClose={() => {
          props.onClose(undefined);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <BaseModal
            title={t`Withdraw`}
            onClose={() => {
              props.onClose(undefined);
            }}
          >
            <WithDrawModalBase onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default WithDrawModal;
