import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo, useState } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import useNEST from "../../../hooks/useNEST";
import useWalletIcon from "../../../hooks/uswWalletIcon";
import MyWalletModal from "../Modal/MyWalletModal";
import { Trans, t } from "@lingui/macro";
import { Link } from "react-router-dom";
import {
  AccountDashboard,
  AccountIcon,
  AccountOut,
  NetworkDownIcon,
} from "../../../components/icons";
import SelectListMenu from "../../../components/SelectListMemu/SelectListMenu";
import Divider from "@mui/material/Divider";

const AddressStack = styled(Stack)(({ theme }) => ({
  height: 36,
  background: theme.normal.bg1,
  borderRadius: 8,
  paddingLeft: 10,
  paddingRight: 10,
  "&:hover": {
    cursor: "pointer",
    background: theme.normal.grey_hover,
  },
  "&:active": {
    cursor: "pointer",
    background: theme.normal.grey_active,
  },
  "& p": {
    color: theme.normal.text0,
    fontWeight: 700,
    fontSize: 12,
  },
  "& svg": {
    width: 20,
    height: 20,
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: "24px",
  height: "24px",
  marginRight: "8px",
  borderRadius: 12,
  background: theme.normal.bg1,
  padding: "5px",
  "& svg": {
    width: 14,
    height: 14,
    display: "block",
    "& path": {
      fill: theme.normal.text1,
    },
  },
}));

const AccountListStack = styled(Stack)(({ theme }) => ({
  padding: "9px 16px 9px 16px",
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "22px",
  color: theme.normal.text1,
  cursor: "pointer",
  "&:hover": {
    color: theme.normal.primary,
    background: theme.normal.grey_hover,
    "& svg path": {
      fill: theme.normal.highDark,
    },
    "& .AccountListIconBox": {
      background: theme.normal.primary,
    },
  },
}));

const ConnectButton: FC = () => {
  const { account, setShowConnect, checkSigned } = useNEST();
  const [openModal, setOpenModal] = useState(false);
  const walletIcon = useWalletIcon();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const signView = useMemo(() => {
    return (
      <Stack spacing={"12px"} alignItems={"center"} paddingX={"16px"}>
        <Box
          sx={(theme) => ({
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            color: theme.normal.text1,
            textAlign: "center",
          })}
        >
          <Trans>
            Verify ownership, Confirm you are the owner of this wallet.
          </Trans>
        </Box>

        <MainButton
          title={t`Sign message`}
          style={{ height: "24px", borderRadius: "4px", fontSize: "10px" }}
          onClick={() => {}}
        />
      </Stack>
    );
  }, []);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            "& .ModalLeftButton": { width: "20px !important" },
            " & .ModalTitle": { textAlign: "center !important" },
          }}
        >
          <MyWalletModal onClose={() => setOpenModal(false)} />
        </Box>
      </Modal>

      {account.isConnected ? (
        <>
          <AddressStack
            direction={"row"}
            justifyContent="space-between"
            alignItems="center"
            spacing={"10px"}
            aria-controls={"account-menu"}
            aria-haspopup="true"
            aria-expanded={"true"}
            onClick={handleClick}
          >
            {walletIcon}
            <p>{account.address?.toString().showAddress()}</p>
            <Box
              sx={() => ({
                width: "8px",
                height: "8px",
                "& svg": {
                  display: "block",
                  width: "8px",
                  height: "8px",
                },
              })}
            >
              <NetworkDownIcon />
            </Box>
          </AddressStack>
          <SelectListMenu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <Stack spacing={"12px"} maxWidth={"160px"}>
              {checkSigned ? (
                <>
                  <Link to={"/account"}>
                    <AccountListStack
                      direction={"row"}
                      spacing={"8px"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                    >
                      <IconBox className="AccountListIconBox">
                        <AccountIcon />
                      </IconBox>
                      <Box>
                        <Trans>Account</Trans>
                      </Box>
                    </AccountListStack>
                  </Link>

                  <AccountListStack
                    direction={"row"}
                    spacing={"8px"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                  >
                    <IconBox className="AccountListIconBox">
                      <AccountDashboard />
                    </IconBox>
                    <Box>
                      <Trans>Dashboard</Trans>
                    </Box>
                  </AccountListStack>
                </>
              ) : (
                <>{signView}</>
              )}
              <Divider
                orientation="horizontal"
                sx={(theme) => ({
                  borderColor: theme.normal.border,
                  height: "1px",
                  width: "100%",
                })}
              />
              <AccountListStack
                direction={"row"}
                spacing={"8px"}
                justifyContent={"flex-start"}
                alignItems={"center"}
              >
                <IconBox className="AccountListIconBox">
                  <AccountOut />
                </IconBox>
                <Box>
                  <Trans>Disconnect</Trans>
                </Box>
              </AccountListStack>
            </Stack>
          </SelectListMenu>
        </>
      ) : (
        <MainButton
          title={t`Connect Wallet`}
          onClick={() => {
            setShowConnect(true);
          }}
          style={{
            height: "36px",
            fontSize: 12,
            width: "111px",
            borderRadius: 8,
          }}
        />
      )}
    </div>
  );
};

export default ConnectButton;
