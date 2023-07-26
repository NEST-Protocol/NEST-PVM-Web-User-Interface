import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import useNEST from "../../hooks/useNEST";
import { NEXT, SwapExchangeSmall } from "../icons";
import LinkButton from "../MainButton/LinkButton";
import NESTLine from "../NESTLine";
import OneTokenIN from "../TokenIconAndName/OneTokenI&N";
import { Trans, t } from "@lingui/macro";

interface NESTInputProps {
  checkBalance: boolean;
  showToSwap: boolean;
  showBalance: string;
  maxCallBack: () => void;
  nestAmount: string;
  changeNestAmount: (value: string) => void;
  otherCallBack: () => void;
  hideSwapTitle?: boolean;
  style?: React.CSSProperties;
}

const NESTInput: FC<NESTInputProps> = ({ ...props }) => {
  const { account, chainsData, checkSigned } = useNEST();
  const noNESTText = useMemo(() => {
    if (chainsData.chainId === 534353) {
      return t`The balance is 0. You can go to "Faucet" to get test token before trading.`;
    } else {
      if (checkSigned) {
        return t`Your balance is 0. Before making any transactions, please click on "Deposit" to complete a quick deposit.`;
      } else {
        return t`Please complete your sign`;
      }
    }
  }, [chainsData.chainId, checkSigned]);
  const swapTitle = useMemo(() => {
    return chainsData.chainId === 534353 ? t`Faucet` : t`Deposit`;
  }, [chainsData.chainId]);
  return (
    <Stack
      justifyContent={"flex-start"}
      sx={(theme) => ({
        border: `1px solid ${
          account.address && !props.checkBalance
            ? theme.normal.danger
            : theme.normal.border
        }`,
        borderRadius: "8px",
        background: theme.normal.bg1,
        width: "100%",
        paddingTop: "20px",
        paddingX: "12px",
        "&:hover": {
          border: `1px solid ${
            account.address && !props.checkBalance
              ? theme.normal.danger
              : theme.normal.primary
          }`,
        },
      })}
      style={props.style}
    >
      <Stack direction={"row"} justifyContent={"space-between"} height={"24px"}>
        <Box
          sx={(theme) => ({
            fontSize: 16,
            fontWeight: 700,
            color: theme.normal.text0,
            width: "100%",
            height: "24px",
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
        <OneTokenIN tokenName={"NEST"} height={24} />
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
              "& span": {
                color: theme.normal.text0,
              },
            })}
          >
            {t`Balance:`} <span>{props.showBalance} NEST</span>
          </Box>
          <LinkButton onClick={props.maxCallBack}>
            <Trans>MAX</Trans>
          </LinkButton>
        </Stack>

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
          component={"button"}
          onClick={props.otherCallBack}
        >
          <LinkButton>
            <p>{props.hideSwapTitle || !checkSigned ? <></> : swapTitle}</p>
          </LinkButton>
          <LinkButton>
            {props.hideSwapTitle || !checkSigned ? (
              <></>
            ) : (
              <SwapExchangeSmall />
            )}
          </LinkButton>
        </Stack>
      </Stack>
      {props.showToSwap && account.address ? (
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
            color: theme.normal.danger,
            fontSize: 12,
            fontWeight: 400,

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
          component={"button"}
          onClick={props.otherCallBack}
        >
          <Box textAlign={"left"}>{noNESTText}</Box>
          <NEXT />
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default NESTInput;
