import { FC } from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { MainButtonProps } from "./MainButton";

const MainGhostButton: FC<MainButtonProps> = ({ ...props }) => {
  const MainButtonBox = styled('button')(({ theme }) => {
    return {
      width: "100%",
      height: 40,
      borderRadius: 12,
      border: `1px solid ${theme.normal.primary}`,
      color: theme.normal.primary,
      fontWeight: 700,
      fontSize: 16,
      "&:hover": {
        color: theme.normal.highDark,
        cursor: props.isLoading ? "not-allowed" : "pointer",
        background: theme.normal.primary_hover,
      },
      "&:active": {
        color: theme.normal.highDark,
        background: theme.normal.primary_active,
      },
      "&:disabled": {
        cursor: "not-allowed",
        border: `1px solid ${theme.normal.disabled_border}`,
        color: theme.normal.disabled_text,
      },
      "& .MuiCircularProgress-root": {
        color: theme.normal.highDark
      }
    };
  });
  return (
    <MainButtonBox onClick={props.onClick} disabled={props.disable} >
      {props.isLoading ? (<CircularProgress size={20}/>) : (<>{props.title}</>)}
    </MainButtonBox>
  );
};

export default MainGhostButton;
