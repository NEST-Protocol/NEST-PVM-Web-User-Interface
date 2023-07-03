import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { NEXT } from "../../components/icons";
import NESTLine from "../../components/NESTLine";
import { Trans } from "@lingui/macro";

const InfoBox = styled(Box)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 14,
  height: "20px",
  lineHeight: "20px",
  color: theme.normal.primary,
}));

const NextBox = styled(Box)(({ theme }) => ({
  width: 14,
  height: 14,
  "& svg": {
    width: 14,
    height: 14,
    display: "block",
    "& path": {
      fill: theme.normal.text2,
    },
  },
}));

const FuturesMoreInfo: FC = () => {
  return (
    <Stack
      spacing={"16px"}
      sx={(theme) => ({
        paddingY: "31.5px",
        border: `1px solid ${theme.normal.border}`,
        borderRadius: "12px",
        width: "100%",
      })}
    >
      <Box
        component={"p"}
        sx={(theme) => ({
          paddingX: "20px",
          fontWeight: 700,
          fontSize: 16,
          height: "22px",
          lingHeight: "22px",
          width: "100%",
          textAlign: "left",
          color: theme.normal.text0,
        })}
      >
        <Trans>More Info</Trans>
      </Box>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          component={"button"}
          onClick={() => {
            window.open("https://nestprotocol.org/doc/ennestwhitepaper.pdf");
          }}
          sx={(theme) => ({
            paddingX: "20px",
            height: "60px",
            "&:hover": { cursor: "pointer", background: theme.normal.bg1 },
          })}
        >
          <InfoBox component={"p"}>
            <Trans>NEST White Paper</Trans>
          </InfoBox>
          <NextBox>
            <NEXT />
          </NextBox>
        </Stack>
        <NESTLine style={{ padding: "0 20px" }} />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          component={"button"}
          onClick={() => {
            window.open(
              "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website"
            );
          }}
          sx={(theme) => ({
            paddingX: "20px",
            height: "60px",
            "&:hover": { cursor: "pointer", background: theme.normal.bg1 },
          })}
        >
          <InfoBox component={"p"}>
            <Trans>How to Play</Trans>
          </InfoBox>
          <NextBox>
            <NEXT />
          </NextBox>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FuturesMoreInfo;
