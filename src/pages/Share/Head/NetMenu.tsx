import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo, useState } from "react";
import { BNBLogo, ETHLogo, NetworkDownIcon } from "../../../components/icons";
import OneIconWithString from "../../../components/IconWithString/OneIconWithString";
import SelectListMenu from "../../../components/SelectListMemu/SelectListMenu";
import useNEST from "../../../hooks/useNEST";
import useWindowWidth, { WidthType } from "../../../hooks/useWindowWidth";

const NetButton = styled("button")(({ theme }) => {
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
    "& p": {
      height: "36px",
      lineHeight: "36px",
      marginRight: 8,
    },
    "&:hover": {
      cursor: "pointer",
      background: theme.normal.grey_hover,
    },
    "&:active": {
      background: theme.normal.grey_active,
    },
    "& .NetWorkDown path": {
      fill: theme.normal.text2,
    },
  };
});

const networkArray = [
  { icon: ETHLogo, title: "Ethereum", chainId: 1 },
  // { icon: BNBLogo, title: "BNB", chainId: 56 },
  { icon: BNBLogo, title: "BNBTest", chainId: 97 },
];

const NetMenu: FC = () => {
  const { chainsData, setShowConnect } = useNEST();
  const { width: widthLv } = useWindowWidth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const nowChainName = useMemo(() => {
    if (chainsData.chainId) {
      const net = networkArray.filter(
        (item) => item.chainId === chainsData.chainId
      );
      return net.length > 0 ? net[0].title : "Ethereum";
    } else {
      return "Ethereum";
    }
  }, [chainsData.chainId]);

  const NowChainIcon = useMemo(() => {
    if (chainsData.chainId) {
      const net = networkArray.filter(
        (item) => item.chainId === chainsData.chainId
      );
      return net.length > 0 ? net[0].icon : ETHLogo;
    } else {
      return ETHLogo;
    }
  }, [chainsData.chainId]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const hideText = useMemo(() => {
    switch (widthLv) {
      case WidthType.xl:
      case WidthType.xxl:
        return false;
      default:
        return true;
    }
  }, [widthLv]);
  const netList = useMemo(() => {
    return networkArray.map((item, index) => {
      return (
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={(theme) => ({
            height: "40px",
            paddingX: "20px",
            "&:hover": {
              background: theme.normal.bg1,
            },
          })}
        >
          <OneIconWithString
            key={`NetList + ${index}`}
            icon={item.icon}
            title={item.title}
            selected={nowChainName === item.title}
            onClick={() => {
              if (chainsData && chainsData.switchNetwork) {
                chainsData.switchNetwork(item.chainId);
              } else {
                setShowConnect(true);
              }
              handleClose();
            }}
          />
        </Stack>
      );
    });
  }, [chainsData, nowChainName, setShowConnect]);
  return (
    <>
      <NetButton
        aria-controls={"net-menu"}
        aria-haspopup="true"
        aria-expanded={"true"}
        onClick={handleClick}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={0}
          width={"100%"}
        >
          <NowChainIcon
            style={{
              marginRight: 8,
              width: "20px",
              height: "20px",
              display: "block",
            }}
          />
          {hideText ? <></> : <p>{nowChainName}</p>}
          <NetworkDownIcon className="NetWorkDown" />
        </Stack>
      </NetButton>
      <SelectListMenu
        id="net-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Stack>{netList}</Stack>
      </SelectListMenu>
    </>
  );
};

export default NetMenu;
