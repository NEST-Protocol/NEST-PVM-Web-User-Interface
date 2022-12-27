import { Stack } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { LongIcon, LongIconWhite, ShortIcon, ShortIconWhite } from "../Icon";
import "./styles";

type Props = {
  callBack: (isLong: boolean) => void;
  isLong: boolean;
};

const LongAndShort: FC<Props> = ({ ...props }) => {
  const classPrefix = "LongAndShort";
  const left = () => {
    return (
      <div
        className={classNames({
          [`${classPrefix}-left`]: true,
          [`selected`]: props.isLong,
        })}
      >
        <div>
          {props.isLong ? <LongIconWhite /> : <LongIcon />}
          <p>Long</p>
        </div>
      </div>
    );
  };
  const right = () => {
    return (
      <div
        className={classNames({
          [`${classPrefix}-right`]: true,
          [`selected`]: !props.isLong,
        })}
      >
        <div>
          {props.isLong ? <ShortIcon /> : <ShortIconWhite />}
          <p>Short</p>
        </div>
      </div>
    );
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
      className={`${classPrefix}`}
    >
      <div onClick={() => props.callBack(true)}>{left()}</div>
      <div onClick={() => props.callBack(false)}>{right()}</div>
    </Stack>
  );
};

export default LongAndShort;
