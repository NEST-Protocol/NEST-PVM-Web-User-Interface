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
            这是一个风险提示这是一个风险提示这是一个风险提示这是一个风险提示
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
