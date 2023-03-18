import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import useNEST from "../../hooks/useNEST";
import FuturesV2ABI from "../ABI/FuturesV2.json";
import { FuturesV2Contract } from "../contractAddress";

function useReadFuturesPrice(channelIndex: number) {
  const { chainsData } = useNEST();
  const {
    data: futuresPriceData,
    isRefetching: futuresPriceIsRefetching,
    isSuccess: futuresPriceIsSuccess,
    refetch: futuresPriceRefetch,
  } = useContractRead({
    address: chainsData.chainId
      ? (FuturesV2Contract[chainsData.chainId] as `0x${string}`)
      : FuturesV2Contract[56] as `0x${string}`,
    abi: FuturesV2ABI,
    functionName: "lastPrice",
    args: [channelIndex],
  });

  const futuresPrice: BigNumber | undefined = useMemo(() => {
    if (futuresPriceIsSuccess) {
      if (futuresPriceData === undefined) {
        return undefined;
      }
      return (futuresPriceData as BigNumber[])[2];
    } else {
      return undefined;
    }
  }, [futuresPriceData, futuresPriceIsSuccess]);

  return {
    futuresPrice,
    futuresPriceIsRefetching,
    futuresPriceIsSuccess,
    futuresPriceRefetch,
  };
}

export default useReadFuturesPrice;
