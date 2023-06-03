import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import ScrollNESTABI from "../ABI/ScrollNEST.json";
import { NESTToken } from "../contractAddress";

export function useReadScrollNESTRemain(target: string) {
  const {
    data: remainData,
    isRefetching: remainIsRefetching,
    isSuccess: remainIsSuccess,
    refetch: remainRefetch,
  } = useContractRead({
    address: NESTToken[534353] as `0x${string}`,
    abi: ScrollNESTABI,
    functionName: "remain",
    args: [target],
    
  });

  const remain: BigNumber | undefined = useMemo(() => {
    if (remainIsSuccess) {
      if (remainData === undefined) {
        return undefined;
      }
      return remainData as BigNumber;
    } else {
      return undefined;
    }
  }, [remainData, remainIsSuccess]);

  return {
    remain,
    remainIsRefetching,
    remainIsSuccess,
    remainRefetch,
  };
}
