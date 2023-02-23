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
  const buttonArray = [2, 5, 10, 20, 50].map((item) => {
    return (
      <button
        key={`${classPrefix}+${item}`}
        onClick={() => {
          setSliderValue(item);
          props.callBack(item);
        }}
      >
        {item}
      </button>
    );
  });
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
        defaultValue={2}
        max={50}
        min={2}
        getAriaValueText={valuetext}
        step={null}
        value={sliderValue}
        onChange={(e: any) => {
          setSliderValue(e.target.value);
          props.callBack(e.target.value);
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={0}
        style={{ width: "100%" }}
        className={`${classPrefix}-button`}
      >
        {buttonArray}
      </Stack>
    </Stack>
  );
};

export default LeverSlider;
