import { BigNumber } from "ethers/lib/ethers";
import { useMemo } from "react";
import { usePrepareSendTransaction } from "wagmi";

function useAddGasLimit(tranConfig: any, percent?: number) {
  const { config } = usePrepareSendTransaction(tranConfig);
  const gasLimit = useMemo(() => {
    if (config && config.gas) {
      
      const basGasLimit = config.gas.toBigNumber();
      return basGasLimit.add(basGasLimit.mul(percent ?? 10).div(100));
    } else {
      return BigNumber.from("0");
    }
  }, [config, percent]);
  return gasLimit;
}

export default useAddGasLimit;
