import Box from "@mui/material/Box";
import { FC } from "react";
import { AgreeOn } from "../icons";

interface AgreeProps {
  value: boolean;
  changeValue: (value: boolean) => void;
  style?: React.CSSProperties;
}

const Agree: FC<AgreeProps> = ({ ...props }) => {
  return (
    <Box
      component={"button"}
      style={props.style}
      onClick={() => props.changeValue(!props.value)}
      sx={(theme) => ({
        width: "14px",
        height: "14px",
        border: props.value ? "0px" : `2px solid ${theme.normal.primary}`,
        boxSizing: "border-box",
        borderRadius: "4px",
        background: props.value ? theme.normal.primary : "none",
        padding: '2px',
        "&:hover": {
          cursor: "pointer",
        },
        "& svg, & p": {
          width: "10px",
          height: "10px",
          display: "block",
          "& path": {
            fill: theme.normal.highDark,
          },
        },
      })}
    >
      {props.value ? <AgreeOn /> : <p></p>}
    </Box>
  );
};

export default Agree;
