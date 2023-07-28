import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC } from "react";

interface TokenAmountButtonsProps {
  nowValue: number;
  callBack: (num: number) => void;
}

const TokenAmountButtons: FC<TokenAmountButtonsProps> = ({ ...props }) => {
  return (
    <Stack
      direction={"row"}
      spacing={"8px"}
      justifyContent={"spacing-between"}
      alignItems={"center"}
      width={"100%"}
    >
      <Stack
        spacing={"4px"}
        width={"100%"}
        component={"button"}
        alignItems={"center"}
        onClick={() => props.callBack(1)}
      >
        <Box
          width={"100%"}
          sx={(theme) => ({
            height: "12px",
            background:
              props.nowValue >= 1 ? theme.normal.text3 : theme.normal.bg3,
          })}
        ></Box>
        <Box
          sx={(theme) => ({
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            color:
              props.nowValue === 1 ? theme.normal.text0 : theme.normal.text2,
          })}
        >
          25%
        </Box>
      </Stack>
      <Stack
        spacing={"4px"}
        width={"100%"}
        component={"button"}
        alignItems={"center"}
        onClick={() => props.callBack(2)}
      >
        <Box
          width={"100%"}
          sx={(theme) => ({
            height: "12px",
            background:
              props.nowValue >= 2 ? theme.normal.text3 : theme.normal.bg3,
          })}
        ></Box>
        <Box
          sx={(theme) => ({
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            color:
              props.nowValue === 2 ? theme.normal.text0 : theme.normal.text2,
          })}
        >
          50%
        </Box>
      </Stack>
      <Stack
        spacing={"4px"}
        width={"100%"}
        component={"button"}
        alignItems={"center"}
        onClick={() => props.callBack(3)}
      >
        <Box
          width={"100%"}
          sx={(theme) => ({
            height: "12px",
            background:
              props.nowValue >= 3 ? theme.normal.text3 : theme.normal.bg3,
          })}
        ></Box>
        <Box
          sx={(theme) => ({
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            color:
              props.nowValue === 3 ? theme.normal.text0 : theme.normal.text2,
          })}
        >
          75%
        </Box>
      </Stack>
      <Stack
        spacing={"4px"}
        width={"100%"}
        component={"button"}
        alignItems={"center"}
        onClick={() => props.callBack(4)}
      >
        <Box
          width={"100%"}
          sx={(theme) => ({
            height: "12px",
            background:
              props.nowValue >= 4 ? theme.normal.text3 : theme.normal.bg3,
          })}
        ></Box>
        <Box
          sx={(theme) => ({
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            color:
              props.nowValue === 4 ? theme.normal.text0 : theme.normal.text2,
          })}
        >
          100%
        </Box>
      </Stack>
    </Stack>
  );
};

export default TokenAmountButtons;
