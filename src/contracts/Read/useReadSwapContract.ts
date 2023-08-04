import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import useNEST from "../../hooks/useNEST";
import UNISwapABI from "../ABI/UNISwapV2.json";
import { SwapContract } from "../contractAddress";

function useReadSwapAmountOut(
  amountIn: BigNumber | undefined,
  path?: Array<string>
) {
  const { chainsData } = useNEST();
  const address = useMemo(() => {
    if (
      chainsData.chainId &&
      path &&
      amountIn &&
      !BigNumber.from("0").eq(amountIn)
    ) {
      return SwapContract[chainsData.chainId] as `0x${string}`;
    }
  }, [amountIn, chainsData.chainId, path]);
  const {
    data: uniSwapAmountOutData,
    isRefetching: uniSwapAmountOutIsRefetching,
    isLoading: uniSwapAmountOutIsLoading,
    isSuccess: uniSwapAmountOutIsSuccess,
    refetch: uniSwapAmountOutRefetch,
  } = useContractRead({
    address: address,
    abi: UNISwapABI,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });

  const uniSwapAmountOut: BigNumber[] | undefined = useMemo(() => {
    if (uniSwapAmountOutIsSuccess) {
      if (uniSwapAmountOutData === undefined) {
        return undefined;
      }
      return uniSwapAmountOutData as BigNumber[];
    } else {
      return undefined;
    }
  }, [uniSwapAmountOutData, uniSwapAmountOutIsSuccess]);

  return {
    uniSwapAmountOut,
    uniSwapAmountOutIsRefetching,
    uniSwapAmountOutIsSuccess,
    uniSwapAmountOutRefetch,
    uniSwapAmountOutIsLoading,
  };
}

export default useReadSwapAmountOut;
