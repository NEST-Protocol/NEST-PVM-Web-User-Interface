import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../components/MainButton/MainButton";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import { Add } from "../../components/icons";
import useNEST from "../../hooks/useNEST";
import { useDirectPoster } from "./useDirectPoster";
import useWindowWidth from "../../hooks/useWindowWidth";

const DirectPoster: FC = () => {
  const { addNESTToWallet } = useNEST();
  const { isBigMobile } = useWindowWidth();
  const {
    showNESTBalance,
    showETHBalance,
    getNESTError,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useDirectPoster();
  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
      <Stack
        spacing={"40px"}
        marginTop={isBigMobile ? "52px" : "80px"}
        maxWidth={"450px"}
        width={"100%"}
        paddingX={"20px"}
      >
        <Stack
          paddingX={"20px"}
          paddingY={"32px"}
          sx={(theme) => ({
            borderRadius: "12px",
            border: `1px solid ${theme.normal.border}`,
          })}
        >
          <DirectPosterItem
            balance={showETHBalance}
            error={undefined}
            tokenName="ETH"
            callBack={() => {
              window.open("https://guide.scroll.io/user-guide/faucet");
            }}
            title={t`GET` + ` ETH ` + t`Testnet token`}
          />
        </Stack>
        <Stack
          paddingX={"20px"}
          paddingY={"32px"}
          spacing={"24px"}
          sx={(theme) => ({
            borderRadius: "12px",
            border: `1px solid ${theme.normal.border}`,
          })}
        >
          <DirectPosterItem
            balance={showNESTBalance}
            error={getNESTError}
            tokenName="NEST"
            callBack={mainButtonAction}
            title={mainButtonTitle}
            loading={mainButtonLoading}
            dis={mainButtonDis}
          />
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"4px"}
            width={"auto"}
            component={"button"}
            sx={(theme) => ({
              border: `1px solid ${theme.normal.border}`,
              height: "36px",
              borderRadius: "8px",
              paddingX: "8px",
              color: theme.normal.text2,
              "&:hover": {
                cursor: "pointer",
                color: theme.normal.text0,
                border: `1px solid ${theme.normal.grey_hover}`,
                background: theme.normal.grey_hover,
              },
              "&:active": {
                cursor: "pointer",
                color: theme.normal.text0,
                border: `1px solid ${theme.normal.grey_active}`,
                background: theme.normal.grey_active,
              },
              "& svg": {
                width: "12px",
                height: "12px",
                display: "block",
                "& path": {
                  fill: theme.normal.text2,
                },
              },
            })}
            onClick={addNESTToWallet}
          >
            <Add />
            <Box
              component={"p"}
              sx={(theme) => ({
                fontSize: 14,
                fontWeight: 400,
              })}
            >
              <Trans>Add NEST to wallet</Trans>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface DirectPosterItemProps {
  tokenName: string;
  balance: string;
  title: string;
  error: string | undefined;
  callBack: () => void;
  loading?: boolean;
  dis?: boolean;
}

const DirectPosterItem: FC<DirectPosterItemProps> = ({ ...props }) => {
  const TokenIcon = useMemo(() => {
    const token = props.tokenName.getToken();
    return token ? token.icon : "ETH".getToken()!.icon;
  }, [props.tokenName]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack spacing={"8px"}>
          <Box
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: `28px`,
              color: theme.normal.text0,
            })}
          >
            {props.title}
          </Box>
          <Box
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: `16px`,
              color: theme.normal.text2,
              "& span": {
                color: theme.normal.text0,
              },
            })}
          >
            {t`Balance:`}
            <span>
              {props.balance} {props.tokenName}
            </span>
          </Box>
        </Stack>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            "& svg": { width: "40px", height: "40px" },
          }}
        >
          <TokenIcon />
        </Box>
      </Stack>
      {props.error ? (
        <Box
          sx={(theme) => ({
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: `20px`,
            color: theme.normal.danger,
          })}
        >
          {props.error}
        </Box>
      ) : (
        <></>
      )}
      <MainButton
        title={`GET ${props.tokenName}`}
        disable={props.dis ?? false}
        isLoading={props.loading ?? false}
        onClick={props.callBack}
        style={{ width: "100%", height: "48px" }}
      />
    </Stack>
  );
};

export default DirectPoster;
