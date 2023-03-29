import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  HidePriceTable,
  SelectedTokenDown,
  USDTLogo,
} from "../../components/icons";
import TwoIconWithString from "../../components/IconWithString/TwoIconWithString";
import SelectListMenu from "../../components/SelectListMemu/SelectListMenu";
import useWindowWidth, {WidthType} from "../../hooks/useWindowWidth";
import {priceToken} from "./Futures";
import TVChartContainer from "../../components/TVChartContainer/TVChartContainer";
import {TVDataProvider} from "../../domain/tradingview/TVDataProvider";
import {formatAmount, numberWithCommas} from "../../lib/numbers";
import {USD_DECIMALS} from "../../lib/legacy";
import {useChartPrices} from "../../domain/prices";
import {styled} from "@mui/material";

interface ExchangeTVChartProps {
  tokenPair: string;
  changeTokenPair: (value: string) => void;
}

const ChartDataTitle = styled("div")(({theme}) => ({
  fontSize: "12px",
  color: theme.normal.text2,
}));

const ChartDataValue = styled("div")(({theme}) => ({
  fontSize: "16px",
  color: theme.normal.text0,
}));

const ExchangeTVChart: FC<ExchangeTVChartProps> = ({...props}) => {
  const {width, isBigMobile} = useWindowWidth();
  const [isHide, setIsHide] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
  const TokenIcon = props.tokenPair.getToken()!.icon;
  const dataProvider = useRef();

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
            <TwoIconWithString
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

  const [chartTokenPrice, setChartTokenPrice] = useState('-');

  const fetchChartTokenPrice = useCallback(async () => {
    if (dataProvider.current) {
      // @ts-ignore, TODO
      const price = await dataProvider.current?.getCurrentPriceOfToken(42161, props.tokenPair);
      const parsedPrice = formatAmount(price, USD_DECIMALS, 2);
      setChartTokenPrice(parsedPrice);
    }
  }, [props.tokenPair])

  useEffect(() => {
    fetchChartTokenPrice();
    // 每秒更新一次
    const interval = setInterval(() => {
      fetchChartTokenPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchChartTokenPrice])

  useEffect(() => {
    // @ts-ignore
    dataProvider.current = new TVDataProvider();
  }, []);

  let high;
  let low;
  let deltaPrice;
  let delta;
  let deltaPercentage = 0;
  let deltaPercentageStr;
  let closePrice;

  const now = parseInt(String(Date.now() / 1000));
  const timeThreshold = now - 24 * 60 * 60;
  // @ts-ignore
  const currentAveragePrice = chartTokenPrice.maxPrice && chartTokenPrice.minPrice ? chartTokenPrice.maxPrice.add(chartTokenPrice.minPrice).div(2) : null;
  const [priceData, updatePriceData] = useChartPrices(
    // TODO
    42161,
    props.tokenPair,
    false,
    "1h",
    currentAveragePrice
  );

  useEffect(() => {
    const interval = setInterval(() => {
      updatePriceData(undefined, true);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [updatePriceData]);

  if (priceData) {
    for (let i = priceData.length - 1; i > 0; i--) {
      const price = priceData[i];
      if (price.time < timeThreshold) {
        break;
      }
      if (!low) {
        low = price.low;
      }
      if (!high) {
        high = price.high;
      }

      if (price.high > high) {
        high = price.high;
      }
      if (price.low < low) {
        low = price.low;
      }

      deltaPrice = price.open;
      closePrice = price.close;
    }
  }

  if (deltaPrice && currentAveragePrice) {
    const average = parseFloat(formatAmount(currentAveragePrice, USD_DECIMALS, 2));
    delta = average - deltaPrice;
    deltaPercentage = (delta * 100) / average;
    if (deltaPercentage > 0) {
      deltaPercentageStr = `+${deltaPercentage.toFixed(2)}%`;
    } else {
      deltaPercentageStr = `${deltaPercentage.toFixed(2)}%`;
    }
    if (deltaPercentage === 0) {
      deltaPercentageStr = "0.00";
    }
  }

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
        <Stack direction={'row'} alignItems={"center"} spacing={'40px'}>
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={"12px"}
            sx={{
              width: "200px",
              paddingX: "20px",
              paddingY: isBigMobile ? "16px" : "24px",
              "&:hover": {cursor: "pointer"},
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
                "& svg + svg": {marginLeft: "-8px", zIndex: 4},
              }}
            >
              <TokenIcon/>
              <USDTLogo/>
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
                 {/*@ts-ignore*/}
                {chartTokenPrice ? chartTokenPrice : "-" }
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
              <SelectedTokenDown/>
            </Box>
          </Stack>
          <Box>
            <ChartDataTitle>24h Change</ChartDataTitle>
            <ChartDataValue sx={(theme) => ({
              color: deltaPercentage >= 0 ? theme.normal.success : theme.normal.danger,
            })}>
              {!deltaPercentageStr && "-"}
              {deltaPercentageStr && deltaPercentageStr}
            </ChartDataValue>
          </Box>
          <Box>
            <ChartDataTitle>24h High</ChartDataTitle>
            <ChartDataValue>
              {!high && "-"}
              {high && numberWithCommas(high.toFixed(2))}
            </ChartDataValue>
          </Box>
          <Box>
            <ChartDataTitle>24h Low</ChartDataTitle>
            <ChartDataValue>
              {!low && "-"}
              {low && numberWithCommas(low.toFixed(2))}
            </ChartDataValue>
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
          <HidePriceTable/>
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
        <Box height={height}>
          <TVChartContainer
            symbol={props.tokenPair}
            chainId={42161}
            dataProvider={dataProvider.current!}
          />
        </Box>
      )}
    </Stack>
  );
};

export default ExchangeTVChart;
