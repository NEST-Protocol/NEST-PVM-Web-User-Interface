import { styled } from "@mui/material/styles";

const NESTa = styled("a")(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  color: theme.normal.primary,
  "&:hover": {
    cursor: "pointer",
    color: theme.normal.primary_hover,
  },
  "&:active": {
    color: theme.normal.primary_active,
  },
}));

export default NESTa;
