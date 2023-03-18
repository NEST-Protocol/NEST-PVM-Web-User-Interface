import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, useMemo, CSSProperties} from "react";
import {Long, Short} from "../../../components/icons";

interface OrderTablePositionProps {
  tokenName: string;
  lever: number;
  isLong: boolean;
  style?: CSSProperties;
}

const OrderTablePosition: FC<OrderTablePositionProps> = ({...props}) => {
  const TokenIcon = useMemo(() => {
    return props.tokenName.getToken()
      ? props.tokenName.getToken()!.icon
      : "ETH".getToken()!.icon;
  }, [props.tokenName]);
  const BaseToken = "USDT".getToken()!.icon;
  return (
    <Stack
      direction={"row"}
      style={props.style}
      alignItems={"center"}
      spacing={"8px"}
      sx={() => ({
        height: "44px",
      })}
    >
      <Stack
        direction={"row"}
        sx={{"& svg": {width: "24px", height: "24px", display: "block"}}}
      >
        <TokenIcon style={{marginRight: "-8px", position: "relative"}}/>
        <BaseToken/>
      </Stack>
      <Box
        component={"p"}
        sx={(theme) => ({
          fontWeight: 700,
          fontSize: 14,
          color: theme.normal.text0,
        })}
      >
        {`${props.tokenName}/USDT`}
      </Box>
      <Stack direction={"row"} spacing={"4px"}>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={"4px"}
          alignItems={"center"}
          sx={(theme) => ({
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
                fill: props.isLong
                  ? theme.normal.success
                  : theme.normal.danger,
              },
            },
          })}
        >
          {props.isLong ? <Long/> : <Short/>}
          {props.isLong ? <p>Long</p> : <p>Short</p>}
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
    </Stack>
  );
};

export default OrderTablePosition;
