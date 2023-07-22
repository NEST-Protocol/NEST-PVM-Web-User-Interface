import { useState } from "react";

function useAccount() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return { showDeposit, setShowDeposit, showWithdraw, setShowWithdraw };
}

export default useAccount;
