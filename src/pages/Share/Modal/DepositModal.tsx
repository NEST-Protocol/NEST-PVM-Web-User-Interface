import { FC, useCallback, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Drawer from "@mui/material/Drawer";
import BaseDrawer from "./BaseDrawer";
import { Trans, t } from "@lingui/macro";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import BaseModal from "./BaseModal";
import Stack from "@mui/material/Stack";
import MainButton from "../../../components/MainButton/MainButton";
import NESTInputSelect from "../../../components/NormalInput/NESTInputSelect";
import TokenAmountButtons from "./TokenAmountButtons";
import useDepositModal from "../../../hooks/useDepositModal";
import ErrorLabel from "../../../components/ErrorLabel/ErrorLabel";

const depositTokens = ["NEST", "USDT", "BNB"];

interface DepositModalBaseProps {
  onClose: () => void;
}

const DepositModalBase: FC<DepositModalBaseProps> = ({ ...props }) => {
  const {
    tokenAmount,
    setTokenAmount,
    selectToken,
    setSelectToken,
    selectButton,
    setSelectButton,
    maxCallBack,
    showBalance,
    showPrice,
    showGetNEST,
    selectButtonCallBack,
    isError,
    checkMax,
    checkBalance,
    MAX_Amount,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useDepositModal(props.onClose);

  const midText = useMemo(() => {
    if (checkMax) {
      return (
        <ErrorLabel
          title={
            t`The maximum deposit amount is` +
            ` ` +
            `${MAX_Amount[selectToken].floor(2)} ${selectToken}`
          }
        />
      );
    } else if (checkBalance) {
      return (
        <ErrorLabel title={t`Insufficient` + ` ${selectToken} ` + t`balance`} />
      );
    } else if (selectToken !== "NEST") {
      return (
        <Box
          sx={(theme) => ({
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: theme.normal.text2,
          })}
        >
          <Trans>*NESTFi only supports NEST withdrawals.</Trans>
        </Box>
      );
    }
  }, [MAX_Amount, checkBalance, checkMax, selectToken]);
  const otherInfo = useMemo(() => {
    if (selectToken !== "NEST") {
      return (
        <Stack spacing={"8px"}>
          <Stack
            sx={(theme) => ({
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
              color: theme.normal.text2,
            })}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Box component={"p"}>
              <Trans>Get NEST</Trans>
            </Box>
            <Box
              sx={(theme) => ({
                color: theme.normal.text0,
              })}
              component={"p"}
            >
              {`${showGetNEST} NEST`}
            </Box>
          </Stack>
          <Stack
            sx={(theme) => ({
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
              color: theme.normal.text2,
            })}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Box component={"p"}>
              <Trans>Price</Trans>
            </Box>
            <Box
              sx={(theme) => ({
                color: theme.normal.text0,
              })}
              component={"p"}
            >
              {`1 ${selectToken} = ${showPrice} NEST`}
            </Box>
          </Stack>
        </Stack>
      );
    } else {
      return <></>;
    }
  }, [selectToken, showGetNEST, showPrice]);
  const inputNestAmount = useCallback(() => {
    return (
      <NESTInputSelect
        tokenName={selectToken}
        tokenArray={depositTokens}
        selectToken={(tokenName: string) => {
          setTokenAmount("");
          setSelectToken(tokenName);
        }}
        error={isError}
        showToSwap={false}
        showBalance={showBalance}
        maxCallBack={maxCallBack}
        nestAmount={tokenAmount}
        balanceTitle={t`Wallet Balance` + ":"}
        changeNestAmount={(value: string) => {
          setTokenAmount(value.formatInputNum4());
          setSelectButton(0);
        }}
      />
    );
  }, [
    isError,
    maxCallBack,
    selectToken,
    setSelectButton,
    setSelectToken,
    setTokenAmount,
    showBalance,
    tokenAmount,
  ]);
  const button = useMemo(() => {
    return (
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ height: "48px" }}
      />
    );
  }, [mainButtonTitle, mainButtonDis, mainButtonLoading, mainButtonAction]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack spacing={"16px"}>
        {inputNestAmount()}
        {midText}
        <TokenAmountButtons
          nowValue={selectButton ?? 0}
          callBack={selectButtonCallBack}
        />
      </Stack>
      {otherInfo}
      {button}
    </Stack>
  );
};

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

const DepositModal: FC<DepositModalProps> = ({ ...props }) => {
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
        <BaseDrawer title={t`Deposit`} onClose={props.onClose}>
          <DepositModalBase onClose={props.onClose} />
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
          <BaseModal title={t`Deposit`} onClose={props.onClose}>
            <DepositModalBase onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default DepositModal;
