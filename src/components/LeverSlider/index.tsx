import Slider from "@mui/material/Slider";
import { FC } from "react";
import "./styles";

const LeverSlider: FC = () => {
  const marks = [
    {
      value: 2,
      label: "2",
    },
    {
      value: 5,
      label: "5",
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
      value: 50,
      label: "50",
    },
  ];

  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <Slider
      aria-label="Custom marks"
      defaultValue={2}
      max={50}
      min={2}
      getAriaValueText={valuetext}
      step={1}
      valueLabelDisplay="auto"
      marks={marks}
    />
  );
};

export default LeverSlider;
