import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../components/MainButton/MainButton";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import { Add } from "../../components/icons";
import useNEST from "../../hooks/useNEST";

const DirectPoster: FC = () => {
  const { addNESTToWallet } = useNEST();
  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
      <Stack
        spacing={"40px"}
        marginTop={"80px"}
        maxWidth={"450px"}
        width={"100%"}
      >
        <Stack
          paddingX={"20px"}
          paddingY={"32px"}
          sx={(theme) => ({
            borderRadius: "12px",
            border: `1px solid ${theme.normal.border}`,
          })}
        >
          <DirectPosterItem tokenName="ETH" callBack={() => {}} />
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
          <DirectPosterItem tokenName="NEST" callBack={() => {}} />
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
  callBack: () => void;
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
            {t`GET` + ` ${props.tokenName} ` + t`Testnet token`}
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
            <span>- {props.tokenName}</span>
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
      <MainButton
        title={`GET ${props.tokenName}`}
        onClick={props.callBack}
        style={{ width: "100%", height: "48px" }}
      />
    </Stack>
  );
};

export default DirectPoster;
