import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC } from "react";
import "./styles";

type Props = {
  isOn: boolean;
  title: string;
  onclick: () => void;
};

const OpenShow: FC<Props> = ({ ...props }) => {
  const classPrefix = "OpenShow";
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
      className={`${classPrefix}`}
    >
      <div className="out" onClick={props.onclick}>
        <div
          className={classNames({
            [`in`]: true,
            [`hidden`]: !props.isOn,
          })}
        ></div>
      </div>
      <p>{props.title}</p>
    </Stack>
  );
};

export default OpenShow;
