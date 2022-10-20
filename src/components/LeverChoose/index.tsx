import { Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC } from "react";
import useWeb3 from "../../libs/hooks/useWeb3";
import "./styles";

type Props = {
  callBack: (selected: number) => void;
  selected: number;
};

export const LeverChoose: FC<Props> = ({ ...props }) => {
  const { chainId } = useWeb3();
  const classPrefix = "leverChoose";
  const liList = (
    chainId === 1
      ? [
          { text: "1X", value: 1 },
          { text: "2X", value: 2 },
          { text: "3X", value: 3 },
          { text: "4X", value: 4 },
          { text: "5X", value: 5 },
        ]
      : [
          { text: "1X", value: 1 },
          { text: "2X", value: 2 },
          { text: "5X", value: 5 },
          { text: "10X", value: 10 },
          { text: "15X", value: 15 },
          { text: "20X", value: 20 },
        ]
  ).map((item, index) => {
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
      <div className={`${classPrefix}-title`}>
        <Trans>Leverage</Trans>
      </div>
      <ul className={`${classPrefix}-choose`}>{liList}</ul>
    </div>
  );
};
