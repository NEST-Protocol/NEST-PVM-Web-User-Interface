import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, ReactNode} from "react";

interface BaseModalProps {
  children?: ReactNode;
}

const BaseModal: FC<BaseModalProps> = ({children}) => {
  return (
    <Box sx={{
      width: ["100%", "100%", "450px"],
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: ['20px', '20px', 0],
    }}>
      <Stack sx={(theme) => ({
        width: '100%',
        borderRadius: "12px",
        background: theme.normal.bg2,
        padding: 0,
      })} justifyContent="center" alignItems="center" spacing={0}>
        {children}
      </Stack>
    </Box>
  );
};

export default BaseModal;
