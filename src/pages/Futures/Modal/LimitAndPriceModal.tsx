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
      title={"Risk Warning"}
    >
      <p>
        Contract that may cau bur principal to be damaged. Please evaluate the
        risk yourself before deciding whether to participate.1. External oracle
        risk: NEST protocol's perpetual contract price comes from the NEST
        oracle. lf the oracle is attacked or other reasons cause the price to be
        abnormal, the system may encounter settlement exceptions, which may
        cause errors in the user'.
        <br />
        1. External oracle risk: NEST protocol's perpetual contract price comes
        from the NEST oracle. If the oracle is attacked or other reasons cause
        the price to be abnormal, the system may encounter settlement
        exceptions, which may cause errors in the user's revenue calculation.
        <br />
        2. Smart contract risk: The smart contract of the NEST protocol has not
        been audited. There may be fatal unknown sin the smart.
        <br />
        <br />
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
