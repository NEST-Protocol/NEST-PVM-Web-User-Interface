import { BigNumber } from "ethers";
import { useMemo } from "react";
import { erc20ABI, useContractRead } from "wagmi";
import ERC20ABI from "../ABI/ERC20.json";

function useReadTokenBalance(tokenAddress: `0x${string}`, account: string) {
  const token = useMemo(() => {
    if (
      tokenAddress.toLocaleLowerCase() ===
      String().zeroAddress.toLocaleLowerCase()
    ) {
      return undefined;
    } else {
      return tokenAddress;
    }
  }, [tokenAddress]);
  const {
    data: balanceOfData,
    isRefetching: balanceOfIsRefetching,
    isSuccess: balanceOfIsSuccess,
    refetch: balanceOfRefetch,
  } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [account as `0x${string}`],
  });

  const balance: BigNumber | undefined = useMemo(() => {
    if (balanceOfIsSuccess) {
      if (balanceOfData === undefined) {
        return undefined;
      }
      return BigNumber.from((balanceOfData as any).toString());
    } else {
      return undefined;
    }
  }, [balanceOfData, balanceOfIsSuccess]);

  return {
    balance,
    balanceOfIsRefetching,
    balanceOfIsSuccess,
    balanceOfRefetch,
  };
}

export function useReadTokenAllowance(
  tokenAddress: `0x${string}`,
  from: string | undefined,
  to: string | undefined
) {
  const {
    data: allowanceData,
    isRefetching: allowanceIsRefetching,
    isSuccess: allowanceIsSuccess,
    refetch: allowanceRefetch,
  } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [from, to],
  });

  const allowance: BigNumber | undefined = useMemo(() => {
    if (allowanceIsSuccess) {
      if (allowanceData === undefined) {
        return undefined;
      }
      return BigNumber.from((allowanceData as any).toString());
    } else {
      return undefined;
    }
  }, [allowanceData, allowanceIsSuccess]);

  return {
    allowance,
    allowanceIsRefetching,
    allowanceIsSuccess,
    allowanceRefetch,
  };
}

export default useReadTokenBalance;
