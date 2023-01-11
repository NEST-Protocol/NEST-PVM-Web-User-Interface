import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { FC, useState } from "react";
import { NoticeSelected } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import "./styles";
type Props = {
  onClose: () => void;
  action: () => void;
};

const TriggerRiskModal: FC<Props> = ({ ...props }) => {
  const classPrefix = "TriggerRiskModal";
  const [selected, setSelected] = useState(false);

  return (
    <div className="ModalBorder">
      <MainCard classNames={`${classPrefix}-card`}>
        <Stack spacing={0} alignItems="left" className={`${classPrefix}-main`}>
          <p className={`${classPrefix}-main-title`}>Trading Risk Alert</p>
          <p className={`${classPrefix}-main-text`}>
            Please note that "Limit order" or "Stop order" is not
            guaranteed to be executed. This may include, but is not limited to,
            the following cases.<br />
            1. The trigger price has been reached but there is not enough time
            to execute.<br />
            2. No one picks up the execution order There may be slippage to
            execute at the trigger price
          </p>
          <p className={`${classPrefix}-main-select`}>
            <button
              className={classNames({
                [`selectButton`]: true,
                [`selected`]: selected,
              })}
              onClick={() => {
                setSelected(!selected);
              }}
            >
              <NoticeSelected />
            </button>
            <span>No longer displayed</span>
          </p>
          <MainButton
            onClick={() => {
              if (selected) {
                localStorage.setItem("TriggerRiskModal", "1");
              }
              props.onClose();
              props.action();
            }}
          >
            Accept
          </MainButton>
        </Stack>
      </MainCard>
    </div>
  );
};

export default TriggerRiskModal;
