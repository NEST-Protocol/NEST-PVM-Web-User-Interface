import classNames from "classnames";
import { FC } from "react";
import "./styles";

type Props = {
  callBack: (selected: number) => void;
  list: {
    text: string;
    value: number;
  }[];
  selected: number;
  title?: string;
};

export const LeverChoose: FC<Props> = ({ ...props }) => {
  const classPrefix = "leverChoose";
  const liList = props.list.map((item, index) => {
    return (
      <li
        key={index.toString() + item.text}
        className={classNames({
          [`selected`]: props.selected === item.value ? true : false,
        })}
        onClick={() => {
          props.callBack(item.value);
        }}
      >
        {item.text}
      </li>
    );
  });
  return (
    <div className={classPrefix}>
      {props.title ? (
        <div className={`${classPrefix}-title`}>
          {props.title}
        </div>
      ) : (
        <></>
      )}
      <ul className={`${classPrefix}-choose`}>{liList}</ul>
    </div>
  );
};
