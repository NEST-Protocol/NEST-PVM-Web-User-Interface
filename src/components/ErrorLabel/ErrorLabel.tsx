import Box from "@mui/material/Box";
import { FC } from "react";

interface ErrorLabelProps {
  title: string;
}

const ErrorLabel: FC<ErrorLabelProps> = ({ ...props }) => {
  return (
    <Box
      component={"p"}
      sx={(theme) => ({
        width: `100%`,
        color: theme.normal.danger,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: `20px`,
      })}
    >
      {props.title}
    </Box>
  );
};

export default ErrorLabel;
