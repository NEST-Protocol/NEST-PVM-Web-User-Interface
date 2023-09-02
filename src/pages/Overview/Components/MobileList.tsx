import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import { Fail, NEXT, Success } from "../../../components/icons";
import Box from "@mui/material/Box";
import { t } from "@lingui/macro";
import { AccountListData } from "../../../hooks/useAccount";
import useNEST from "../../../hooks/useNEST";

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
  const { chainsData } = useNEST();
  const icon = useMemo(() => {
    switch (props.type) {
      case AccountListType.deposit:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 5.5C10.7761 5.5 11 5.72386 11 6V10.5C11 10.7761 10.7761 11 10.5 11H1.5C1.22386 11 1 10.7761 1 10.5V6.00208C1 5.72593 1.22386 5.50208 1.5 5.50208C1.77614 5.50208 2 5.72593 2 6.00208V10H10V6C10 5.72386 10.2239 5.5 10.5 5.5Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.39645 5.39645C3.59171 5.20118 3.90829 5.20118 4.10355 5.39645L6 7.29289L7.89645 5.39645C8.09171 5.20118 8.40829 5.20118 8.60355 5.39645C8.79882 5.59171 8.79882 5.90829 8.60355 6.10355L6.35355 8.35355C6.15829 8.54882 5.84171 8.54882 5.64645 8.35355L3.39645 6.10355C3.20118 5.90829 3.20118 5.59171 3.39645 5.39645Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.99792 1C6.27407 1 6.49792 1.22386 6.49792 1.5V8C6.49792 8.27614 6.27407 8.5 5.99792 8.5C5.72178 8.5 5.49792 8.27614 5.49792 8V1.5C5.49792 1.22386 5.72178 1 5.99792 1Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
          </svg>
        );
      case AccountListType.withdraw:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 5.5C10.7761 5.5 11 5.72386 11 6V10.5C11 10.7761 10.7761 11 10.5 11H1.5C1.22386 11 1 10.7761 1 10.5V6.00208C1 5.72593 1.22386 5.50208 1.5 5.50208C1.77614 5.50208 2 5.72593 2 6.00208V10H10V6C10 5.72386 10.2239 5.5 10.5 5.5Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.39645 4.10355C3.20118 3.90829 3.20118 3.59171 3.39645 3.39645L5.64645 1.14645C5.84171 0.951184 6.15829 0.951184 6.35355 1.14645L8.60355 3.39645C8.79882 3.59171 8.79882 3.90829 8.60355 4.10355C8.40829 4.29882 8.09171 4.29882 7.89645 4.10355L6 2.20711L4.10355 4.10355C3.90829 4.29882 3.59171 4.29882 3.39645 4.10355Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.99792 8.5C5.72178 8.5 5.49792 8.27614 5.49792 8V1.5C5.49792 1.22386 5.72178 1 5.99792 1C6.27407 1 6.49792 1.22386 6.49792 1.5V8C6.49792 8.27614 6.27407 8.5 5.99792 8.5Z"
              fill="#F9F9F9"
              fillOpacity="0.6"
            />
          </svg>
        );
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
    } else if (props.data.status === 0 || props.data.status === 255) {
      return t`Pending`;
    } else if (props.data.status === 1) {
      return t`Success`;
    } else {
      return "";
    }
  }, [props.data.status]);
  const time =
    props.data.status === 0 || props.data.status === 255
      ? new Date((props.data.applyTime ?? 0) * 1000)
      : new Date(props.data.time * 1000);
  const hash = props.data.hash
    ? props.data.hash.hashToChainScan(props.data.chainId)
    : "";
  const showLink = useMemo(() => {
    if (
      props.data.ordertype === "DEPOSIT" ||
      props.data.ordertype === "WITHDRAW"
    ) {
      return true;
    } else {
      return false;
    }
  }, [props.data.ordertype]);
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
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={(theme) => ({
            background: theme.normal.grey_hover,
            borderRadius: "2px",
            width: "16px",
            height: "16px",
            "& svg": {
              width: "12px",
              height: "12px",
              path: {
                fill: theme.normal.text2,
              },
            },
          })}
        >
          {icon}
        </Stack>
        <Stack
          spacing={"10px"}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
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
                color: theme.normal.text0,
              })}
            >
              {props.data.orderTypeString}
            </Box>
          </Stack>

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
                  : props.data.status === 0 || props.data.status === 255
                  ? theme.normal.primary
                  : theme.normal.success;
              const borderColor =
                props.data.status === -1
                  ? theme.normal.danger_light_hover
                  : props.data.status === 0 || props.data.status === 255
                  ? theme.normal.primary_light_hover
                  : theme.normal.success_light_hover;
              return {
                padding: "4px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "700",
                lineHeight: "14px",
                border: `1px solid ${borderColor}`,
                color: color,
              };
            }}
          >
            {state}
          </Box>
          {showLink ? (
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
              onClick={() => {
                if (props.data.hash && chainsData.chainId) {
                  window.open(
                    props.data.hash.hashToChainScan(chainsData.chainId)
                  );
                }
              }}
            >
              <NEXT />
            </Box>
          ) : (
            <Box width={"16px"} height={"16px"}></Box>
          )}
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default MobileList;
