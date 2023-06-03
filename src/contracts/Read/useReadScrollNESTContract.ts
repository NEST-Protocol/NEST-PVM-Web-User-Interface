import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import useNEST from "../../hooks/useNEST";
import ScrollNESTABI from "../ABI/ScrollNEST.json";
import { NESTToken } from "../contractAddress";

export function useReadScrollNESTRemain(to: string | undefined) {
  const { chainsData } = useNEST();
  const address = useMemo(() => {
    if (chainsData.chainId && to) {
      return NESTToken[chainsData.chainId] as `0x${string}`;
    }
  }, [chainsData.chainId, to]);
  const {
    data: remainData,
    isRefetching: remainIsRefetching,
    isSuccess: remainIsSuccess,
    refetch: remainRefetch,
  } = useContractRead({
    address: address,
    abi: ScrollNESTABI,
    functionName: "remain",
    args: [to],
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
