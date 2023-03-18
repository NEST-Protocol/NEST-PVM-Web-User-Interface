import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, useMemo, CSSProperties} from "react";
import {Long, Short} from "../../../components/icons";

interface ShareOrderPositionProps {
  tokenName: string;
  lever: string;
  isLong: boolean;
  style?: CSSProperties;
}

const ShareOrderPosition: FC<ShareOrderPositionProps> = ({...props}) => {
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
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "32px",
          color: "#F9F9F9",
        })}
      >
        {`${props.tokenName}/USDT`}
      </Box>
      <Stack px={'6px'}>
        <Box sx={{
          height: "24px",
          width: "0",
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}/>
      </Stack>
      <Box
        sx={(theme) => ({
          lineHeight: "32px",
          color: "#F9F9F9",
          fontWeight: 400,
          fontSize: "24px",
        })}
      >{`${props.lever}`}</Box>
      <Stack px={'6px'}>
        <Box sx={{
          height: "24px",
          width: "0",
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}/>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        spacing={"4px"}
        alignItems={"center"}
        sx={(theme) => ({
          fontSize: "12px",
          fontWeight: 700,
          color: props.isLong ? theme.normal.success : theme.normal.danger,
          borderRadius: "4px",
          padding: "4px",
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
    </Stack>
  );
};

export default ShareOrderPosition;
