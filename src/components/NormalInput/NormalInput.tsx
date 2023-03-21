import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC } from "react";

interface NormalInputProps {
  placeHolder: string;
  rightTitle: string;
  value: string;
  changeValue: (value: string) => void;
  error?: boolean;
  style?: React.CSSProperties;
}

export const NormalInputBaseStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  height: "48px",
  borderRadius: "8px",
  background: theme.normal.bg1,
  border: `1px solid ${theme.normal.border}`,
  paddingLeft: "12px",
  paddingRight: "12px",
  "&:hover": {
    border: `1px solid ${theme.normal.primary}`,
  },
  "&.error": {
    border: `1px solid ${theme.normal.danger}`,
  },
  "& input": {
    color: theme.normal.text0,
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "22px",
    height: "22px",
    width: "100%",
    "&::placeHolder": {
      color: theme.normal.text3,
    },
  },
  "& p": {
    color: theme.normal.text0,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "22px",
    height: "22px",
  },
}));

const NormalInput: FC<NormalInputProps> = ({ ...props }) => {
  return (
    <NormalInputBaseStack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      style={props.style}
      className={props.error ? "error" : ""}
    >
      <input
        placeholder={props.placeHolder}
        value={props.value}
        maxLength={32}
        onChange={(e) => props.changeValue(e.target.value)}
      />
      <p>{props.rightTitle}</p>
    </NormalInputBaseStack>
  );
};

export default NormalInput;
