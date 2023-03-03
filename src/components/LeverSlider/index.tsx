import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { FC, useState } from "react";
import "./styles";

type LeverSliderProps = {
  callBack: (selected: number) => void;
};

const LeverSlider: FC<LeverSliderProps> = ({ ...props }) => {
  const classPrefix = "LeverSlider";
  const [sliderValue, setSliderValue] = useState<number>(2);
  function valuetext(value: number) {
    return `${value}`;
  }
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
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
      className={`${classPrefix}`}
    >
      <Slider
        aria-label="Custom marks"
        defaultValue={1}
        max={50}
        min={1}
        getAriaValueText={valuetext}
        step={1}
        value={sliderValue}
        onChange={(e: any) => {
          setSliderValue(e.target.value);
          props.callBack(e.target.value);
        }}
        marks={marks}
      />
    </Stack>
  );
};

export default LeverSlider;
