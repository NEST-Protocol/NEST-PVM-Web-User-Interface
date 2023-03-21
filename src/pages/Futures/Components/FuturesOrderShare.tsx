import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const FuturesOrderShare = styled(Box)(({ theme }) => ({
  borderRadius: "8px",
  border: `1px solid ${theme.normal.border}`,
  width: "36px",
  height: "36px",
  "& svg": {
    width: "14px",
    height: "14px",
    display: "block",
    margin: "0 auto",
    "& path": {
      fill: theme.normal.text2,
    },
  },
  "&:hover": {
    cursor: 'pointer',
    border: `1px solid ${theme.normal.grey_hover}`,
    background: theme.normal.grey_hover,
    "& svg path": {
      fill: theme.normal.text0,
    },
  },
  "&:active": {
    border: `1px solid ${theme.normal.grey_active}`,
    background: theme.normal.grey_active,
    "& svg path": {
      fill: theme.normal.text0,
    },
  },
}));

export default FuturesOrderShare;
