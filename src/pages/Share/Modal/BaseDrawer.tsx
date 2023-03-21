import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Close } from "../../../components/icons";

interface BaseDrawerProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const BaseBox = styled(Box)(({ theme }) => {
  return {
    width: "100%",
  };
});

const BaseModalStack = styled(Stack)(({ theme }) => {
  return {
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    background: theme.normal.bg2,
    padding: 20,
  };
});

const TopStack = styled(Stack)(({ theme }) => {
  return {
    width: "100%",
    marginBottom: 20,
    "& button": {
      width: 20,
      height: 20,
      "&:hover": {
        cursor: "pointer",
      },
      "& svg": {
        width: 20,
        height: 20,
        "& path": {
          fill: theme.normal.text2,
        },
      },
    },
    "& .ModalTitle": {
      fontWeight: 700,
      width: "100%",
      fontSize: 16,
      color: theme.normal.text0,
      textAlign: "left",
    },
  };
});

const BaseDrawer: FC<BaseDrawerProps> = ({ children, ...props }) => {
  return (
    <BaseBox>
      <BaseModalStack justifyContent="center" alignItems="center" spacing={0}>
        <TopStack
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <p className="ModalTitle">{props.title}</p>
          <button onClick={props.onClose}>
            <Close />
          </button>
        </TopStack>
        {children}
      </BaseModalStack>
    </BaseBox>
  );
};

export default BaseDrawer;
