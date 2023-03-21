import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {FC, ReactNode} from "react";

interface BaseDrawerProps {
  children?: ReactNode;
}

const BaseDrawer: FC<BaseDrawerProps> = ({children}) => {
  return (
    <Box width={'100%'}>
      <Stack borderTop={"12px"} spacing={0} sx={(theme) => ({
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
