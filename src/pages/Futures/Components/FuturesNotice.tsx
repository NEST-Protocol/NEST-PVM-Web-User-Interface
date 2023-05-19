import Stack from "@mui/material/Stack";
import { FC } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { Close, Notice } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import Box from "@mui/material/Box";
import LinkButton from "../../../components/MainButton/LinkButton";
import { Trans, t } from "@lingui/macro";

interface FuturesNoticeProps {
  onClose: () => void;
}

const FuturesNotice: FC<FuturesNoticeProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      spacing={"12px"}
      alignItems={"center"}
      sx={(theme) => {
        const paddingX = isBigMobile ? "20px" : "24px";
        return {
          paddingX: paddingX,
          paddingY: "16px",
          background: theme.normal.bg1,
          borderRadius: isBigMobile ? "0px" : "12px",
        };
      }}
    >
      <Stack
        direction={"row"}
        spacing={"12px"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        sx={(theme) => ({
          "& p": {
            color: theme.normal.text0,
            fontWeight: 400,
            fontSize: "14px",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            width: "16px",
            height: "16px",
            "& svg": {
              "& path": {
                fill: theme.normal.text0,
              },
            },
          })}
        >
          <Notice style={{ width: "16px", height: "16px" }} />
        </Box>

        <p>
          <Trans>
            For the positions opened before April 6, 2023, please go to→
          </Trans>
          <span> </span>
          <LinkButton
            onClick={() => {
              window.open("https://previous.nestfi.org");
            }}
            sx={{ fontSize: "14px" }}
          >
            previous.nestfi.org
          </LinkButton>{" "}
          <Trans>to check and close.</Trans>
        </p>
      </Stack>
      <Stack
        direction={"row"}
        spacing={isBigMobile ? "12px" : "24px"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <MainButton
          title={t`View`}
          onClick={() => {
            window.open("https://previous.nestfi.org/#/futures");
          }}
          style={{
            height: "24px",
            width: "49px",
            fontSize: 10,
            borderRadius: 4,
          }}
        />
        <Box
          component={"button"}
          sx={(theme) => ({
            width: "16px",
            height: "16px",
            "& svg": {
              "& path": {
                fill: theme.normal.text2,
              },
            },
            "&:hover": {
              cursor: "pointer",
            },
          })}
          onClick={() => {
            localStorage.setItem("FuturesNoticeV1", "1");
            props.onClose();
          }}
        >
          <Close style={{ width: "16px", height: "16px" }} />
        </Box>
      </Stack>
    </Stack>
  );
};

export default FuturesNotice;
