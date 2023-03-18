import { FC } from "react";
import BaseProtocolModal from "../../Share/Modal/BaseProtocolModal";

interface TriggerRiskModalProps {
  onClose: () => void;
  callBack: () => void;
}

const TriggerRiskModal: FC<TriggerRiskModalProps> = ({ ...props }) => {
  return (
    <BaseProtocolModal
      onClose={props.onClose}
      buttonClick={(agree: boolean) => {
        if (agree) {
          localStorage.setItem("TriggerRiskModal", "1");
        }
        props.callBack();
      }}
      title={"Trading Risk"}
    >
      <p>
        Please note that "Limit order" or "Stop order" is not guaranteed to be
        executed. This may include, but is not limited to, the following cases.
        <br />
        1. The trigger price has been reached but there is not enough time to
        execute.
        <br />
        2. No one picks up the execution order There may be slippage to execute
        at the trigger price.
      </p>
    </BaseProtocolModal>
  );
};

export default TriggerRiskModal;
