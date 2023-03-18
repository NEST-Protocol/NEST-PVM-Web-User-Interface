import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import { NESTTooltipFC } from "../NESTTooltip/NESTTooltip";

interface NormalInfoProps {
  title: string;
  value: string;
  symbol: string;
  help?: boolean;
  helpInfo?: JSX.Element;
  style?: React.CSSProperties;
}

const NormalInfo: FC<NormalInfoProps> = ({ ...props }) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      style={props.style}
      height={"20px"}
      width={"100%"}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Box
          component={"p"}
          sx={(theme) => ({
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: theme.normal.text2,
            marginRight: "4px",
          })}
        >
          {props.title}
        </Box>
        {props.help ? <NESTTooltipFC title={props.helpInfo} /> : <></>}
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Box
          component={"p"}
          sx={(theme) => ({
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: theme.normal.text0,
          })}
        >
          {props.value}
        </Box>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: theme.normal.text0,
            marginLeft: "4px",
          })}
        >
          {props.symbol}
        </Box>
      </Stack>
    </Stack>
  );
};

export default NormalInfo;
