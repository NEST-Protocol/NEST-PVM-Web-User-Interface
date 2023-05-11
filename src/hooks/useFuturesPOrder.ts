import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { FuturesV2Contract } from "../contracts/contractAddress";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import { lipPrice } from "./useFuturesNewOrder";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import useNEST from "./useNEST";
import FuturesV2ABI from "../contracts/ABI/FuturesV2.json";
import { Order } from "../pages/Dashboard/Dashboard";
import { t } from "@lingui/macro";

function useFuturesPOrder(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined
) {
  const { chainsData } = useNEST();
  const provider = useProvider();
  const [marginAssets, setMarginAssets] = useState<BigNumber>();
  const tokenName = priceToken[parseInt(data.channelIndex.toString())];
  const isLong = data.orientation;
  const lever = parseInt(data.lever.toString());
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);
  /**
   * futures contract
   */
  const contractAddress = useMemo(() => {
    if (chainsData.chainId) {
      return FuturesV2Contract[chainsData.chainId];
    }
  }, [chainsData.chainId]);
  const FuturesV2 = useContract({
    address: contractAddress,
    abi: FuturesV2ABI,
    signerOrProvider: provider,
  });
  useEffect(() => {
    (async () => {
      try {
        if (!price || !FuturesV2) {
          return;
        }
        const priceNum = price[tokenName];
        const value = await FuturesV2.balanceOf(data.index, priceNum);

        setMarginAssets(value);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [data.index, FuturesV2, price, tokenName]);

  const showBasePrice = BigNumber.from(
    data.basePrice.toString()
  ).bigNumberToShowString(18, 2);
  const showTriggerTitle = useMemo(() => {
    const isEdit =
      BigNumber.from("0").eq(data.stopProfitPrice) &&
      BigNumber.from("0").eq(data.stopLossPrice);
    return !isEdit ? t`Edit` : t`Trigger`;
  }, [data.stopLossPrice, data.stopProfitPrice]);
  const tp = useMemo(() => {
    const tpNum = data.stopProfitPrice;
    return BigNumber.from("0").eq(tpNum)
      ? String().placeHolder
      : BigNumber.from(tpNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopProfitPrice]);
  const sl = useMemo(() => {
    const slNum = data.stopLossPrice;
    return BigNumber.from("0").eq(slNum)
      ? String().placeHolder
      : BigNumber.from(slNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopLossPrice]);
  const showLiqPrice = useMemo(() => {
    const result = lipPrice(
      data.balance,
      data.appends,
      data.lever,
      price ? price[tokenName] : data.basePrice,
      data.basePrice,
      data.orientation
    );
    return result.bigNumberToShowString(18, 2);
  }, [
    data.appends,
    data.balance,
    data.basePrice,
    data.lever,
    data.orientation,
    price,
    tokenName,
  ]);
  const showMarginAssets = useMemo(() => {
    const normalOrder = marginAssets
      ? marginAssets.bigNumberToShowString(18, 2)
      : String().placeHolder;
    return normalOrder;
  }, [marginAssets]);

  const showPercentNum = useMemo(() => {
    if (marginAssets) {
      const marginAssets_num = parseFloat(
        marginAssets.bigNumberToShowString(18, 2)
      );
      const balance_num = parseFloat(
        BigNumber.from(data.balance.toString())
          .add(data.appends)
          .bigNumberToShowString(4, 2)
      );
      if (marginAssets_num >= balance_num) {
        return parseFloat(
          (((marginAssets_num - balance_num) * 100) / balance_num).toFixed(2)
        );
      } else {
        return -parseFloat(
          (((balance_num - marginAssets_num) * 100) / balance_num).toFixed(2)
        );
      }
    } else {
      return 0;
    }
  }, [data.appends, data.balance, marginAssets]);
  const showPercent = useMemo(() => {
    if (showPercentNum > 0) {
      return `+${showPercentNum}`;
    } else if (showPercentNum < 0) {
      return `${showPercentNum}`;
    } else {
      return "0";
    }
  }, [showPercentNum]);
  const isRed = useMemo(() => {
    return showPercent.indexOf("-") === 0;
  }, [showPercent]);
  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.owner.toString(),
      leverage: `${data.lever.toString()}X`,
      orientation: data.orientation ? t`Long` : t`Short`,
      actualRate: showPercentNum,
      index: parseInt(data.index.toString()),
      openPrice: parseFloat(data.basePrice.bigNumberToShowString(18, 2)),
      tokenPair: `${tokenName}/USDT`,
      actualMargin: marginAssets
        ? parseFloat(marginAssets.bigNumberToShowString(18, 2))
        : 0,
      initialMargin: parseFloat(
        BigNumber.from(data.balance.toString()).bigNumberToShowString(4, 2)
      ),
      lastPrice: parseFloat(
        price ? price[tokenName].bigNumberToShowString(18, 2) : "0"
      ),
      sp: parseFloat(tp === String().placeHolder ? "0" : tp),
      sl: parseFloat(sl === String().placeHolder ? "0" : sl),
    };
    return info;
  }, [
    data.balance,
    data.basePrice,
    data.index,
    data.lever,
    data.orientation,
    data.owner,
    marginAssets,
    price,
    showPercentNum,
    sl,
    tokenName,
    tp,
  ]);
  return {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    showTriggerTitle,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  };
}

export default useFuturesPOrder;
