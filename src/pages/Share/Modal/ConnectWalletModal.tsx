import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useCallback, useMemo, useState } from "react";
import NESTa from "../../../components/MainButton/NESTa";
import useNEST from "../../../hooks/useNEST";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { Wallets } from "../../../lib/client";
import { useWalletConnectors } from "../../../lib/RainbowOptions/useWalletConnectors";
import { setWalletConnectDeepLink } from "../../../lib/RainbowOptions/walletConnectDeepLink";
import BaseDrawer from "./BaseDrawer";
import BaseModal from "./BaseModal";
import { Trans, t } from "@lingui/macro";

interface ConnectWalletModalBaseProps {
  onClose: () => void;
}

const ConnectWalletModalBase: FC<ConnectWalletModalBaseProps> = ({
  ...props
}) => {
  const wallets = useWalletConnectors();
  const { isBigMobile } = useWindowWidth();
  const [isMore, setIsMore] = useState(false);
  const { connectData } = useNEST();
  const BaseStack = styled(Stack)(({ theme }) => {
    return {
      width: "100%",
      overflow: "auto",
      "& .WalletLearnMore": {
        fontSize: 12,
        fontWeight: 400,
        color: theme.normal.text2,
      },
    };
  });
  const ItemBox = styled(Box)(({ theme }) => {
    return {
      width: "100%",
      borderRadius: 8,
      paddingTop: 20,
      paddingBottom: 20,
      "&:hover": {
        background: theme.normal.bg3,
        cursor: "pointer",
      },
      "& .WalletIcon": {
        height: 48,
        width: "100%",
        marginBottom: 12,
        "& svg": {
          display: "block",
          margin: "auto auto",
        },
      },
      "& p": {
        width: "100%",
        color: theme.normal.text0,
        fontSize: 14,
        fontWeight: 700,
        textAlign: "center",
      },
    };
  });
  const MoreButton = styled("button")(({ theme }) => {
    return {
      width: "100%",
      height: 48,
      fontSize: 17,
      fontWeight: 700,
      color: theme.normal.primary,
      "&:hover": {
        color: theme.normal.primary_hover,
        cursor: "pointer",
      },
      "&:active": {
        color: theme.normal.primary_active,
      },
    };
  });
  const Row1 = (
    <Stack
      direction={"row"}
      spacing={0}
      justifyContent={"space-between"}
      alignItems={"center"}
      marginTop={"16px"}
    >
      {Wallets.slice(0, 3).map((item, index) => {
        const Icon = item.icon;
        return (
          <ItemBox
            key={`WalletModalRow1 + ${index}`}
            onClick={async () => {
              connectData.connect({
                connector: connectData.connectors[index],
              });
            }}
          >
            <div className="WalletIcon">
              <Icon />
            </div>
            <p>{item.name}</p>
          </ItemBox>
        );
      })}
    </Stack>
  );
  const Row2 = (
    <Stack
      direction={"row"}
      spacing={0}
      justifyContent={"flex-start"}
      alignItems={"center"}
      marginTop={"16px"}
    >
      {Wallets.slice(3, 5).map((item, index) => {
        const Icon = item.icon;
        return (
          <ItemBox
            key={`WalletModalRow2 + ${index}`}
            onClick={async () => {
              connectData.connect({
                connector: connectData.connectors[index],
              });
            }}
          >
            <div className="WalletIcon">
              <Icon />
            </div>
            <p>{item.name}</p>
          </ItemBox>
        );
      })}
      <Box width={"100%"}>
        <div className="WalletIcon"></div>
        <p></p>
      </Box>
    </Stack>
  );
  return (
    <BaseStack spacing={0}>
      <p className="WalletLearnMore">
        <NESTa href="https://finance.docs.nestprotocol.org/#connect-wallet" target={"_blank"}>
          <Trans>Learn more</Trans>{" "}
        </NESTa>
        <Trans>about connecting wallets</Trans>
      </p>
      {Row1}
      {isMore ? (
        Row2
      ) : (
        <MoreButton onClick={() => setIsMore(!isMore)}><Trans>More</Trans></MoreButton>
      )}
    </BaseStack>
  );
};

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={props.onClose}
        sx={{
          zIndex: 1301,
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
      >
        <BaseDrawer title={t`Connect Wallet`} onClose={props.onClose}>
          <ConnectWalletModalBase onClose={props.onClose} />
        </BaseDrawer>
      </Drawer>
    ) : (
      <Modal
        open={props.open}
        onClose={() => props.onClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ zIndex: 1301 }}
      >
        <Box>
          <BaseModal title={t`Connect Wallet`} onClose={props.onClose}>
            <ConnectWalletModalBase onClose={props.onClose} />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default ConnectWalletModal;
