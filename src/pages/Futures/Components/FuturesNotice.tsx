import Stack from "@mui/material/Stack";
import { FC } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { Close, Notice } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import Box from "@mui/material/Box";
import { Trans, t } from "@lingui/macro";
import useNEST from "../../../hooks/useNEST";

interface FuturesNoticeProps {
  onClose: () => void;
}

const FuturesNotice: FC<FuturesNoticeProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();
  const { addNESTToWallet } = useNEST();
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
          NEST 2.0 token has been airdropped to your wallet, please add NEST 2.0 token to your wallet.  
          </Trans>
          
        </p>
      </Stack>
      <Stack
        direction={"row"}
        spacing={isBigMobile ? "12px" : "24px"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <MainButton
          title={t`Add NEST 2.0 to wallet.`}
          onClick={addNESTToWallet}
          style={{
            height: "24px",
            width: "130px",
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
