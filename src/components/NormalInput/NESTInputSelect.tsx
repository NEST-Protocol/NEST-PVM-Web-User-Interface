import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useNEST from "../../hooks/useNEST";
import { SelectToken } from "../../pages/Swap/Components/SwapInputItem";
import { NEXT, SelectedTokenDown, SwapExchangeSmall } from "../icons";
import OneIconWithString from "../IconWithString/OneIconWithString";
import LinkButton from "../MainButton/LinkButton";
import NESTLine from "../NESTLine";
import SelectListMenu from "../SelectListMemu/SelectListMenu";
import OneTokenIN from "../TokenIconAndName/OneTokenI&N";
import { Trans, t } from "@lingui/macro";

interface NESTInputSelectProps {
  tokenName: string;
  tokenArray: string[];
  selectToken: (tokenName: string) => void;
  error: boolean;
  showToSwap: boolean;
  showBalance: string;
  maxCallBack: () => void;
  nestAmount: string;
  changeNestAmount: (value: string) => void;
  style?: React.CSSProperties;
  price?: string;
}

const NESTInputSelect: FC<NESTInputSelectProps> = ({ ...props }) => {
  const { account, chainsData } = useNEST();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const tokenPairList = useMemo(() => {
    return props.tokenArray
      .map((item) => {
        const token = item.getToken();
        return { icon: token!.icon, title: token!.symbol };
      })
      .map((item, index) => {
        return (
          <Stack
            key={`SelectTokenList + ${index}`}
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
  }, [props]);
  const noNESTText = useMemo(() => {
    if (chainsData.chainId === 534353) {
      return t`The balance is 0. You can go to "Faucet" to get test token before trading.`;
    } else {
      return t`0 balance. Before trading, you can switch to "Swap" to exchange
      between USDT and NEST token.`;
    }
  }, [chainsData.chainId]);
  const swapLink = useMemo(() => {
    if (chainsData.chainId === 534353) {
      return "/faucet";
    } else {
      return "/swap";
    }
  }, [chainsData.chainId]);
  const swapTitle = useMemo(() => {
    return chainsData.chainId === 534353 ? t`Faucet` : t`Swap`;
  }, [chainsData.chainId]);
  const showBottom = useMemo(() => {
    if (props.tokenName === "USDT") {
      return (
        <Stack
          spacing={"4px"}
          justifyContent={"space-between"}
          sx={(theme) => ({
            width: "100%",
            paddingY: "12px",
            paddingX: "8px",
            borderRadius: "4px",
            background: theme.normal.bg4,
            marginBottom: "12px",
          })}
          alignItems={"center"}
        >
          <Box
            component={"p"}
            sx={(theme) => ({
              fontSize: 14,
              color: theme.normal.text0,
              fontWeight: 700,
              textAlign: "center",
            })}
          >
            {props.price}
          </Box>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontSize: 12,
              color: theme.normal.text2,
              fontWeight: 400,
              textAlign: "center",
            })}
          >
            <Trans>
              The system will automatically convert USDT to NEST at market price
              for you to open your position, and you will also receive NEST at
              settlement.
            </Trans>
          </Box>
        </Stack>
      );
    } else {
      if (props.showToSwap) {
        return (
          <Stack
            direction={"row"}
            spacing={"4px"}
            justifyContent={"space-between"}
            sx={(theme) => ({
              width: "100%",
              paddingY: "4px",
              paddingX: "8px",
              borderRadius: "4px",
              background: theme.normal.danger_light_hover,
              "& a": {
                color: theme.normal.danger,
                fontSize: 12,
                fontWeight: 400,
              },

              marginBottom: "12px",
              "& svg": {
                width: "24px",
                height: "12px",
                display: "block",
                "& path": {
                  fill: theme.normal.danger,
                },
              },
            })}
            alignItems={"center"}
          >
            <Link to={swapLink}>{noNESTText}</Link>
            <Link to={swapLink}>
              <NEXT />
            </Link>
          </Stack>
        );
      }
    }
    return <></>;
  }, [noNESTText, props.price, props.showToSwap, props.tokenName, swapLink]);
  return (
    <Stack
      justifyContent={"flex-start"}
      sx={(theme) => ({
        border: `1px solid ${
          account.address && props.error
            ? theme.normal.danger
            : theme.normal.border
        }`,
        borderRadius: "8px",
        background: theme.normal.bg1,
        width: "100%",
        paddingTop: "12px",
        paddingX: "12px",
        "&:hover": {
          border: `1px solid ${
            account.address && props.error
              ? theme.normal.danger
              : theme.normal.primary
          }`,
        },
      })}
      style={props.style}
    >
      <Stack direction={"row"} justifyContent={"space-between"} height={"40px"}>
        <Box
          sx={(theme) => ({
            fontSize: 16,
            fontWeight: 700,
            color: theme.normal.text0,
            width: "100%",
            height: "40px",
            "&::placeHolder": {
              color: theme.normal.text3,
            },
          })}
          component={"input"}
          placeholder={t`Amount`}
          value={props.nestAmount}
          maxLength={32}
          onChange={(e) =>
            props.changeNestAmount(e.target.value.formatInputNum())
          }
        />
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
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Stack>{tokenPairList}</Stack>
        </SelectListMenu>
      </Stack>
      <NESTLine style={{ marginTop: "12px", marginBottom: "12px" }} />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        marginBottom={props.showToSwap ? "12px" : "20px"}
      >
        <Stack direction={"row"} spacing={"4px"} justifyContent={"flex-start"}>
          <Box
            component={"p"}
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: 12,
              color: theme.normal.text2,
              lineHeight: "18px",
              "& span": {
                color: theme.normal.text0,
              },
            })}
          >
            {t`Balance:`}{" "}
            <span>{`${props.showBalance} ${props.tokenName}`}</span>
          </Box>
          <LinkButton
            onClick={props.maxCallBack}
            sx={{ fontSize: "12px", lineHeight: "18px" }}
          >
            <Trans>MAX</Trans>
          </LinkButton>
        </Stack>
        {props.tokenName === "USDT" ? (
          <></>
        ) : (
          <LinkButton>
            <Link to={swapLink}>
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                spacing={"4px"}
                sx={{
                  "& svg": {
                    width: 12,
                    height: 12,
                    display: "block",
                  },
                }}
              >
                <p>{swapTitle}</p>
                <SwapExchangeSmall />
              </Stack>
            </Link>
          </LinkButton>
        )}
      </Stack>
      {showBottom}
    </Stack>
  );
};

export default NESTInputSelect;
