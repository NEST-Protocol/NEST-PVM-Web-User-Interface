import { FC, useMemo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import {
  Dark,
  Dashboard,
  FuturesIcon,
  Home,
  // Language,
  Light,
  NESTFiLogo,
  SwapExchangeSmall,
} from "../../../components/icons";
import Box from "@mui/material/Box";
import useWindowWidth, { WidthType } from "../../../hooks/useWindowWidth";
import { Link, useLocation } from "react-router-dom";
import ConnectButton from "./ConnectButton";
import NavMenu from "./NavMenu";
import useTheme from "../../../hooks/useTheme";
import NetMenu from "./NetMenu";
import { NavMenuV2, NavMenuV3 } from "./NavMenuV2Base";
import useNEST from "../../../hooks/useNEST";

export const NavItems = [
  { path: "/home", content: "Home", icon: Home },
  { path: "/futures", content: "Futures", icon: FuturesIcon },
  { path: "/swap", content: "Swap", icon: SwapExchangeSmall },
  { path: "/dashboard", content: "Dashboard", icon: Dashboard },
];

const NESTHead: FC = () => {
  const location = useLocation();
  const { width: widthLv, headHeight, isBigMobile, isPC } = useWindowWidth();
  const { nowTheme, changeTheme } = useTheme();
  const { account, chainsData } = useNEST();

  useEffect(() => {
    const chainIds = chainsData.chains.map((item) => item.id);
    if (
      account.address &&
      chainsData.chainId &&
      chainsData.switchNetwork &&
      chainsData.status === "idle"
    ) {
      if (chainIds.indexOf(chainsData.chainId) === -1) {
        chainsData.switchNetwork(chainsData.chains[0].id);
      } else if (
        location.pathname.indexOf(NavItems[1].path) === 0 &&
        chainsData.chainId === 1
      ) {
        chainsData.switchNetwork(chainsData.chains[0].id);
      }
    }
  }, [account.address, chainsData, location]);

  const NESTHeadStack = styled(Stack)(({ theme }) => ({
    background: theme.normal.bg0,
    borderBottom: `1px solid ${theme.normal.border}`,
    boxSizing: "content-box",
  }));
  const LogoBox = styled(Box)(({ theme }) => {
    const marginLeft = !isBigMobile ? 40 : 20;
    return {
      marginLeft: marginLeft,
      "& svg": {
        width: logoSize[0],
        height: logoSize[1],
        display: "block",
        "& path": {
          fill: theme.normal.text0,
        },
      },
    };
  });

  const LanBox = styled(Box)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
      "& path": {
        fill: theme.normal.text0,
      },
    },
    "& svg": {
      width: 24,
      height: 24,
      display: "block",
      "& path": {
        fill: theme.normal.text2,
      },
    },
  }));
  const ThemeBox = styled(LanBox)(({ theme }) => {
    return {};
  });
  const DashAndNetBox = styled(Box)(({ theme }) => {
    return {
      minWidth: 36,
      height: 36,
      fontWeight: 700,
      fontSize: 14,
      color: theme.normal.text0,
      background: theme.normal.bg1,
      borderRadius: 8,
      paddingLeft: 8,
      paddingRight: 8,
      "& .MuiBox-root": {},
      "& p": {
        height: "36px",
        lineHeight: "36px",
      },
      "&:hover": {
        cursor: "pointer",
        background: theme.normal.grey_hover,
      },
      "&:active": {
        background: theme.normal.grey_active,
      },
    };
  });
  const DashBox = styled(DashAndNetBox)(({ theme }) => {
    return {
      "& svg": {
        width: 14,
        height: 14,
        display: "block",
        "& path": {
          fill: theme.normal.text0,
        },
      },
    };
  });
  const logoSize = useMemo(() => {
    switch (widthLv) {
      case WidthType.ssm:
      case WidthType.sm:
        return [50, 24];
      default:
        return [67, 32];
    }
  }, [widthLv]);
  const showNav = useMemo(() => {
    switch (widthLv) {
      case WidthType.ssm:
      case WidthType.sm:
      case WidthType.md:
        return false;
      default:
        return true;
    }
  }, [widthLv]);
  const paddingRight = useMemo(() => {
    switch (widthLv) {
      case WidthType.ssm:
      case WidthType.sm:
        return 23.5;
      default:
        return 48.5;
    }
  }, [widthLv]);
  const hideText = useMemo(() => {
    switch (widthLv) {
      case WidthType.xl:
      case WidthType.xxl:
        return false;
      default:
        return true;
    }
  }, [widthLv]);

  const dashboard = () => {
    return (
      <DashBox>
        <Stack
          direction="row"
          justifyContent={"center"}
          alignItems="center"
          spacing={"8px"}
          width={"100%"}
          height={"100%"}
          onClick={() => {
            window.location.href = "/#/dashboard";
          }}
        >
          <Dashboard />
          {hideText ? <></> : <p>Dashboard</p>}
        </Stack>
      </DashBox>
    );
  };
  const nav = () => {
    const NavStack = styled(Stack)(({ theme }) => {
      return {
        "& a": {
          color: theme.normal.text0,
          fontWeight: 700,
          fontSize: 18,
          textDecoration: "none",
          marginLeft: 20,
          marginRight: 20,
          display: "block",
          lineHeight: `${headHeight}px`,
          borderBottom: `2px solid rgba(0, 0, 0, 0)`,
          boxSizing: "border-box",
          "&:hover": {
            color: theme.normal.primary,
          },
          "&.navSelected": {
            color: theme.normal.primary,
            borderBottom: `2px solid ${theme.normal.primary}`,
          },
        },
      };
    });
    const liList = NavItems.slice(0, 3).map((item, index) => {
      return (
        <Link
          className={`nav${
            location.pathname.indexOf(item.path) === 0 ? "Selected" : ""
          }`}
          key={`nav + ${index}`}
          to={item.path}
        >
          {item.content}
        </Link>
      );
    });
    return (
      <NavStack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0}
        height={headHeight}
      >
        {liList}
      </NavStack>
    );
  };

  const navMenu = useMemo(() => {
    switch (widthLv) {
      case WidthType.ssm:
        return <NavMenuV3 />;
      case WidthType.sm:
        return <NavMenuV2 />;
      case WidthType.md:
        return <NavMenu />;
      default:
        return <></>;
    }
  }, [widthLv]);

  return (
    <NESTHeadStack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
        width={"100%"}
        height={headHeight}
      >
        <LogoBox>
          <NESTFiLogo />
        </LogoBox>
      </Stack>

      {showNav ? nav() : <></>}

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={isPC ? "16px" : "12px"}
        width={"100%"}
        height={headHeight}
        paddingRight={`${paddingRight}px`}
      >
        {!isBigMobile ? dashboard() : <></>}
        <NetMenu />
        <ConnectButton />
        <Stack
          direction={"row"}
          spacing={"16px"}
          alignItems={"center"}
          paddingX={isBigMobile ? "0px" : "8px"}
        >
          {!isBigMobile ? (
            <>
              <ThemeBox onClick={changeTheme}>
                {nowTheme.isLight ? <Dark /> : <Light />}
              </ThemeBox>
            </>
          ) : (
            <></>
          )}
          {navMenu}
        </Stack>
      </Stack>
    </NESTHeadStack>
  );
};

export default NESTHead;
