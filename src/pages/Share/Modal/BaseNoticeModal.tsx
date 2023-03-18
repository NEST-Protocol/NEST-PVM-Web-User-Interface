import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";

interface BaseNoticeModalProps {
  children?: React.ReactNode;
}

const BaseNoticeModal: FC<BaseNoticeModalProps> = ({ children }) => {
  const { isMobile } = useWindowWidth();

  const BaseBox = useMemo(() => {
    return styled(Box)(({ theme }) => {
      const width = isMobile ? "100%" : 350;
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
      const width = isMobile ? "100%" : 350;
      return {
        width: width,
        borderRadius: 12,
        background: theme.normal.bg2,
        padding: 20,
        paddingTop: 48,
      };
    });
  }, [isMobile]);

  return (
    <BaseBox>
      <BaseModalStack justifyContent="center" alignItems="center" spacing={0}>
        <Stack spacing={"16px"} width={"100%"} alignItems="center">
          {children}
        </Stack>
      </BaseModalStack>
    </BaseBox>
  );
};

export default BaseNoticeModal;
