import { styled } from "@mui/material/styles";

const LinkButton = styled("button")(({ theme }) => ({
  color: theme.normal.primary,
  "& a": {
    color: theme.normal.primary,
  },
  "& svg path": {
    fill: theme.normal.primary,
  },
  "&:hover": {
    cursor: "pointer",
    color: theme.normal.primary_hover,
    "& a": {
      color: theme.normal.primary_hover,
    },
    "& svg path": {
      fill: theme.normal.primary_hover,
    },
  },
  "&:active": {
    color: theme.normal.primary_active,
    "& a": {
      color: theme.normal.primary_active,
    },
    "& svg path": {
      fill: theme.normal.primary_active,
    },
  },
}));

export default LinkButton;
