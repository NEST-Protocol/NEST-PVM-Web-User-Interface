import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const FuturesOrderListInfo = styled(Stack)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  "& p": {
    color: theme.normal.text2,
  },
  "& p+ p": {
    color: theme.normal.text0,
  },
}));

export const FuturesOrderListInfoMain = styled(Stack)(({ theme }) => ({
  "& p": {
    fontSize: 12,
    fontWeight: 400,
    color: theme.normal.text2,
  },
  "& p + p": {
    fontSize: 14,
    fontWeight: 700,
    color: theme.normal.text0,
    "& span": {
      display: 'block',
    },
    "& span + span": {
      fontSize: 10,
      fontWeight: 400,
      "&.Long": {
        color: theme.normal.success,
      },
      "&.Short": {
        color: theme.normal.danger,
      },
    },
  },
}));

export default FuturesOrderListInfo;
