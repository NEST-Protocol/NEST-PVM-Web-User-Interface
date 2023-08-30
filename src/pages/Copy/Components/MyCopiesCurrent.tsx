import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import FuturesTableTitle from "../../Futures/Components/TableTitle";
import { Trans, t } from "@lingui/macro";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CopyTablePosition from "./CopyTablePosition";
import CopyListPosition from "./CopyListPosition";
import NESTLine from "../../../components/NESTLine";
import { MyCopiesList } from "../Hooks/useMyCopies";
import useMyCopiesCurrent from "../Hooks/useMyCopiesCurrent";
import { DefaultKolIcon } from "../../../components/icons";
import CircularProgress from "@mui/material/CircularProgress";

interface MyCopiesCurrentProps {
  list: MyCopiesList[];
  updateList: () => void;
}

const MyCopiesCurrent: FC<MyCopiesCurrentProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();
  const { action, isLoading } = useMyCopiesCurrent(props.updateList);
  const rows = props.list.map((item, index) => {
    return (
      <Row
        key={`MyCopiesCurrent + ${index}`}
        data={item}
        action={action}
        isLoading={isLoading}
      />
    );
  });

  const noOrder = useMemo(() => {
    return false;
  }, []);

  const mobile = useMemo(() => {
    const items = props.list.map((item, index) => {
      const tokenName = item.product.split("/")[0];
      const isLong = item.direction;
      const lever = item.leverage;
      const nickName = item.nickName;
      const kolAddress = item.kolAddress.showAddress();
      const balance = item.balance.floor(2);
      const profitLossRate = item.profitLossRate.floor(2) + "%";
      const orderPrice = item.orderPrice.floor(
        tokenName.getTokenPriceDecimals()
      );
      const marketPrice = item.marketPrice.floor(
        tokenName.getTokenPriceDecimals()
      );
      const lipPrice = item.lipPrice.floor(tokenName.getTokenPriceDecimals());

      const openTime = new Date(item.timestamp * 1000);
      const openTimeString = `${openTime.toLocaleDateString()} ${openTime.toLocaleTimeString()}`;
      const kolIcon = () => {
        if (item.avatar !== "-" && item.avatar !== "") {
          return (
            <Box
              sx={(theme) => ({
                width: "24px",
                height: "24px",
                borderRadius: "12px",
                background: theme.normal.primary,
                overflow: "hidden",
                "& img": {
                  width: "24px",
                  height: "24px",
                },
              })}
            >
              <img src={item.avatar} alt="kolIcon" />
            </Box>
          );
        } else {
          return (
            <Box
              sx={(theme) => ({
                width: "24px",
                height: "24px",
                borderRadius: "12px",
                background: theme.normal.primary,
                "& svg": {
                  width: "24px",
                  height: "24px",
                  display: "block",
                },
              })}
            >
              <DefaultKolIcon />
            </Box>
          );
        }
      };
      return (
        <Stack
          key={`MyCopiesCurrentMobile + ${index}`}
          spacing={"20px"}
          sx={(theme) => ({
            borderRadius: "12px",
            background: theme.normal.bg1,
            padding: "20px 12px",
          })}
        >
          <CopyListPosition
            tokenName={tokenName}
            lever={lever}
            isLong={isLong}
          />
          <Stack spacing={"8px"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack spacing={"4px"} width={"100%"}>
                <Box
                  sx={(theme) => ({
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    color: theme.normal.text2,
                  })}
                >
                  <Trans>Open Price</Trans>
                </Box>
                <Box
                  sx={(theme) => ({
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "20px",
                    color: theme.normal.text0,
                  })}
                >
                  {orderPrice}USDT
                </Box>
              </Stack>

              <Stack spacing={"4px"} width={"100%"}>
                <Box
                  sx={(theme) => ({
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    color: theme.normal.text2,
                  })}
                >
                  <Trans>Actual Margin</Trans>
                </Box>
                <Stack
                  direction={"row"}
                  spacing={"4px"}
                  alignItems={"flex-end"}
                >
                  <Box
                    sx={(theme) => ({
                      fontSize: "14px",
                      fontWeight: "700",
                      lineHeight: "20px",
                      color: theme.normal.text0,
                    })}
                  >
                    {balance}NEST
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontSize: "10px",
                      fontWeight: "400",
                      lineHeight: "14px",
                      color:
                        item.profitLossRate >= 0
                          ? theme.normal.success
                          : theme.normal.danger,
                    })}
                  >
                    {profitLossRate}
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <NESTLine />
            <Stack spacing={"8px"}>
              <Stack direction={"row"}>
                <Stack direction={"row"} spacing={"4px"} width={"100%"}>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text2,
                    })}
                  >
                    <Trans>Market Price</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text0,
                    })}
                  >
                    {marketPrice}USDT
                  </Box>
                </Stack>
                <Stack direction={"row"} spacing={"4px"} width={"100%"}>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text2,
                    })}
                  >
                    <Trans>Liq Price</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text0,
                    })}
                  >
                    {lipPrice}USDT
                  </Box>
                </Stack>
              </Stack>

              <Stack direction={"row"}>
                <Stack direction={"row"} spacing={"4px"} width={"100%"}>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text2,
                    })}
                  >
                    <Trans>Open Time</Trans>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: theme.normal.text0,
                    })}
                  >
                    {openTimeString}
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
              {kolIcon()}
              <Stack spacing={"4px"}>
                <Box
                  sx={(theme) => ({
                    fontWeight: "700",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: theme.normal.text0,
                  })}
                >
                  {nickName}
                </Box>
                <Box
                  sx={(theme) => ({
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: theme.normal.text2,
                  })}
                >
                  {kolAddress}
                </Box>
              </Stack>
            </Stack>
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "20px",
                color: theme.normal.text0,
                padding: "10px 16px",
                borderRadius: "8px",
                background: theme.normal.grey_hover,
                width: "fit-content",
                "& .MuiCircularProgress-root": {
                  color: theme.normal.text0,
                },
              })}
              onClick={() => {
                action(item.id);
              }}
            >
              {isLoading === item.id ? (
                <CircularProgress size={"12px"} />
              ) : (
                <Trans>Close</Trans>
              )}
            </Box>
          </Stack>
        </Stack>
      );
    });
    return (
      <Stack paddingX={"12px"} spacing={"16px"} paddingBottom={"20px"}>
        {items}
      </Stack>
    );
  }, [action, isLoading, props.list]);

  const pc = useMemo(() => {
    return (
      <FuturesTableTitle
        dataArray={[
          t`Symbol`,
          t`Trader`,
          t`Actual Margin`,
          t`Open Price`,
          t`Market Price`,
          t`Liq Price`,
          t`Operate`,
        ]}
        noOrder={noOrder}
        helps={[]}
        noNeedPadding
      >
        {rows}
      </FuturesTableTitle>
    );
  }, [noOrder, rows]);
  return <>{isBigMobile ? mobile : pc}</>;
};

const tdNoPadding = {
  padding: "0px !important",
};

interface RowProps {
  data: MyCopiesList;
  action: (id: number) => void;
  isLoading: number;
}

const Row: FC<RowProps> = ({ ...props }) => {
  const tokenName = props.data.product.split("/")[0];
  const isLong = props.data.direction;
  const lever = props.data.leverage;
  const nickName = props.data.nickName;
  const kolAddress = props.data.kolAddress.showAddress();
  const balance = props.data.balance.floor(2);
  const profitLossRate = props.data.profitLossRate.floor(2) + "%";
  const orderPrice = props.data.orderPrice.floor(
    tokenName.getTokenPriceDecimals()
  );
  const marketPrice = props.data.marketPrice.floor(
    tokenName.getTokenPriceDecimals()
  );
  const lipPrice = props.data.lipPrice.floor(tokenName.getTokenPriceDecimals());

  const openTime = new Date(props.data.timestamp * 1000);
  const openTimeString = `${openTime.toLocaleDateString()} ${openTime.toLocaleTimeString()}`;
  const kolIcon = () => {
    if (props.data.avatar !== "-" && props.data.avatar !== "") {
      return (
        <Box
          sx={(theme) => ({
            width: "24px",
            height: "24px",
            borderRadius: "12px",
            background: theme.normal.primary,
            overflow: "hidden",
            "& img": {
              width: "24px",
              height: "24px",
            },
          })}
        >
          <img src={props.data.avatar} alt="kolIcon" />
        </Box>
      );
    } else {
      return (
        <Box
          sx={(theme) => ({
            width: "24px",
            height: "24px",
            borderRadius: "12px",
            background: theme.normal.primary,
            "& svg": {
              width: "24px",
              height: "24px",
              display: "block",
            },
          })}
        >
          <DefaultKolIcon />
        </Box>
      );
    }
  };
  return (
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <TableCell>
        <CopyTablePosition
          tokenName={tokenName}
          isLong={isLong}
          lever={lever}
        />
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
          {kolIcon()}
          <Stack spacing={"4px"}>
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "20px",
                color: theme.normal.text0,
              })}
            >
              {nickName}
            </Box>
            <Box
              sx={(theme) => ({
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "16px",
                color: theme.normal.text2,
              })}
            >
              {kolAddress}
            </Box>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack spacing={"4px"}>
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "12px",
              lineHeight: "16px",
              color:
                props.data.profitLossRate >= 0
                  ? theme.normal.success
                  : theme.normal.danger,
            })}
          >
            {balance}NEST
          </Box>
          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "16px",
              color:
                props.data.profitLossRate >= 0
                  ? theme.normal.success
                  : theme.normal.danger,
            })}
          >
            {profitLossRate}
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack spacing={"4px"}>
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "12px",
              lineHeight: "16px",
              color: theme.normal.text0,
            })}
          >
            {orderPrice}USDT
          </Box>
          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "16px",
              color: theme.normal.text2,
            })}
          >
            {openTimeString}
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack spacing={"4px"}>
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "12px",
              lineHeight: "16px",
              color: theme.normal.text0,
            })}
          >
            {marketPrice}USDT
          </Box>
          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "16px",
              color: theme.normal.text2,
            })}
          >
            {String().placeHolder}
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "12px",
            lineHeight: "16px",
            color: theme.normal.text0,
            paddingRight: "20px",
          })}
        >
          {lipPrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          paddingRight={"20px"}
        >
          <Box
            sx={(theme) => ({
              fontWeight: "700",
              fontSize: "10px",
              lineHeight: "14px",
              color: theme.normal.text0,
              padding: "5px 12px",
              borderRadius: "4px",
              background: theme.normal.grey,
              width: "fit-content",
              "&:hover": {
                cursor: "pointer",
              },
              "& .MuiCircularProgress-root": {
                color: theme.normal.text0,
              },
            })}
            component={"button"}
            onClick={() => {
              props.action(props.data.id);
            }}
          >
            {props.isLoading === props.data.id ? (
              <CircularProgress size={"12px"} />
            ) : (
              <Trans>Close</Trans>
            )}
          </Box>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default MyCopiesCurrent;
