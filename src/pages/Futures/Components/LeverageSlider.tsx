import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { FC } from "react";

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 50,
    label: "50",
  },
];

interface LeverageSliderProps {
  value: number;
  changeValue: (value: number) => void;
  style?: React.CSSProperties;
}

const LeverageSlider: FC<LeverageSliderProps> = ({ ...props }) => {
  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <Stack
      width={"100%"}
      style={props.style}
    >
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontSize: 14,
            fontWeight: 400,
            color: theme.normal.text2,
          })}
        >
          Leverage
        </Box>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontSize: 14,
            fontWeight: 700,
            color: theme.normal.text0,
          })}
        >{`${props.value}X`}</Box>
      </Stack>
      <Box sx={{paddingX: '5px'}}>
      <Slider
        aria-label="Custom marks"
        defaultValue={1}
        max={50}
        min={1}
        getAriaValueText={valuetext}
        step={1}
        value={props.value}
        onChange={(e: any) => {
          props.changeValue(e.target.value);
        }}
        marks={marks}
        sx={(theme) => ({
          color: theme.normal.primary,
          "& .MuiSlider-rail": {
            background: theme.normal.bg1,
            opacity: 1,
          },
          "& .MuiSlider-track": {
            background: theme.normal.primary,
          },
          "& .MuiSlider-mark": {
            opacity: 1,
            width: "10px",
            height: "10px",
            background: theme.normal.bg0,
            border: `1px solid ${theme.normal.bg1}`,
            boxSizing: "border-box",
            borderRadius: "5px",
            marginLeft: '-4px',
            "&.MuiSlider-markActive": {
              background: theme.normal.primary,
            },
          },
          "& .MuiSlider-thumb": {
            border: `2px solid ${theme.normal.primary}`,
            background: theme.normal.highLight,
            width: '12px',
            height: '12px',
            "&:before": {
              boxShadow: 'none'
            },
            "&:hover":{
              boxShadow: 'none'
            },
            "&:active":{
              boxShadow: 'none'
            },
            boxShadow: 'none'
          },
          "& .MuiSlider-markLabel": {
            fontSize: 14,
            fontWeight: 400,
            color: theme.normal.text2,
          }
        })}
      />
      </Box>
    </Stack>
  );
};

export default LeverageSlider;
