import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import useNEST from "../../../hooks/useNEST";
import useWalletIcon from "../../../hooks/uswWalletIcon";
import MyWalletModal from "../Modal/MyWalletModal";
import { t } from "@lingui/macro";
import { Link } from "react-router-dom";

const ConnectButton: FC = () => {
  const { account, setShowConnect } = useNEST();
  const [openModal, setOpenModal] = useState(false);
  const walletIcon = useWalletIcon();

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
        <Link to={"/account"}>
          <AddressStack
            direction={"row"}
            justifyContent="space-between"
            alignItems="center"
            spacing={"10px"}
            onClick={() => setOpenModal(true)}
          >
            {walletIcon}
            <p>{account.address?.toString().showAddress()}</p>
          </AddressStack>
        </Link>
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
