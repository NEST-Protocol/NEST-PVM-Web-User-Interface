import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo, useState } from "react";
import { SelectedTokenDown } from "../../../components/icons";
import OneIconWithString from "../../../components/IconWithString/OneIconWithString";
import LinkButton from "../../../components/MainButton/LinkButton";
import NESTLine from "../../../components/NESTLine";
import SelectListMenu from "../../../components/SelectListMemu/SelectListMenu";
import OneTokenIN from "../../../components/TokenIconAndName/OneTokenI&N";
import { Trans, t } from "@lingui/macro";

const SwapInputStack = styled(Stack)(({ theme }) => {
  return {
    background: theme.normal.bg1,
    borderRadius: 8,
    border: `1px solid ${theme.normal.border}`,
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  };
});
const ShowInputStack = styled(Stack)(({ theme }) => {
  return {
    marginBottom: 12,
    "& input": {
      fontSize: 16,
      fontWeight: 700,
      color: theme.normal.text0,
      width: "100%",
      "&::placeHolder": {
        color: theme.normal.text3,
      },
    },
  };
});
const ShowInfoStack = styled(Stack)(({ theme }) => {
  return {
    height: 16,
    width: "100%",
    marginTop: 12,
    "& p": {
      fontSize: 12,
    },
    "& .SwapInfoTitle": {
      color: theme.normal.text2,
    },
    "& .SwapInfoBalance": {
      color: theme.normal.text2,
      "& span": {
        fontSize: 12,
        color: theme.normal.text0,
        marginLeft: 4,
      },
    },
  };
});
const Max = styled(LinkButton)(({ theme }) => {
  return {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "16px",
    marginLeft: 4,
  };
});
export const SelectToken = styled(Stack)(({ theme }) => {
  return {
    height: 40,
    borderRadius: 8,
    border: `1px solid ${theme.normal.border}`,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    "&:hover": {
      cursor: "pointer",
      border: `1px solid ${theme.normal.grey_hover}`,
      background: theme.normal.grey_hover,
      "& svg.SwapInputDown": {
        "& path": {
          fill: theme.normal.text0,
        },
      },
    },
    "&:active": {
      border: `1px solid ${theme.normal.grey_active}`,
      background: theme.normal.grey_active,
      "& svg.SwapInputDown": {
        "& path": {
          fill: theme.normal.text0,
        },
      },
    },
    "& svg.SwapInputDown": {
      width: 12,
      height: 12,
      display: "block",
      margin: "auto 0",
      marginLeft: 8,
      "& path": {
        fill: theme.normal.text2,
      },
    },
    "& p": {
      fontWeight: 400,
      fontSize: 16,
      color: theme.normal.text0,
      marginLeft: 8,
      marginRight: 8,
    },
  };
});

type SwapInputItemProps = {
  tokenName: string;
  balance: string;
  maxCallBack: () => void;
  children: React.ReactNode;
  tokenArray: string[] | undefined;
  selectToken: (tokenName: string) => void;
};

const SwapInputItem: FC<SwapInputItemProps> = ({ children, ...props }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    if (!props.tokenArray) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const tokenPairList = useMemo(() => {
    if (props.tokenArray) {
      return props.tokenArray
        .map((item) => {
          const token = item.getToken();
          return { icon: token!.icon, title: token!.symbol };
        })
        .map((item, index) => {
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
                key={`SelectTokenList + ${index}`}
                icon={item.icon}
                title={item.title}
                selected={props.tokenName === item.title}
                onClick={() => {
                  props.selectToken(item.title);
                  handleClose();
                }}
              />
            </Stack>
          );
        });
    } else {
      return <></>;
    }
  }, [props]);
  return (
    <SwapInputStack>
      <ShowInputStack direction={"row"} justifyContent={"space-between"}>
        {children}
        <SelectToken
          direction={"row"}
          justifyContent={"flex-end"}
          aria-controls={"selectToken-menu"}
          aria-haspopup="true"
          aria-expanded={"true"}
          onClick={handleClick}
        >
          <OneTokenIN tokenName={props.tokenName} height={24} />
          <SelectedTokenDown className="SwapInputDown" />
        </SelectToken>
        <SelectListMenu
          id="selectToken-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Stack>{tokenPairList}</Stack>
        </SelectListMenu>
      </ShowInputStack>
      <NESTLine />
      <ShowInfoStack direction={"row"} justifyContent={"space-between"}>
        <p className="SwapInfoTitle">
          <Trans>From</Trans>
        </p>
        <Stack
          className="SwapInfo"
          direction={"row"}
          justifyContent={"flex-end"}
        >
          <p className="SwapInfoBalance">
            {t`Wallet` + ":"}{" "}
            <span>{`${props.balance} ${props.tokenName}`}</span>
          </p>
          <Max onClick={props.maxCallBack}>
            <Trans>MAX</Trans>
          </Max>
        </Stack>
      </ShowInfoStack>
    </SwapInputStack>
  );
};

interface SwapShowItemProps {
  tokenName: string;
  balance: string;
  value: string;
}

export const SwapShowItem: FC<SwapShowItemProps> = ({ ...props }) => {
  return (
    <SwapInputStack>
      <ShowInputStack direction={"row"} justifyContent={"space-between"}>
        <input readOnly value={props.value} />
        <OneTokenIN tokenName={props.tokenName} height={24} />
      </ShowInputStack>
      <NESTLine />
      <ShowInfoStack direction={"row"} justifyContent={"space-between"}>
        <p className="SwapInfoTitle">
          <Trans>To(Estimated)</Trans>
        </p>
        <Stack
          className="SwapInfo"
          direction={"row"}
          justifyContent={"flex-end"}
        >
          <p className="SwapInfoBalance">
            {t`Wallet` + ":"}{" "}
            <span>{`${props.balance} ${props.tokenName}`}</span>
          </p>
        </Stack>
      </ShowInfoStack>
    </SwapInputStack>
  );
};

export default SwapInputItem;
