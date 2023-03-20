import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { BigNumber } from "ethers";
import { FC, useMemo, useState } from "react";
import {
  HidePriceTable,
  SelectedTokenDown,
  USDTLogo,
} from "../../components/icons";
import TwoIconWithString from "../../components/IconWithString/TwoIconWithString";
import NESTLine from "../../components/NESTLine";
import SelectListMenu from "../../components/SelectListMemu/SelectListMenu";
import TVChart from "../../components/TVChart/TVChart";
import useWindowWidth, { WidthType } from "../../hooks/useWindowWidth";
import { FuturesPrice, priceToken } from "./Futures";

const PERIOD_TYPE = [
  { label: "30S", value: "K_30S", period: 30 * 1000 },
  { label: "1M", value: "K_1M", period: 60 * 1000 },
  { label: "5M", value: "K_5M", period: 5 * 60 * 1000 },
  { label: "15M", value: "K_15M", period: 15 * 60 * 1000 },
  { label: "1H", value: "K_1H", period: 60 * 60 * 1000 },
  { label: "4H", value: "K_4H", period: 4 * 60 * 60 * 1000 },
  { label: "1D", value: "K_DAY", period: 24 * 60 * 60 * 1000 },
];

interface FuturesPriceTableProps {
  price: FuturesPrice | undefined;
  tokenPair: string;
  changeTokenPair: (value: string) => void;
}

const FuturesPriceTable: FC<FuturesPriceTableProps> = ({ ...props }) => {
  const { width, isBigMobile } = useWindowWidth();
  const [isHide, setIsHide] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [period, setPeriod] = useState("K_1M");
  const height = useMemo(() => {
    switch (width) {
      case WidthType.ssm:
      case WidthType.sm:
        return 168;
      case WidthType.md:
      case WidthType.lg:
        return 278;
      default:
        return 348;
    }
  }, [width]);
  const close = useMemo(() => {
    if (props.price && props.price[props.tokenPair]) {
      return (
        BigNumber.from(props.price[props.tokenPair])
          .div(BigNumber.from(10).pow(16))
          .toNumber() / 100
      );
    }
    return 0;
  }, [props.price, props.tokenPair]);
  const TokenIcon = props.tokenPair.getToken()!.icon;
  const nowPrice = useMemo(() => {
    return props.price
      ? props.price[props.tokenPair].bigNumberToShowString(18, 2) ??
          String().placeHolder
      : String().placeHolder;
  }, [props.price, props.tokenPair]);
  const tokenPairList = useMemo(() => {
    return priceToken
      .map((item) => {
        const token = item.getToken();
        return {
          icon1: token!.icon,
          icon2: USDTLogo,
          title: `${token!.symbol}/USDT`,
        };
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
            <TwoIconWithString
              key={`SelectTokenList + ${index}`}
              icon1={item.icon1}
              icon2={item.icon2}
              title={item.title}
              selected={item.title.split("/")[0] === props.tokenPair}
              onClick={() => {
                props.changeTokenPair(item.title.split("/")[0]);
                handleClose();
              }}
            />
          </Stack>
        );
      });
  }, [props]);
  return (
    <Stack
      width={"100%"}
      sx={(theme) => ({
        border: isBigMobile ? `0px` : `1px solid ${theme.normal.border}`,
        borderBottom: `1px solid ${theme.normal.border}`,
        borderRadius: isBigMobile ? "0px" : "12px",
      })}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={"12px"}
          sx={{
            width: "200px",
            paddingX: "20px",
            paddingY: isBigMobile ? "16px" : "24px",
            "&:hover": { cursor: "pointer" },
          }}
          aria-controls={"SelectTokenPair-menu"}
          aria-haspopup="true"
          aria-expanded={"true"}
          onClick={handleClick}
        >
          <Stack
            direction={"row"}
            sx={{
              "& svg": {
                width: "24px",
                height: "24px",
                display: "block",
                position: "relative",
                zIndex: 5,
              },
              "& svg + svg": { marginLeft: "-8px", zIndex: 4 },
            }}
          >
            <TokenIcon />
            <USDTLogo />
          </Stack>
          <Stack spacing={0}>
            <Box
              component={"p"}
              sx={(theme) => ({
                fontSize: 14,
                fontWeight: 700,
                color: theme.normal.text1,
              })}
            >
              {props.tokenPair}/USDT
            </Box>
            <Box
              component={"p"}
              sx={(theme) => ({
                fontSize: 16,
                fontWeight: 700,
                color: theme.normal.success,
              })}
            >
              {nowPrice}
            </Box>
          </Stack>
          <Box
            sx={(theme) => ({
              "& svg": {
                width: "16px",
                height: "16px",
                display: "block",
                "& path": {
                  fill: theme.normal.text2,
                },
              },
            })}
          >
            <SelectedTokenDown />
          </Box>
        </Stack>
        <Box
          component={"button"}
          onClick={() => setIsHide(!isHide)}
          sx={(theme) => ({
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: `1px solid ${
              isHide ? theme.normal.grey : theme.normal.border
            }`,
            boxSizing: "border-box",
            marginRight: "20px",
            background: isHide ? theme.normal.grey : "transparent",
            "& svg": {
              width: "24px",
              height: "24px",
              display: "block",
              margin: "0 auto",
            },
            "& svg path": {
              fill: theme.normal.text2,
            },
            "&:hover": {
              cursor: "pointer",
              border: 0,
              background: isHide
                ? theme.normal.grey_light_hover
                : theme.normal.grey_hover,
              "& svg path": {
                fill: theme.normal.text0,
              },
            },
            "&:active": {
              border: 0,
              background: isHide
                ? theme.normal.grey_light_active
                : theme.normal.grey_active,
              "& svg path": {
                fill: theme.normal.text0,
              },
            },
            "@media (hover:none)": {
              "&:hover": {
                border: `1px solid ${
                  isHide ? theme.normal.grey : theme.normal.border
                }`,
                background: isHide ? theme.normal.grey : "transparent",
                "& svg path": {
                  fill: theme.normal.text2,
                },
              },
            },
          })}
        >
          <HidePriceTable />
        </Box>
      </Stack>

      <SelectListMenu
        id="SelectTokenPair-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Stack>{tokenPairList}</Stack>
      </SelectListMenu>

      {isHide ? (
        <></>
      ) : (
        <>
          <NESTLine />
          <Stack
            direction={"row"}
            justifyContent={isBigMobile ? "space-around" : "flex-start"}
            alignItems={"center"}
          >
            {PERIOD_TYPE.map((item, index) => {
              return (
                <Box
                  className={period === item.value ? "Selected" : ""}
                  key={`Price + ${index}`}
                  onClick={() => setPeriod(item.value)}
                  component={"p"}
                  sx={(theme) => ({
                    fontWeight: 700,
                    fontSize: 12,
                    color: theme.normal.text2,
                    width: isBigMobile ? "auto" : "65px",
                    textAlign: "center",
                    paddingY: "16px",
                    "&.Selected": {
                      color: theme.normal.text0,
                    },
                    "&:hover": {
                      cursor: "pointer",
                      color: theme.normal.text0,
                    },
                  })}
                >
                  {item.label}
                </Box>
              );
            })}
          </Stack>
          <Box height={height}>
            <TVChart
              tokenPair={props.tokenPair}
              period={period}
              close={close}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default FuturesPriceTable;
