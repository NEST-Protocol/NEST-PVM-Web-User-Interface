import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import { Long, Share, Short } from "../../../components/icons";
import { Trans } from "@lingui/macro";

interface OrderListPositionProps {
  tokenName: string;
  lever: number;
  isLong: boolean;
  shareCallBack: () => void;
  style?: React.CSSProperties;
}

const OrderListPosition: FC<OrderListPositionProps> = ({ ...props }) => {
  const TokenIcon = useMemo(() => {
    return props.tokenName.getToken()
      ? props.tokenName.getToken()!.icon
      : "ETH".getToken()!.icon;
  }, [props.tokenName]);
  const BaseToken = "USDT".getToken()!.icon;
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      style={props.style}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"4px"}
        sx={() => ({
          height: "24px",
        })}
      >
        <Stack
          direction={"row"}
          sx={{ "& svg": { width: "24px", height: "24px", display: "block" } }}
        >
          <TokenIcon style={{ marginRight: "-8px", position: "relative" }} />
          <BaseToken />
        </Stack>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
            marginLeft: "8px !important",
          })}
        >{`${props.tokenName}/USDT`}</Box>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={"4px"}
          alignItems={"center"}
          sx={(theme) => ({
            height: "20px",
            fontSize: 10,
            fontWeight: 700,
            color: props.isLong ? theme.normal.success : theme.normal.danger,
            borderRadius: "4px",
            paddingX: "4px",
            background: props.isLong
              ? theme.normal.success_light_hover
              : theme.normal.danger_light_hover,
            "& svg": {
              width: "10px",
              height: "10px",
              display: "block",
              "& path": {
                fill: props.isLong ? theme.normal.success : theme.normal.danger,
              },
            },
          })}
        >
          {props.isLong ? <Long /> : <Short />}
          {props.isLong ? (
            <p>
              <Trans>Long</Trans>
            </p>
          ) : (
            <p>
              <Trans>Short</Trans>
            </p>
          )}
        </Stack>
        <Box
          component={"button"}
          sx={(theme) => ({
            border: `1px solid ${theme.normal.border}`,
            borderRadius: "4px",
            height: "20px",
            paddingX: "4px",
            textAlign: "center",
            color: theme.normal.text2,
            fontWeight: 700,
            fontSize: 10,
          })}
        >{`${props.lever}X`}</Box>
      </Stack>
      <Box
        component={"button"}
        sx={(theme) => ({
          width: "16px",
          height: "16px",
          "& svg": {
            width: "16px",
            height: "16px",
            display: "block",
            "& path": {
              fill: theme.normal.text2,
            },
          },
        })}
        onClick={props.shareCallBack}
      >
        <Share />
      </Box>
    </Stack>
  );
};

export default OrderListPosition;
