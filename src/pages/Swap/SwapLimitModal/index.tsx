import classNames from "classnames";
import { FC } from "react";
import { LeverChoose } from "../../../components/LeverChoose";
import MainCard from "../../../components/MainCard";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import "./styles";

type Props = {
  callBack: (selected: number) => void;
  selected: number;
};

const SwapLimitModal: FC<Props> = ({ ...props }) => {
  const { theme } = useThemes();
  const limitList = [
    { text: "0.1%", value: 1 },
    { text: "0.5%", value: 5 },
    { text: "1.0%", value: 10 },
    { text: "2.0%", value: 20 },
    { text: "3.0%", value: 30 },
  ];
  const wrongString = () => {
    if (props.selected === 1) {
      return "Your transcation may fail";
    } else {
      return "";
    }
  };
  return (
    <div className="border">
      <MainCard
        classNames={classNames({
          [`swapLimitModal`]: true,
          [`swapLimitModal-dark`]: theme === ThemeType.dark,
        })}
      >
        <p className="swapLimitModal-title">Slippage Tolerance Setting</p>
        <LeverChoose
          selected={props.selected}
          list={limitList}
          callBack={props.callBack}
        />
        <p className="swapLimitModal-wrong">{wrongString()}</p>
      </MainCard>
    </div>
  );
};

export default SwapLimitModal;
