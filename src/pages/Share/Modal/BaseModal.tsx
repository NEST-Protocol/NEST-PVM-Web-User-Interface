import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { Close } from "../../../components/icons";
import useWindowWidth from "../../../hooks/useWindowWidth";

interface BaseModalProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const BaseModal: FC<BaseModalProps> = ({ children, ...props }) => {
  const { isMobile } = useWindowWidth();

  const BaseBox = useMemo(() => {
    return styled(Box)(({ theme }) => {
      const width = isMobile ? "100%" : 450;
      const config = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
      return {
        ...config,
        width: width,
        padding: isMobile ? 20 : 0,
      };
    });
  }, [isMobile]);
  const BaseModalStack = useMemo(() => {
    return styled(Stack)(({ theme }) => {
      const width = isMobile ? "100%" : 450;
      return {
        width: width,
        borderRadius: 12,
        background: theme.normal.bg2,
        padding: 20,
      };
    });
  }, [isMobile]);
  const TopStack = useMemo(() => {
    return styled(Stack)(({ theme }) => {
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
        "& .ModalLeftButton": {
          width: isMobile ? 0 : 20,
        },
        "& .ModalTitle": {
          fontWeight: 700,
          width: "100%",
          fontSize: 16,
          color: theme.normal.text0,
          textAlign: isMobile ? "left" : "center",
        },
      };
    });
  }, [isMobile]);

  return (
    <BaseBox>
      <BaseModalStack justifyContent="center" alignItems="center" spacing={0}>
        <TopStack
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <button className="ModalLeftButton"></button>
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

export default BaseModal;
