import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { FC, useMemo, useState } from "react";
import { Language, SelectedYes } from "../../../components/icons";
import Stack from "@mui/material/Stack";
import { t } from "@lingui/macro";
import SelectListMenu from "../../../components/SelectListMemu/SelectListMenu";
import { i18n } from "@lingui/core";
import { dynamicActivate } from "../../../locales/i18n";

const LanguageButton = styled(Box)(({ theme }) => ({
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

interface LanguageListProps {
  spacing: number;
  paddingX: number;
  selectCallBack?: () => void;
}

export const LanData = [
    [t`English`, "en"],
    [t`Portuguese`, "pt"],
    [t`Japanese`, "ja"],
    [t`Korean`, "ko"],
    [t`Russian`, "ru"],
  ];

export const LanguageList: FC<LanguageListProps> = ({ ...props }) => {
  const nowValue = useMemo(() => {
    const index = LanData.map((item) => item[1]).indexOf(i18n.locale);
    return index >= 0 ? index : 0;
  }, []);
  const selectAction = (index: number) => {
    dynamicActivate(LanData[index][1]);
  };
  const liArray = () => {
    return LanData.map((item, index) => {
      return (
        <Stack
          key={`LanguageList+${index}`}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          component={"button"}
          onClick={() => {
            selectAction(index);
            if (props.selectCallBack) {
              props.selectCallBack();
            }
          }}
          sx={(theme) => ({
            width: "100%",
            paddingX: `${props.paddingX}px`,
            height: `44px`,
            color: theme.normal.text0,
            fontSize: `14px`,
            fontWeight: 400,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: theme.normal.bg1,
            },
          })}
        >
          <Box>{item[0]}</Box>
          {nowValue === index ? (
            <Box
              sx={(theme) => ({
                width: 16,
                height: 16,
                "& svg": {
                  width: 16,
                  height: 16,
                  display: "block",
                  "& path": {
                    fill: theme.normal.primary,
                  },
                },
              })}
            >
              <SelectedYes />
            </Box>
          ) : (
            <></>
          )}
        </Stack>
      );
    });
  };
  return <Stack spacing={`${props.spacing}px`} width={"100%"}>{liArray()}</Stack>;
};

const LanguageMenu: FC = () => {
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
      <LanguageButton
        component={"button"}
        aria-controls={"net-menu"}
        aria-haspopup="true"
        aria-expanded={"true"}
        onClick={handleClick}
      >
        <Language />
      </LanguageButton>
      <SelectListMenu
        id="net-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <LanguageList spacing={0} paddingX={16} selectCallBack={handleClose}/>
      </SelectListMenu>
    </>
  );
};

export default LanguageMenu;
