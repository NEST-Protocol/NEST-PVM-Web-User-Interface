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
        For users/smart contracts using NEST Protocol perpetual contracts,
        please understand its rules and the differences of similar products in
        the market when performing positions, settlement, liquidation and other
        related operations. After fully understanding the following possible
        risks and can bear Participate in the risk situation:
        <br />
        1. Uncertainty risk of income: The calculation method of NEST perpetual
        contract is different from the calculation method of perpetual contract
        of traditional centralized exchange. The NEST perpetual contract
        converts the future price of the asset based on the historical rate of
        return of the asset. Therefore, the asset price increases by 100% after
        the user opens a position. The user's income is not 100%. In extreme
        cases, even if the asset price is rising, your income may be negative.
        <br />
        2. Position liquidation risk: NEST perpetual contracts provide leverage
        of 1-20 times. When your leverage is greater than 1 times leverage, the
        price fluctuation of the underlying asset may cause liquidation.
        <br />
        3. NEST Token price fluctuation risk: Both the margin and the final
        profit and loss use NEST Token, and NEST itself is also a highly
        volatile asset. In extreme cases, even if your perpetual contract
        position is profitable, However, due to the fluctuation of the NEST
        price itself, it may cause you to lose money in terms of fiat currency.
        <br />
        4. External oracle risk: NEST protocol's perpetual contract price comes
        from the NEST oracle. If the oracle is attacked or other reasons cause
        the price to be abnormal, The system may encounter settlement
        exceptions, which may cause errors in the user's revenue calculation.
        <br />
        5. Smart contract risk: There may be fatal unknown risks in the smart
        contract that may cause your principal to be damaged. Please evaluate
        the risk yourself before deciding whether to participate.
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
