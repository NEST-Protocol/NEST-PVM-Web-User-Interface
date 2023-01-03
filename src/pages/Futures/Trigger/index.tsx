import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import "./styles";

const Trigger: FC = () => {
  const classPrefix = "Trigger";
  const { theme } = useThemes();
  const stopLimit1 = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        className={`${classPrefix}-stopLimit1`}
      >
        <p className={`${classPrefix}-stopLimit1-title`}>Take Profit</p>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`rightInput`}
        >
          <input />
          <p>USDT</p>
        </Stack>
      </Stack>
    );
  };
  const info = () => {
    return (
      <>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Position</p>
          <p>5X Long 10000NEST</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Open Price</p>
          <p>1266.6 USDT</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Fees</p>
          <p>1266.6 USDT</p>
        </Stack>
      </>
    );
  };
  return (
    <MainCard classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}>
      <Stack spacing={0} alignItems="center">
        <p className="title">Trigger Position</p>
        {stopLimit1()}
        {info()}
        <MainButton className="mainButton">Confirm</MainButton>
      </Stack>
    </MainCard>
  );
};

export default Trigger;
