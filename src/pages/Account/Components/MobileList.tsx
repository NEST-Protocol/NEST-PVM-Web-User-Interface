import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import { Deposit, NEXT, Withdraw } from "../../../components/icons";
import Box from "@mui/material/Box";
import { Trans } from "@lingui/macro";

export enum AccountListType {
  deposit,
  withdraw,
  transaction,
}

interface MobileListProps {
  type: AccountListType;
}

const MobileList: FC<MobileListProps> = ({ ...props }) => {
  const icon = useMemo(() => {
    switch (props.type) {
      case AccountListType.deposit:
        return <Deposit />;
      case AccountListType.withdraw:
        return <Withdraw />;
      case AccountListType.transaction:
    }
  }, [props.type]);
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
          sx={{
            width: "16px",
            height: "16px",
            "& svg": {
              width: "16px",
              height: "16px",
            },
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
            100 NEST
          </Box>
          <Box
            sx={(theme) => ({
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "14px",
              color: theme.normal.text2,
            })}
          >
            2023-04-15 10:29:33
          </Box>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        spacing={"12px"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Box
          sx={(theme) => ({
            padding: "4px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "700",
            lineHeight: "14px",
            border: `1px solid ${theme.normal.success}`,
            color: theme.normal.success,
          })}
        >
          <Trans>success</Trans>
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
    </Stack>
  );
};

export default MobileList;
