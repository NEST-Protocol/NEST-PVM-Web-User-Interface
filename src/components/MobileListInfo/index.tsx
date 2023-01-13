import classNames from "classnames";
import { FC } from "react";
import { LightTooltip } from "../../styles/MUI";
import "./styles";

type Props = {
  title: string;
  under?: boolean;
  underText?: string;
};

const MobileListInfo: FC<Props> = ({ children, ...props }) => {
  const classPrefix = "mobileListInfo";
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-title`}>
        {props.under ? (
          <LightTooltip
            placement="top-end"
            title={props.underText}
          >
            <span
              className={classNames({
                [`underLine`]: props.under,
              })}
            >
              {props.title}
            </span>
          </LightTooltip>
        ) : (
          <span
            className={classNames({
              [`underLine`]: props.under,
            })}
          >
            {props.title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default MobileListInfo;
