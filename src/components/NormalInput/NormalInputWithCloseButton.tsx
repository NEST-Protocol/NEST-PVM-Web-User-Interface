import { NormalInputBaseStack } from "./NormalInput";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import { BigNumber } from "ethers";
import { Trans } from "@lingui/macro";

interface NormalInputWithCloseButtonProps {
  placeHolder: string;
  rightTitle: string;
  value: string;
  changeValue: (value: string) => void;
  onClose: () => void;
  error?: boolean;
  style?: React.CSSProperties;
}

const NormalInputWithCloseButton: FC<NormalInputWithCloseButtonProps> = ({
  ...props
}) => {
  const inputValue = useMemo(() => {
    return props.value.stringToBigNumber(18) ?? BigNumber.from("0");
  }, [props.value]);
  return (
    <NormalInputBaseStack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      style={props.style}
      className={props.error ? "error" : ""}
    >
      <input
        placeholder={props.placeHolder}
        value={props.value}
        maxLength={32}
        onChange={(e) => props.changeValue(e.target.value)}
      />
      <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
        {BigNumber.from("0").eq(inputValue) ? (
          <></>
        ) : (
          <Box
            component={"button"}
            onClick={props.onClose}
            sx={(theme) => ({
              height: "36px",
              paddingX: "12px",
              color: theme.normal.danger,
              fontWeight: 700,
              fontSize: 12,
              borderRadius: "8px",
              border: `1px solid ${theme.normal.danger_light_active}`,
              "&:hover": {
                cursor: "pointer",
                border: "0px",
                background: theme.normal.danger_hover,
                color: theme.normal.highLight,
              },
              "&:active": {
                border: "0px",
                background: theme.normal.danger_active,
                color: theme.normal.highLight,
              },
            })}
          >
            <Trans>Close</Trans>
          </Box>
        )}

        <p>{props.rightTitle}</p>
      </Stack>
    </NormalInputBaseStack>
  );
};

export default NormalInputWithCloseButton;
