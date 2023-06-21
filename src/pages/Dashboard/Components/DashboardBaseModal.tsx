import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, ReactNode} from "react";

interface BaseModalProps {
  children?: ReactNode;
}

const BaseModal: FC<BaseModalProps> = ({children}) => {
  return (
    <Stack justifyContent={"center"} alignItems={"center"} width={'100vw'} height={'100vh'}>
      <Box sx={{
        width: ["100%", "100%", "450px"],
        padding: '20px',
        maxHeight: '100vh',
        overflow: 'scroll',
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
    </Stack>
  );
};

export default BaseModal;
