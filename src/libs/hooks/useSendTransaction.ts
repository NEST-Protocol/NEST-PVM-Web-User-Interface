import { WinV2BetData } from "./../../pages/WinV2/RightCard/index";
import { useCallback } from "react";
import { Contract } from "ethers";
import useWeb3 from "./useWeb3";
import { addGasLimit } from "../utils";
import useTransactionListCon, {
  TransactionBaseInfoType,
  TransactionType,
} from "./useTransactionInfo";
import { TransactionModalType } from "../../pages/Shared/TransactionModal";

export function useSendTransaction(
  contract: Contract | null,
  tx: any,
  txInfo: TransactionBaseInfoType
) {
  const { library, chainId } = useWeb3();
  const { pushTx, setShowModal } = useTransactionListCon();
  const txPromise = useCallback(async () => {
    setShowModal({
      isShow: true,
      hash: "0x0",
      txType: TransactionModalType.wait,
    });
    const failModal = (info: string) => {
      setShowModal({
        isShow: true,
        hash: "0x0",
        txType: TransactionModalType.fail,
        info: info,
      });
    };

    if (!library || !contract) {
      failModal("!library || !contract");
      return;
    }
    const estimateGas = await library.estimateGas(tx).catch((error) => {
      failModal(error.data.message);
      return;
    });
    if (!estimateGas) {
      return;
    }
    const newTx = { ...tx, gasLimit: addGasLimit(estimateGas) };
    const winV2LocalData = (hash: string, data: string) => {
      var cache = localStorage.getItem("winV2Data" + chainId?.toString());
      var txList: Array<WinV2BetData> = cache ? JSON.parse(cache) : [];
      const newData: WinV2BetData = {
        bet: (Number(data.split(",")[0]) / 10000).toString(),
        chance: (Number(data.split(",")[1]) / 10000).toString(),
        multiplier: (1000000 / parseFloat(data.split(",")[1])).toFixed(2),
        index: "---",
        claim: "false",
        time: (Date.now() / 1000).toString(),
        openBlock: "---",
        profit: "---",
        hash: hash,
      };
      txList.push(newData);
      localStorage.setItem(
        "winV2Data" + chainId?.toString(),
        JSON.stringify(txList)
      );
    };
    return library
      ?.getSigner()
      .sendTransaction(newTx)
      .then((res) => {
        pushTx(res.hash, txInfo);
        if (txInfo.type === TransactionType.roll) {
          winV2LocalData(res.hash, txInfo.info);
        }
        setShowModal({
          isShow: true,
          hash: res.hash,
          txType: TransactionModalType.success,
        });
      })
      .catch((error) => {
        failModal(error.message);
      });
  }, [chainId, contract, library, pushTx, setShowModal, tx, txInfo]);

  return txPromise;
}
