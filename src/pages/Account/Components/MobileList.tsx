import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import {
  Deposit,
  Fail,
  NEXT,
  Success,
  Withdraw,
} from "../../../components/icons";
import Box from "@mui/material/Box";
import { t } from "@lingui/macro";
import { AccountListData } from "../../../hooks/useAccount";

export enum AccountListType {
  deposit,
  withdraw,
  transaction,
}

interface MobileListProps {
  type: AccountListType;
  data: AccountListData;
}

const MobileList: FC<MobileListProps> = ({ ...props }) => {
  const icon = useMemo(() => {
    switch (props.type) {
      case AccountListType.deposit:
        return <Deposit />;
      case AccountListType.withdraw:
        return <Withdraw />;
      case AccountListType.transaction:
        const resultIcon = props.data.status === 1 ? <Success /> : <Fail />;
        return resultIcon;
    }
  }, [props.data.status, props.type]);
  const text = useMemo(() => {
    return props.data.text;
  }, [props.data.text]);
  const state = useMemo(() => {
    if (props.data.status === -1) {
      return t`Fail`;
    } else if (props.data.status === 0) {
      return t`Pending`;
    } else if (props.data.status === 1) {
      return t`Success`;
    } else {
      return "";
    }
  }, [props.data.status]);
  const time = new Date(props.data.time * 1000);
  const hash = props.data.hash
    ? props.data.hash.hashToChainScan(props.data.chainId)
    : "";
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={(theme) => ({
        height: "68px",
        padding: "12px",
        borderRadius: "8px",
        border: `1px solid ${theme.normal.border}`,
      })}
    >
      <Stack
        spacing={"8px"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box
          sx={(theme) => {
            const fill =
              props.type === AccountListType.transaction
                ? props.data.status === 1
                  ? theme.normal.success
                  : theme.normal.danger
                : "normal";
            return {
              width: "16px",
              height: "16px",
              "& svg": {
                width: "16px",
                height: "16px",
                "& path": {
                  fill: fill,
                },
              },
            };
          }}
        >
          {icon}
        </Box>
        <Stack
          spacing={"10px"}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Box
            sx={(theme) => ({
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
              color: theme.normal.text0,
            })}
          >
            {text}
          </Box>
          <Box
            sx={(theme) => ({
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "14px",
              color: theme.normal.text2,
            })}
          >
            {`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}
          </Box>
        </Stack>
      </Stack>

      {props.type !== AccountListType.transaction ? (
        <Stack
          direction={"row"}
          spacing={"12px"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          component={"button"}
          onClick={() => {
            if (hash !== "") {
              window.open(hash);
            }
          }}
        >
          <Box
            sx={(theme) => {
              const color =
                props.data.status === -1
                  ? theme.normal.danger
                  : props.data.status === 0
                  ? theme.normal.primary
                  : theme.normal.success;
              return {
                padding: "4px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "700",
                lineHeight: "14px",
                border: `1px solid ${color}`,
                color: color,
              };
            }}
          >
            {state}
          </Box>
          <Box
            sx={(theme) => ({
              width: "16px",
              height: "16px",
              "& svg": {
                width: "16px",
                height: "16px",
                "& path": {
                  fill: theme.normal.text2,
                },
              },
            })}
          >
            <NEXT />
          </Box>
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default MobileList;
