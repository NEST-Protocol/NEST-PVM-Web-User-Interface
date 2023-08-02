import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, ReactNode} from "react";

interface BaseDrawerProps {
  children?: ReactNode;
}

const BaseDrawer: FC<BaseDrawerProps> = ({children}) => {
  return (
    <Box width={'100%'}>
      <Stack spacing={0} sx={(theme) => ({
        borderRadius: '12px 12px 0 0',
        background: theme.normal.bg2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      })}>
        {children}
      </Stack>
    </Box>
  );
};

export default BaseDrawer;
