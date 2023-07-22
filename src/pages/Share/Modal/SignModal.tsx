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
import { NESTTooltipFC } from "../../../components/NESTTooltip/NESTTooltip";
import { FuturesIcon } from "../../../components/icons";
import useSignModal from "../../../hooks/useSignModal";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    width: 20,
    height: 20,
    margin: 2,
    padding: 0,
    "&.Mui-checked": {
      "& .MuiSwitch-thumb": {
        backgroundColor: theme.normal.text0,
      },
      "& .MuiSwitch-thumb:before": {
        backgroundPosition: "4px 4px",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.normal.bg0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.normal.bg3,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "2px 2px",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.normal.bg0,
    borderRadius: 12,
    border: `1px solid ${theme.normal.border}`,
  },
}));

const SignModalBase: FC = () => {
  const {
    remember,
    setRemember,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useSignModal();
  return (
    <Stack spacing={"24px"} sx={{ width: "100%" }}>
      <Stack
        direction={"row"}
        spacing={"12px"}
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Box
          sx={(theme) => ({
            background: theme.normal.bg3,
            width: "48px",
            height: "48px",
            borderRadius: "24px",
          })}
        >
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              "& svg": {
                width: "24px",
                height: "24px",
                "& path": {
                  fill: theme.normal.text0,
                },
              },
            })}
          >
            <FuturesIcon />
          </Stack>
        </Box>
        <Stack spacing={"8px"}>
          <Box
            sx={(theme) => ({
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "22px",
              color: theme.normal.text0,
            })}
            component={"p"}
          >
            <Trans>Verify ownership</Trans>
          </Box>
          <Box
            sx={(theme) => ({
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
              color: theme.normal.text2,
            })}
            component={"p"}
          >
            <Trans>Confirm you are the owner of this wallet</Trans>
          </Box>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          spacing={"5px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box
            sx={(theme) => ({
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
              color: theme.normal.text2,
            })}
            component={"p"}
          >
            Remember me
          </Box>
          <NESTTooltipFC
            title={t`If you are using a secure device that you own. Selecting this option can expose your keys and information to others if you are on a public or non-secured device.`}
          />
        </Stack>
        <IOSSwitch
          sx={{ m: 1 }}
          checked={remember}
          onChange={() => setRemember(!remember)}
        />
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

interface SignModalProps {
  open: boolean;
  onClose: () => void;
}

const SignModal: FC<SignModalProps> = ({ ...props }) => {
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
        <BaseDrawer title={t`Link wallet`} onClose={props.onClose}>
          <SignModalBase />
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
          <BaseModal title={t`Link wallet`} onClose={props.onClose}>
            <SignModalBase />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default SignModal;
