import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";

const SelectListMenu = styled(Menu)(({ theme }) => {
  return {
    "& .MuiPaper-root": {
      minWidth: 180,
      paddingTop: 20,
      paddingBottom: 20,
      background: theme.normal.bg0,
      border: `1px solid ${theme.normal.border}`,
      borderRadius: 8,
      boxShadow: 'none',
      "& .MuiList-root": {
        padding: 0,
      }
    },
  };
});

export default SelectListMenu;
