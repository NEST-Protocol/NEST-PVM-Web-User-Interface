import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { ETHLogo } from "../icons";

interface OneTokenINProps {
  tokenName: string;
  height: number;
}

const OneTokenIN: FC<OneTokenINProps> = ({ ...props }) => {
  const OneTokenINStack = styled(Stack)(({ theme }) => {
    return {
      height: props.height,
      "& svg": {
        width: props.height,
        height: props.height,
        display: "block",
      },
      "& p": {
        height: props.height,
        lineHeight: `${props.height}px`,
        fontWeight: 400,
        fontSize: 16,
        color: theme.normal.text0,
      },
    };
  });
  const TokenLogo = useMemo(() => {
    const token = props.tokenName.getToken()
    return token ? token.icon : ETHLogo
  },[props.tokenName])
  return (
    <OneTokenINStack
      direction={"row"}
      justifyContent={"space-between"}
      spacing={"8px"}
    >
      <TokenLogo/>
      <p>{props.tokenName}</p>
    </OneTokenINStack>
  );
};

export default OneTokenIN;
