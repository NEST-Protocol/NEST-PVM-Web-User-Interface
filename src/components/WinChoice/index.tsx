import { Tooltip } from "antd";
import classNames from "classnames";
import { BigNumber } from "ethers";
import { FC } from "react";
import { bigNumberToNormal } from "../../libs/utils";
import "./styles";

type WinChoiceProps = {
  NESTAmount: BigNumber;
  selected: BigNumber | null | undefined;
  callBack: (num: BigNumber) => void;
};

const WinChoice: FC<WinChoiceProps> = ({ ...props }) => {
  const classPrefix = "winChoice";
  const NESTAmountNormal = bigNumberToNormal(props.NESTAmount, 18, 1);
  return (
    <div
      className={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-selected`]:
          props.NESTAmount.toString() === props.selected?.toString()
            ? true
            : false,
      })}
      onClick={() => {
        props.callBack(props.NESTAmount);
      }}
    >
      <div className={`${classPrefix}-topBg`}>
        <p className={`${classPrefix}-topBg-topNum`}>
          <Tooltip
            placement="top"
            color={"#ffffff"}
            title={"Amount of NEST that 1 NEST can win"}
          >
            {NESTAmountNormal}
          </Tooltip>
        </p>
      </div>

      <Tooltip
        placement="top"
        color={"#ffffff"}
        title={`Probability of winning ${NESTAmountNormal} NEST`}
      >
        <div className={`${classPrefix}-bottomBg`}>
          <p className={`${classPrefix}-bottomBg-num`}>
            {`${100 / parseFloat(NESTAmountNormal)} %`}
          </p>
        </div>
      </Tooltip>
    </div>
  );
};

export default WinChoice;
