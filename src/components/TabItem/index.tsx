import classNames from "classnames";
import { FC, useState } from "react";
import "./styles";

export type TabItemBaseData = {
  icon: JSX.Element;
  text: string;
};

export type TabItemArray = {
  data: Array<TabItemBaseData>;
  selectedVoid: (index: number) => void;
};

const TabItem: FC<TabItemArray> = ({ ...props }) => {
  const [selected, setSelected] = useState(0);
  const selectItem = (index: number) => {
    setSelected(index);
    props.selectedVoid(index);
  };
  const buttonLi = props.data.map((item, index) => {
    return (
      <li
        key={`${index}+${item.text}`}
        onClick={() => selectItem(index)}
        className={classNames({
          [`selected`]: index === selected,
        })}
      >
        {item.icon}
        <span>{item.text}</span>
      </li>
    );
  });
  return <ul className="TabItemArray">{buttonLi}</ul>;
};

export default TabItem;
