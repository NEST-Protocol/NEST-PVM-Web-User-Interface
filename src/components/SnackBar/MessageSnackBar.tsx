import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { SnackbarContent, SnackbarKey, SnackbarMessage } from "notistack";
import React from "react";

interface MessageSnackBarProps {
  id: SnackbarKey;
  message: SnackbarMessage;
}

const MessageSnackBar = React.forwardRef<HTMLDivElement, MessageSnackBarProps>(
  (props, ref) => {
    const MessageP = styled('p')(({theme}) => {
        return {
            paddingTop:8,
            paddingBottom: 8,
            paddingLeft: 12,
            paddingRight: 12,
            background: theme.normal.text0,
            color: theme.normal.bg0,
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 6
        }
    })
    return (
      <SnackbarContent ref={ref} role="alert">
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          width={'100%'}
        >
          <MessageP>{props.message}</MessageP>
        </Stack>
      </SnackbarContent>
    );
  }
);

export default MessageSnackBar;
