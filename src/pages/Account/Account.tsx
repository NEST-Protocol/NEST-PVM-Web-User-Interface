import Stack from "@mui/material/Stack";
import { FC, useMemo, useState } from "react";
import useWindowWidth from "../../hooks/useWindowWidth";
import useWalletIcon from "../../hooks/uswWalletIcon";
import useNEST from "../../hooks/useNEST";
import LinkButton from "../../components/MainButton/LinkButton";
import copy from "copy-to-clipboard";
import { Copy, Deposit, Withdraw } from "../../components/icons";
import { Trans, t } from "@lingui/macro";
import useNESTSnackBar from "../../hooks/useNESTSnackBar";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import MobileList, { AccountListType } from "./Components/MobileList";
import MoneyTable from "./Components/MoneyTable";
import TransactionTable from "./Components/TransactionTable";
import useAccount from "../../hooks/useAccount";
import DepositModal from "../Share/Modal/DepositModal";
import WithDrawModal from "../Share/Modal/WithdrawModal";

const Account: FC = () => {
  const { isBigMobile } = useWindowWidth();
  const walletIcon = useWalletIcon();
  const { account } = useNEST();
  const { messageSnackBar } = useNESTSnackBar();
  const [tabsValue, setTabsValue] = useState(0);
  const { showDeposit, setShowDeposit, showWithdraw, setShowWithdraw } =
    useAccount();

  const NESTIcon = useMemo(() => {
    return "NEST".getToken()!.icon;
  }, []);
  const tabs = useMemo(() => {
    const accountTabsData = [
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <p>
          <Trans>Deposit</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <p>
          <Trans>Withdraw</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <p>
          <Trans>Transaction</Trans>
        </p>
      </Stack>,
    ];
    return (
      <NESTTabs
        value={tabsValue}
        className={"AccountTabs"}
        datArray={accountTabsData}
        height={44}
        space={24}
        selectCallBack={(value: number) => setTabsValue(value)}
        isFull={false}
      />
    );
  }, [tabsValue]);
  const listType = useMemo(() => {
    if (tabsValue === 0) {
      return AccountListType.deposit;
    } else if (tabsValue === 1) {
      return AccountListType.withdraw;
    } else {
      return AccountListType.transaction;
    }
  }, [tabsValue]);
  const list = useMemo(() => {
    if (isBigMobile) {
      return (
        <Stack spacing={"16px"}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
            return (
              <MobileList
                key={`AccountMobileList + ${index}`}
                type={listType}
              />
            );
          })}
        </Stack>
      );
    } else {
      if (tabsValue <= 1) {
        return <MoneyTable />;
      } else {
        return <TransactionTable />;
      }
    }
  }, [isBigMobile, listType, tabsValue]);
  return (
    <>
      <DepositModal open={showDeposit} onClose={() => setShowDeposit(false)} />
      <WithDrawModal
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
      />
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Stack
          spacing={"24px"}
          maxWidth={"1100px"}
          width={"100%"}
          paddingX={"24px"}
          paddingY={isBigMobile ? "24px" : "40px"}
        >
          <Stack
            direction={isBigMobile ? "column" : "row"}
            spacing={isBigMobile ? "40px" : undefined}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingY={"40px"}
            paddingX={"24px"}
            sx={(theme) => ({
              background: theme.normal.bg1,
              borderRadius: "12px",
            })}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={"8px"}
              sx={(theme) => ({
                "& svg": {
                  width: 40,
                  height: 40,
                  display: "block",
                },
                "& p": {
                  fontWeight: 700,
                  fontSize: 20,
                  color: theme.normal.text0,
                },
              })}
            >
              {walletIcon}
              <p>{account.address?.showAddress()}</p>
              <LinkButton
                onClick={() => {
                  copy(account.address ? account.address : "");
                  messageSnackBar(t`Copy Successfully`);
                }}
              >
                <Copy style={{ width: "16px", height: "16px" }} />
              </LinkButton>
            </Stack>
            <Stack
              direction={"row"}
              spacing={"40px"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack spacing={"4px"} alignItems={"end"}>
                <Box
                  sx={(theme) => ({
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: theme.normal.text1,
                  })}
                >
                  <Trans>My balance</Trans>
                </Box>
                <Stack
                  direction={"row"}
                  spacing={"8px"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                >
                  <Box
                    sx={(theme) => ({
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: theme.normal.text0,
                    })}
                  >
                    45674.34
                  </Box>
                  <Box
                    sx={() => ({
                      width: "20px",
                      height: "20px",
                      "& svg": {
                        width: "20px",
                        height: "20px",
                      },
                    })}
                  >
                    <NESTIcon />
                  </Box>
                </Stack>
              </Stack>
              <Divider
                orientation="vertical"
                sx={(theme) => ({
                  borderColor: theme.normal.border,
                  height: "48px",
                })}
              />
              <Stack
                direction={"row"}
                spacing={"16px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack
                  spacing={"4px"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  component={"button"}
                  onClick={() => setShowDeposit(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      "& svg": {
                        width: "24px",
                        height: "24px",
                      },
                    }}
                  >
                    <Deposit />
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "14px",
                      color: theme.normal.text0,
                    })}
                  >
                    <Trans>Deposit</Trans>
                  </Box>
                </Stack>
                <Stack
                  spacing={"4px"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  component={"button"}
                  onClick={() => setShowWithdraw(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      "& svg": {
                        width: "24px",
                        height: "24px",
                      },
                    }}
                  >
                    <Withdraw />
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "14px",
                      color: theme.normal.text0,
                    })}
                  >
                    <Trans>Withdraw</Trans>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={isBigMobile ? "12px" : "16px"}>
            <Stack
              direction={"row"}
              justifyContent={"start"}
              paddingX={isBigMobile ? "0px" : "16px"}
              sx={(theme) => ({
                borderBottom: isBigMobile
                  ? `1px solid none`
                  : `1px solid ${theme.normal.border}`,
                boxSizing: "border-box",
              })}
            >
              {tabs}
            </Stack>
            {list}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Account;
