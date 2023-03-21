import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Long, Short } from "../icons";

interface LongOrShortProps {
  value: boolean;
  changeValue: (value: boolean) => void;
}

const Button = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 48,
  borderRadius: 12,
  backgroundColor: theme.normal.grey,
  color: theme.normal.text0,
  fontSize: 16,
  fontWeight: 700,
  "& svg": {
    width: 20,
    height: 20,
    display: "block",
    "& path": {
      fill: theme.normal.text0,
    },
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.normal.grey_hover,
  },
  "&:active": {
    backgroundColor: theme.normal.grey_active,
  },
  "&.SelectedLong": {
    color: theme.normal.highLight,
    backgroundColor: theme.normal.success,
    "& svg path": {
      fill: theme.normal.highLight,
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.normal.success_hover,
    },
    "&:active": {
      backgroundColor: theme.normal.success_active,
    },
    "@media (hover:none)": {
      "&:hover": {
        backgroundColor: theme.normal.success,
      },
    },
  },
  "&.SelectedShort": {
    color: theme.normal.highLight,
    backgroundColor: theme.normal.danger,
    "& svg path": {
      fill: theme.normal.highLight,
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.normal.danger_hover,
    },
    "&:active": {
      backgroundColor: theme.normal.danger_active,
    },
    "@media (hover:none)": {
      "&:hover": {
        backgroundColor: theme.normal.danger,
      },
    },
  },
}));

const LongOrShort: FC<LongOrShortProps> = ({ ...props }) => {
  return (
    <Stack direction={"row"} spacing={"8px"} width={"100%"}>
      <Button
        component={"button"}
        className={props.value ? "SelectedLong" : ""}
        onClick={() => props.changeValue(true)}
      >
        <Stack direction={"row"} spacing={"12px"} justifyContent={"center"}>
          <Long />
          <p>Long</p>
        </Stack>
      </Button>
      <Button
        component={"button"}
        className={!props.value ? "SelectedShort" : ""}
        onClick={() => props.changeValue(false)}
      >
        <Stack direction={"row"} spacing={"12px"} justifyContent={"center"}>
          {" "}
          <Short />
          <p>Short</p>
        </Stack>
      </Button>
    </Stack>
  );
};

export default LongOrShort;
