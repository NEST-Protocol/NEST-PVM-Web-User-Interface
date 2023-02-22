import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { FC } from "react";
import "./styles";

const LeverSlider: FC = () => {
  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Slider
        aria-label="Custom marks"
        defaultValue={2}
        max={50}
        min={2}
        getAriaValueText={valuetext}
        step={1}
        valueLabelDisplay="auto"
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={0}
        style={{width: '100%'}}
      >
        <button>2</button>
        <button>5</button>
        <button>10</button>
        <button>20</button>
        <button>50</button>
      </Stack>
    </Stack>
  );
};

export default LeverSlider;
