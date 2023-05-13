import { FC, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import BaseModal from "./BaseModal";
import { Copy, Fail, NEXT, Success } from "../../../components/icons";
import useNEST from "../../../hooks/useNEST";
import LinkButton from "../../../components/MainButton/LinkButton";
import Box from "@mui/material/Box";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import useWalletIcon from "../../../hooks/uswWalletIcon";
import copy from "copy-to-clipboard";
import { Trans, t } from "@lingui/macro";

const BaseStack = styled(Stack)(({ theme }) => {
  return {
    width: "100%",
    overflow: "auto",
    "& .TransactionsTitle": {
      fontSize: 12,
      fontWeight: 400,
      color: theme.normal.text0,
      marginTop: 16,
      marginBottom: 12,
    },
  };
});
const BorderItem = styled("div")(({ theme }) => ({
  width: "100%",
  height: 48,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: 8,
  border: `1px solid ${theme.normal.border}`,
  boxSizing: "border-box",
}));
const TransactionUl = styled("ul")(({ theme }) => ({
  width: "100%",
  height: 228,
  overflow: "scroll",
  "& li:hover": {
    cursor: "pointer",
  },
  "& li + li": {
    marginTop: 12,
  },
  "& svg": {
    width: 16,
    height: 16,
    display: "block",
  },
  "& button.success svg path": {
    fill: theme.normal.success,
  },
  "& button.fail svg path": {
    fill: theme.normal.danger,
  },
  "& p": {
    fontWeight: 400,
    fontSize: 14,
    color: theme.normal.text0,
  },
  "div + svg": {
    "& path": {
      fill: theme.normal.text2,
    },
  },
}));
const DisconnectButton = styled("button")(({ theme }) => ({
  fontWeight: 700,
  fontSize: 10,
  color: theme.normal.danger,
  "&:hover": {
    color: theme.normal.danger_hover,
  },
  "&:active": {
    color: theme.normal.danger_active,
  },
}));
const MyAddressStack = styled(Stack)(({ theme }) => ({
  "& svg": {
    width: 20,
    height: 20,
    display: "block",
  },
  "& p": {
    fontWeight: 700,
    fontSize: 14,
    color: theme.normal.text0,
    marginLeft: 8,
    marginRight: 8,
  },
}));

interface MyWalletModalProps {
  onClose: () => void;
}

const MyWalletModal: FC<MyWalletModalProps> = ({ ...props }) => {
  const { account, disconnect, chainsData } = useNEST();
  const { messageSnackBar } = useNESTSnackBar();
  const walletIcon = useWalletIcon();
  const transactionsData: Array<any> = useMemo(() => {
    var cache = localStorage.getItem(
      "transactionListV2" + chainsData.chain?.id.toString()
    );
    if (!cache) {
      return [];
    }
    return JSON.parse(cache);
  }, [chainsData.chain?.id]);
  const myAddress = (
    <BorderItem>
      <Stack
        direction={"row"}
        height={"100%"}
        justifyContent={"space-between"}
        spacing={0}
      >
        <MyAddressStack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={0}
        >
          {walletIcon}
          <p>{account.address?.showAddress()}</p>
          <LinkButton
            onClick={() => {
              copy(account.address ? account.address : "");
              messageSnackBar(t`Copy Successfully`);
            }}
          >
            <Copy style={{ width: "14px", height: "14px" }} />
          </LinkButton>
        </MyAddressStack>
        <DisconnectButton
          onClick={() => {
            disconnect.disconnect();
            props.onClose();
          }}
        >
          <Trans>Disconnect</Trans>
        </DisconnectButton>
      </Stack>
    </BorderItem>
  );

  const transactionLi = transactionsData.reverse().map((item, index) => {
    const Icon = item["success"] ? <Success /> : <Fail />;
    const iconClass = item["success"] ? "success" : "fail";
    return (
      <li
        key={`WalletTransaction + ${index}`}
        onClick={() => {
          window.open(item["hash"].hashToChainScan(chainsData.chainId));
        }}
      >
        <BorderItem
          sx={(theme) => ({
            "&:hover": {
              border: `1px solid ${theme.normal.bg3}`,
              background: theme.normal.bg3,
            },
          })}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"100%"}
          >
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              height={"100%"}
              spacing={"8px"}
            >
              <Box
                className={`${iconClass}`}
                width={"16px"}
                height={"24px"}
                component={"button"}
              >
                {Icon}
              </Box>
              <p>{item["title"]}</p>
            </Stack>
            <NEXT />
          </Stack>
        </BorderItem>
      </li>
    );
  });

  return (
    <BaseModal title={t`Wallet`} onClose={props.onClose}>
      <BaseStack spacing={0}>
        {myAddress}
        <p className="TransactionsTitle">
          <Trans>Recent transactions</Trans>
        </p>
        {transactionsData.length === 0 ? (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={(theme) => ({
              height: "168px",
              fontWeight: 400,
              fontSize: 14,
              color: theme.normal.text2,
            })}
          >
            <Trans>No Transactions yet</Trans>
          </Stack>
        ) : (
          <TransactionUl>{transactionLi}</TransactionUl>
        )}
      </BaseStack>
    </BaseModal>
  );
};

export default MyWalletModal;
