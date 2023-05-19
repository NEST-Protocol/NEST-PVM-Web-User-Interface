import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MobileListIcon } from "../../../components/icons";
import Box from "@mui/material/Box";
import { NavItems } from "./NESTHead";
import { Link, useLocation } from "react-router-dom";

export const MobileListButton = styled("button")(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
  "& svg": {
    width: 22,
    height: 22,
    display: "block",
    "& path": {
      fill: theme.normal.text1,
    },
  },
}));

const NavMenu: FC = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledMenu = styled(Menu)(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 12,
      background: theme.normal.bg0,
      boxSizing: "border-box",
      border: `1px solid ${theme.normal.border}`,
      padding: "20px 0px",
      boxShadow: 'none',
      "& .MuiMenu-list": {
        padding: 0,
      },
      "& .MuiMenuItem-root": {
        height: 40,
        padding: "0px 20px",
        borderRadius: 8,
        "& button": {
          width: 24,
          height: 24,
          marginRight: 8,
          borderRadius: 12,
          background: theme.normal.bg1,
          "& svg": {
            width: 12,
            height: 12,
            display: "block",
            margin: "auto auto",
            "& path": {
              fill: theme.normal.text1,
            },
          },
        },
        "& a": {
          fontSize: 16,
          fontWeight: 700,
          color: theme.normal.text1,
        },
        "&:hover": {
          "& a": {
            color: theme.normal.primary,
          },
          background: theme.normal.bg1,
        },
        "&.navSelected": {
          "& a": {
            color: theme.normal.primary,
          },
          "& button": {
            background: theme.normal.primary,
            "& svg path": {
              fill: theme.normal.highDark,
            },
          },
        },
        "&:active": {
          background: theme.normal.bg1,
        },
      },
    },
  }));
  const liList = NavItems.slice(0, 3).map((item, index) => {
    const Icon = item.icon
    return (
      <MenuItem
        key={`nav + ${index}`}
        onClick={handleClose}
        className={`nav${
          location.pathname.indexOf(item.path) === 0 ? "Selected" : ""
        }`}
      >
        <button>
          <Icon />
        </button>
        <Link to={item.path}>{item.l}</Link>
      </MenuItem>
    );
  });
  return (
    <>
      <Box
        id="nav-button"
        width={22}
        height={22}
        aria-controls={"nav-menu"}
        aria-haspopup="true"
        aria-expanded={"true"}
        onClick={handleClick}
      >
        <MobileListButton>
          <MobileListIcon />
        </MobileListButton>
      </Box>

      <StyledMenu
        id="nav-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {liList}
      </StyledMenu>
    </>
  );
};

export default NavMenu;
