import { FC, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Link, useLocation } from "react-router-dom";
import { Close, MobileListIcon, NEXT } from "../../../components/icons";
import NESTLine from "../../../components/NESTLine";
import { FootAList, NESTFootStack } from "../Foot/NESTFoot";
import Box from "@mui/material/Box";
import { MobileListButton } from "./NavMenu";
import Menu from "@mui/material/Menu";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import useTheme from "../../../hooks/useTheme";
import useNEST from "../../../hooks/useNEST";
import { Trans } from "@lingui/macro";
import { i18n } from "@lingui/core";
import { LanData } from "./LanguageMenu";
import LanguageModal from "../Modal/LanguageModal";

const NavMenu = styled(Stack)(({ theme }) => {
  return {};
});

const NextBox = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  "& svg": {
    width: 16,
    height: 16,
    display: "block",
    "& path": {
      fill: theme.normal.text2,
    },
  },
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    width: 20,
    height: 20,
    margin: 2,
    padding: 0,
    "&.Mui-checked": {
      "& .MuiSwitch-thumb:before": {
        backgroundPosition: "4px 4px",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C2.68629 12 0 9.31371 0 6C0 5.58417 0.0423823 5.17765 0.123249 4.78476C0.174362 4.53642 0.389854 4.35605 0.64331 4.34945C0.896767 4.34285 1.12135 4.51177 1.18532 4.75711C1.51317 6.01461 2.65721 6.94214 4.01654 6.94214C5.63232 6.94214 6.94214 5.63232 6.94214 4.01654C6.94214 2.65721 6.01461 1.51316 4.75712 1.18533C4.51178 1.12137 4.34286 0.896791 4.34945 0.643336C4.35604 0.389881 4.53641 0.174386 4.78474 0.123265C5.17764 0.0423858 5.58417 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12Z" fill="${encodeURIComponent(
          theme.normal.text1
        )}"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.normal.bg1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.normal.bg0,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "2px 2px",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M0.333313 8.00008C0.333313 7.63189 0.63179 7.33341 0.99998 7.33341H2.04998C2.41817 7.33341 2.71665 7.63189 2.71665 8.00008C2.71665 8.36827 2.41817 8.66675 2.04998 8.66675H0.99998C0.63179 8.66675 0.333313 8.36827 0.333313 8.00008Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M2.57887 12.4785C2.31852 12.7389 2.31852 13.161 2.57887 13.4214C2.83922 13.6817 3.26133 13.6817 3.52168 13.4214L4.26415 12.6789C4.5245 12.4185 4.5245 11.9964 4.26415 11.7361C4.0038 11.4757 3.58169 11.4757 3.32134 11.7361L2.57887 12.4785Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M7.33331 15.0001C7.33331 15.3683 7.63179 15.6667 7.99998 15.6667C8.36817 15.6667 8.66665 15.3683 8.66665 15.0001V13.9501C8.66665 13.5819 8.36817 13.2834 7.99998 13.2834C7.63179 13.2834 7.33331 13.5819 7.33331 13.9501V15.0001Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M11.7359 11.7361C11.9963 11.4757 12.4184 11.4757 12.6787 11.7361L13.4212 12.4785C13.6816 12.7389 13.6816 13.161 13.4212 13.4214C13.1609 13.6817 12.7387 13.6817 12.4784 13.4214L11.7359 12.6789C11.4756 12.4185 11.4756 11.9964 11.7359 11.7361Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M11.7359 3.32132C11.4756 3.58167 11.4756 4.00378 11.7359 4.26413C11.9963 4.52448 12.4184 4.52448 12.6787 4.26413L13.4212 3.52166C13.6816 3.26131 13.6816 2.8392 13.4212 2.57885C13.1609 2.3185 12.7387 2.3185 12.4784 2.57885L11.7359 3.32132Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M7.99998 2.71688C7.63179 2.71688 7.33331 2.4184 7.33331 2.05021V1.00021C7.33331 0.632022 7.63179 0.333545 7.99998 0.333545C8.36817 0.333545 8.66665 0.632022 8.66665 1.00021V2.05021C8.66665 2.4184 8.36817 2.71688 7.99998 2.71688Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M3.52167 2.57885C3.26132 2.3185 2.83921 2.31851 2.57887 2.57886C2.31852 2.83921 2.31852 3.26132 2.57887 3.52166L3.32134 4.26413C3.58169 4.52448 4.0038 4.52448 4.26415 4.26413C4.5245 4.00378 4.5245 3.58167 4.26415 3.32132L3.52167 2.57885Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M7.99998 12.6667C5.42266 12.6667 3.33331 10.5774 3.33331 8.00008C3.33331 5.42276 5.42266 3.33341 7.99998 3.33341C10.5773 3.33341 12.6666 5.42276 12.6666 8.00008C12.6666 10.5774 10.5773 12.6667 7.99998 12.6667Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/><path d="M13.95 7.33341C13.5818 7.33341 13.2833 7.63189 13.2833 8.00008C13.2833 8.36827 13.5818 8.66675 13.95 8.66675H15C15.3682 8.66675 15.6667 8.36827 15.6667 8.00008C15.6667 7.63189 15.3682 7.33341 15 7.33341H13.95Z" fill="${encodeURIComponent(
        theme.normal.text1
      )}"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.normal.bg1,
    borderRadius: 12,
    border: `1px solid ${theme.normal.border}`,
  },
}));

interface NavMenuV2BaseProps {
  onClose: () => void;
}

const NavMenuV2Base: FC<NavMenuV2BaseProps> = ({ ...props }) => {
  const { nowTheme, changeTheme } = useTheme();
  const [showLanModal, setShowLanModal] = useState(false);
  const { chainsData, navItems } = useNEST();
  const location = useLocation();
  const navList = navItems.map((item, index) => {
    const Icon = item.icon;
    return (
      <Stack
        sx={(theme) => {
          return {
            height: "48px",
            "& button": {
              width: "24px",
              height: "24px",
              marginRight: "8px",
              borderRadius: 12,
              background: theme.normal.bg1,
              padding: "6px",
              "& svg": {
                width: 12,
                height: 12,
                display: "block",
                "& path": {
                  fill: theme.normal.text1,
                },
              },
            },
            "& a": {
              width: "100%",
              fontSize: 16,
              fontWeight: 700,
              color: theme.normal.text1,
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
          };
        }}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        key={`nav + ${index}`}
        onClick={() => {}}
        className={`nav${
          location.pathname.indexOf(item.path) === 0 ? "Selected" : ""
        }`}
      >
        <button>
          <Icon />
        </button>
        <Link to={item.path}>{item.l}</Link>
      </Stack>
    );
  });
  const NESTFootStackSmall = styled(NESTFootStack)(({ theme }) => {
    return {
      border: 0,
      height: 32,
    };
  });
  const lanName = useMemo(() => {
    const index = LanData.map((item) => item[1]).indexOf(i18n.locale);
    return index >= 0 ? LanData[index][0] : "";
  }, []);
  return (
    <Stack className="NavMain" justifyContent={"space-between"}>
      <Box>
        <NavMenu>{navList}</NavMenu>
        <NESTLine sx={{ margin: "15px 0" }} />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
        >
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: 16,
              color: theme.normal.text1,
            })}
          >
            <Trans>Dark mode</Trans>
          </Box>
          <MaterialUISwitch
            checked={!nowTheme.isLight}
            onChange={changeTheme}
          />
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
          marginTop={"12px"}
        >
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: 16,
              color: theme.normal.text1,
            })}
          >
            <Trans>Language</Trans>
          </Box>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={"8px"}
            component={"button"}
            onClick={() => setShowLanModal(true)}
          >
            <Box
              component={"p"}
              sx={(theme) => ({
                fontWeight: 400,
                fontSize: 16,
                color: theme.normal.text1,
              })}
            >
              {lanName}
            </Box>
            <NextBox>
              <NEXT />
            </NextBox>
          </Stack>
          <LanguageModal
            open={showLanModal}
            onClose={() => {
              props.onClose();
              setShowLanModal(false);
            }}
          />
        </Stack>
        <NESTLine sx={{ margin: "15px 0" }} />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
          sx={(theme) => ({
            width: "100%",
            fontWeight: 400,
            fontSize: 16,
            color: theme.normal.text1,
            "&:hover": {
              cursor: "pointer",
            },
          })}
          component={"button"}
          onClick={() => {
            window.open(
              "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Mobile"
            );
          }}
        >
          <p>
            <Trans>User Guide</Trans>
          </p>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
          sx={(theme) => ({
            width: "100%",
            marginTop: "12px",
            fontWeight: 400,
            fontSize: 16,
            color: theme.normal.text1,
            "&:hover": {
              cursor: "pointer",
            },
          })}
          component={"button"}
          onClick={() => {
            window.open("https://nestprotocol.org/doc/ennestwhitepaper.pdf");
          }}
        >
          <p>
            <Trans>White Paper</Trans>
          </p>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
          sx={(theme) => ({
            width: "100%",
            marginTop: "12px",
            fontWeight: 400,
            fontSize: 16,
            color: theme.normal.text1,
            "&:hover": {
              cursor: "pointer",
            },
          })}
          component={"button"}
          onClick={() => {
            window.open("https://github.com/NEST-Protocol");
          }}
        >
          <p>
            <Trans>Github</Trans>
          </p>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"40px"}
          sx={(theme) => ({
            width: "100%",
            marginTop: "12px",
            fontWeight: 400,
            fontSize: 16,
            color: theme.normal.text1,
            "&:hover": {
              cursor: "pointer",
            },
          })}
          component={"button"}
          onClick={() => {
            window.open("https://nest-protocol.medium.com");
          }}
        >
          <p>
            <Trans>News</Trans>
          </p>
        </Stack>
        {chainsData.chainId === 97 ? (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"40px"}
            sx={(theme) => ({
              width: "100%",
              marginTop: "12px",
              fontWeight: 400,
              fontSize: 16,
              color: theme.normal.text1,
              "&:hover": {
                cursor: "pointer",
              },
            })}
            component={"button"}
            onClick={() => {
              window.open("https://testnet.bnbchain.org/faucet-smart");
            }}
          >
            <p>
              <Trans>Test BNB</Trans>
            </p>
          </Stack>
        ) : (
          <></>
        )}
      </Box>

      <NESTFootStackSmall
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={"24px"}
        style={{ marginTop: "24px" }}
      >
        {FootAList.slice(0, 3)}
      </NESTFootStackSmall>
    </Stack>
  );
};

export const NavMenuV2: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
      <Menu
        id="nav-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={(theme) => {
          return {
            "& .MuiPaper-root": {
              width: "320px",
              border: `1px solid ${theme.normal.border}`,
              background: theme.normal.bg0,
              paddingX: "40px",
              paddingY: "20px",
              borderRadius: "12px",
              boxShadow: "none",
              "& .MuiMenu-list": {
                padding: 0,
              },
            },
          };
        }}
      >
        <NavMenuV2Base onClose={handleClose} />
      </Menu>
    </>
  );
};

export const NavMenuV3: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Box
        id="nav-button"
        width={22}
        height={22}
        onClick={() => setOpenModal(true)}
      >
        <MobileListButton>
          <MobileListIcon />
        </MobileListButton>
      </Box>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={(theme) => ({
            padding: "32px",
            background: theme.normal.bg0,
            height: "100%",
            "& .NavMain": {
              height: "100%",
            },
          })}
        >
          <Stack height={"100%"}>
            <Stack direction={"row"} justifyContent={"flex-end"}>
              <Box
                component={"button"}
                sx={(theme) => ({
                  "& svg": {
                    width: "24px",
                    height: "24px",
                    display: "block",
                    "& path": {
                      fill: theme.normal.text2,
                    },
                  },
                })}
                onClick={() => setOpenModal(false)}
              >
                <Close />
              </Box>
            </Stack>
            <NavMenuV2Base onClose={() => setOpenModal(false)} />
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default NavMenuV2Base;
