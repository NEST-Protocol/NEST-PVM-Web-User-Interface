import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { SnackbarContent, SnackbarKey, SnackbarMessage } from "notistack";
import React, { useMemo } from "react";
import useNEST from "../../hooks/useNEST";
import { Close, Fail, Success } from "../icons";
import MainButton from "../MainButton/MainButton";

export enum SnackBarType {
  success,
  waiting,
  fail,
}

interface NormalSnackBarProps {
  id: SnackbarKey;
  title: string;
  info: string;
  type: SnackBarType;
  message: SnackbarMessage;
  closeSnackbar: (key?: SnackbarKey | undefined) => void;
  hash?: string;
}

const NormalSnackBarStack = styled(Stack)(({ theme }) => ({
  padding: 12,
  background: theme.normal.bg2,
  maxWidth: 366,
  width: "100%",
  borderRadius: 12,
  boxShadow: "0px 2px 12px rgba(16, 18, 19, 0.15)",
  "& .SnackBarIcon svg": {
    width: 16,
    height: 16,
    display: "block",
  },
  "& .success svg path": {
    fill: theme.normal.success,
  },
  "& .fail svg path": {
    fill: theme.normal.danger,
  },
  "& .SnackBarClose svg": {
    width: 16,
    height: 16,
    display: "block",
    "& path": {
      fill: theme.normal.text2,
    },
  },
  "& .SnackBarTitle": {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "24px",
    height: 24,
    color: theme.normal.text0,
  },
  "& .SnackBarInfo": {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "16px",
    wordBreak: "break-all",
    width: "100%",
    maxWidth: 239,
    maxHeight: 200,
    color: theme.normal.text2,
    marginTop: 4,
  },
}));

const NormalSnackBar = React.forwardRef<HTMLDivElement, NormalSnackBarProps>(
  (props, ref) => {
    const { chainsData } = useNEST();
    const Icon = useMemo(() => {
      if (props.type === SnackBarType.success) {
        return <Success />;
      } else if (props.type === SnackBarType.fail) {
        return <Fail />;
      } else {
        return <></>;
      }
    }, [props.type]);
    const iconClass = useMemo(() => {
      if (props.type === SnackBarType.success) {
        return "success";
      } else if (props.type === SnackBarType.fail) {
        return "fail";
      } else {
        return "";
      }
    }, [props.type]);
    const showInfo = useMemo(() => {
      return props.info === "" ? (
        <></>
      ) : (
        <p className="SnackBarInfo">{props.info}</p>
      );
    }, [props.info]);

    return (
      <SnackbarContent ref={ref} role="alert">
        <NormalSnackBarStack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} justifyContent={"flex-start"}>
            <Box
              className={`SnackBarIcon ${iconClass}`}
              width={"16px"}
              height={"24px"}
              component={"button"}
            >
              {Icon}
            </Box>
            <Box marginX={"8px"} width={"100%"}>
              <p className="SnackBarTitle">{props.title}</p>
              {showInfo}
            </Box>
          </Stack>
          <Stack direction={"row"} justifyContent={"flex-end"}>
            {props.hash ? (
              <MainButton
                title={"View"}
                onClick={() => {
                  window.open(
                    (props.hash ?? "").hashToChainScan(chainsData.chainId)
                  );
                }}
                style={{
                  height: "24px",
                  width: "47px",
                  fontSize: 10,
                  borderRadius: 4,
                }}
              />
            ) : (
              <></>
            )}
            <Box
              className={`SnackBarClose`}
              width={"16px"}
              height={"24px"}
              marginLeft={"8px"}
              component={"button"}
              onClick={() => props.closeSnackbar(props.id)}
            >
              <Close />
            </Box>
          </Stack>
        </NormalSnackBarStack>
      </SnackbarContent>
    );
  }
);

export default NormalSnackBar;
