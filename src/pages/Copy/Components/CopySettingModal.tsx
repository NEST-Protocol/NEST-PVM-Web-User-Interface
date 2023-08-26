import { FC, useMemo, useState } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Drawer from "@mui/material/Drawer";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import Modal from "@mui/material/Modal";
import BaseModal from "../../Share/Modal/BaseModal";
import Stack from "@mui/material/Stack";
import NESTInput from "../../../components/NormalInput/NESTInput";
import TokenAmountButtons from "../../Share/Modal/TokenAmountButtons";
import { NESTTooltipFC } from "../../../components/NESTTooltip/NESTTooltip";
import NESTLine from "../../../components/NESTLine";
import MainButton from "../../../components/MainButton/MainButton";
import Agree from "../../../components/Agree/Agree";
import useCopySettingModal from "../Hooks/useCopySettingModal";

interface CopySettingBaseModalProps {
  onClose: () => void;
  add?: boolean;
  address: string | undefined;
}

const CopySettingBaseModal: FC<CopySettingBaseModalProps> = ({ ...props }) => {
  const {
    copyAccountBalance,
    setCopyAccountBalance,
    followingValue,
    setFollowingValue,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useCopySettingModal(props.address, props.add ?? false, props.onClose);
  const [selectButton, setSelectButton] = useState(0);
  const inputNestAmount = useMemo(() => {
    return (
      <NESTInput
        checkBalance={true}
        showToSwap={false}
        showBalance={"666.66"}
        maxCallBack={() => {}}
        nestAmount={copyAccountBalance}
        hideSwapTitle={true}
        changeNestAmount={(value: string) => {
          setCopyAccountBalance(value.formatInputNum4());
          setSelectButton(0);
        }}
        otherCallBack={() => {}}
      />
    );
  }, [copyAccountBalance, setCopyAccountBalance]);

  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack spacing={"24px"} width={"100%"}>
        <Stack spacing={"8px"} width={"100%"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
              <Box
                sx={(theme) => ({
                  fontWeight: "400",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: theme.normal.text1,
                })}
              >
                {props.add ? (
                  <Trans>Add Copy Trading Amount</Trans>
                ) : (
                  <Trans>Copy Trading Total Amount</Trans>
                )}
              </Box>

              <NESTTooltipFC
                title={t`The total amount you invested in copying this trader’s signals.`}
              />
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              spacing={"4px"}
            >
              {props.add ? (
                <>
                  <Box
                    sx={(theme) => ({
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: theme.normal.text2,
                    })}
                  >
                    <Trans>Current</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: theme.normal.text0,
                    })}
                  >
                    2000 NEST
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Stack>
          </Stack>

          {inputNestAmount}
          {/* {isError ? (
          <ErrorLabel title={errorLabel} />
        ) : (
          <></>
        )} */}
          <TokenAmountButtons
            nowValue={selectButton ?? 0}
            callBack={() => {}}
          />
        </Stack>
        <Stack spacing={"8px"} width={"100%"}>
          <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
            <Box
              sx={(theme) => ({
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "16px",
                color: theme.normal.text1,
              })}
            >
              <Trans>Copy Trading Each Order</Trans>
            </Box>
            <NESTTooltipFC
              title={t`The fixed amount you invested for each order when copy trading.`}
            />
          </Stack>
          <Stack
            width={"100%"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={(theme) => ({
              borderRadius: "8px",
              border: `1px solid ${theme.normal.border}`,
              padding: "13px 12px",
            })}
          >
            <Box
              component={"input"}
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "22px",
                color: theme.normal.text0,
                width: "100%",
                paddingRight: "8px",
              })}
              value={followingValue}
              onChange={(e) => {
                setFollowingValue(e.target.value.formatInputNum4());
              }}
            ></Box>
            <Box
              sx={(theme) => ({
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "22px",
                color: theme.normal.text0,
              })}
            >
              NEST
            </Box>
          </Stack>
          <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
            <Box
              sx={(theme) => ({
                padding: "5px 12px",
                fontWeight: "700",
                fontSize: "10px",
                lineHeight: "14px",
                color: theme.normal.text2,
                borderRadius: "4px",
                border: `1px solid ${theme.normal.border}`,
                "&:hover": {
                  cursor: "pointer",
                },
              })}
            >
              500
            </Box>
            <Box
              sx={(theme) => ({
                padding: "5px 12px",
                fontWeight: "700",
                fontSize: "10px",
                lineHeight: "14px",
                color: theme.normal.text2,
                borderRadius: "4px",
                border: `1px solid ${theme.normal.border}`,
                "&:hover": {
                  cursor: "pointer",
                },
              })}
            >
              1000
            </Box>
            <Box
              sx={(theme) => ({
                padding: "5px 12px",
                fontWeight: "700",
                fontSize: "10px",
                lineHeight: "14px",
                color: theme.normal.text2,
                borderRadius: "4px",
                border: `1px solid ${theme.normal.border}`,
                "&:hover": {
                  cursor: "pointer",
                },
              })}
            >
              2000
            </Box>
          </Stack>
        </Stack>
        <NESTLine />

        <Stack spacing={"8px"}>
          <Stack direction={"row"} spacing={"8px"} paddingY={"8px"}>
            <Agree value={true} changeValue={() => {}} />
            <Box
              sx={(theme) => ({
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "16px",
                color: theme.normal.text0,
              })}
            >
              <Trans>I have read and agreed to the</Trans>
              <Trans>Copy Trader Service Agreement</Trans>
            </Box>
          </Stack>

          <MainButton
            title={mainButtonTitle}
            isLoading={mainButtonLoading}
            disable={mainButtonDis}
            onClick={mainButtonAction}
            style={{ height: "48px", fontSize: "16px" }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

interface CopySettingModalProps {
  open: boolean;
  name: string;
  onClose: () => void;
  address: string | undefined;
  add?: boolean;
}

const CopySettingModal: FC<CopySettingModalProps> = ({ ...props }) => {
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
        <BaseDrawer title={t`Copy` + " " + props.name} onClose={props.onClose}>
          <CopySettingBaseModal
            onClose={props.onClose}
            add={props.add}
            address={props.address}
          />
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
          <BaseModal title={t`Copy` + " " + props.name} onClose={props.onClose}>
            <CopySettingBaseModal
              onClose={props.onClose}
              add={props.add}
              address={props.address}
            />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default CopySettingModal;
