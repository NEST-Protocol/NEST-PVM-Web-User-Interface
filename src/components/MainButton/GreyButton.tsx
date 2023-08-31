import { FC, useMemo } from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

export interface GreyButtonProps {
  title: string;
  onClick: () => void;
  isLoading?: boolean;
  disable?: boolean;
  style?: React.CSSProperties;
}
const GreyButtonBox = styled("button")(({ theme }) => {
  return {
    width: "100%",
    height: 40,
    borderRadius: 12,
    background: theme.normal.grey,
    color: theme.normal.highDark,
    fontWeight: 700,
    fontSize: 16,
    "&:hover": {
      background: theme.normal.grey_hover,
    },
    "&:active": {
      background: theme.normal.grey_active,
    },
    "&:disabled": {
      cursor: "not-allowed",
      background: theme.normal.disabled_bg,
      color: theme.normal.disabled_text,
    },
    "& .MuiCircularProgress-root": {
      color: theme.normal.text0,
    },
  };
});
const GreyButton: FC<GreyButtonProps> = ({ ...props }) => {
  const main = useMemo(() => {
    return props.isLoading ? (
      <CircularProgress size={20} />
    ) : (
      <>{props.title}</>
    );
  }, [props.isLoading, props.title]);
  return (
    <GreyButtonBox
      sx={{
        "&:hover": { cursor: props.isLoading ? "not-allowed" : "pointer" },
      }}
      onClick={props.onClick}
      disabled={props.disable}
      style={props.style}
    >
      {main}
    </GreyButtonBox>
  );
};

export default GreyButton;
