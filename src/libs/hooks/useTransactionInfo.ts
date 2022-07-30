import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import useWeb3 from "./useWeb3";
import {
  TransactionModalTokenInfo,
  TransactionModalType,
} from "../../pages/Shared/TransactionModal";
import { notifyTransaction } from "../../pages/Shared/TransactionToast";
import { BLOCK_TIME, normalToBigNumber, WIN_GET_STRING, WIN_TOAST_WAIT, ZERO_ADDRESS } from "../utils";
import { notifyWinToast, WinToastProps } from "../../pages/Shared/WinToast";
import { PVMWin } from "./useContract";
import { PVMWinContract } from "../constants/addresses";
import { WinListType } from "../../pages/Win";

export enum TransactionType {
  buyLever = 0,
  closeLever = 1,
  buyOption = 2,
  closeOption = 3,
  approve = 4,
  stake = 5,
  claim = 6,
  unStake = 7,
  sellOption = 8,
  swap = 9,
  roll = 10,
  winClaim = 11
}

export enum TransactionState {
  Pending = 0,
  Success = 1,
  Fail = 2,
  Revert = 3,
}

export type TransactionBaseInfoType = {
  title: string;
  info: string;
  type: TransactionType;
};

export type TransactionInfoType = {
  title: string;
  info: string;
  hash: string;
  txState: TransactionState;
  addTime: number;
  endTime: number;
  type: TransactionType;
};

type ShowModalType = {
  isShow: boolean;
  hash: string;
  txType: TransactionModalType;
  tokenInfo?: TransactionModalTokenInfo;
  info?: string
};

const useTransactionList = () => {
  const { chainId, library, account } = useWeb3();
  const [txList, setTxList] = useState<TransactionInfoType[]>([]);
  const [showModal, setShowModal] = useState<ShowModalType>({
    isShow: false,
    hash: "0x0",
    txType: TransactionModalType.wait,
  });
  const [pendingList, setPendingList] = useState<TransactionInfoType[]>([]);
  const [checking, setChecking] = useState(false);
  const PVMWinOJ = PVMWin(PVMWinContract);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    (async () => {
      var cache = localStorage.getItem("transactionList" + chainId?.toString());
      if (!cache) {
        return [];
      }
      setTxList(JSON.parse(cache));
    })();
  }, [chainId]);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    if (txList.length === 0) {
      return;
    }
    (async () => {
      localStorage.setItem(
        "transactionList" + chainId?.toString(),
        JSON.stringify(txList)
      );
      // check pending transaction
      var noResultTx: Array<TransactionInfoType> = txList.filter((item) => {
        return item.txState === TransactionState.Pending;
      });
      setPendingList(noResultTx);
    })();
    
  }, [chainId, txList]);
  const updateList = useCallback((item: TransactionInfoType) => {
    const index = txList.findIndex((t) => t.hash === item.hash);
    if (index > -1) {
      txList[index] = item;
      setTxList([...txList]);
    } else {
      setTxList(txList.concat(item));
    }
  },[txList]);

  const getList = useCallback(async () => {
    
    if (!PVMWinOJ || !chainId) {
      return;
    }

    const latest = await library?.getBlockNumber();
    if (!latest) {
      return;
    }

    const myBetsUrl = `https://api.hedge.red/api/` + WIN_GET_STRING[chainId] + `/userList/${account}/50`;
    const myBets_get = await fetch(myBetsUrl);
    const myBets_data = await myBets_get.json();
    const result = myBets_data.value.filter(
      (item: WinListType) => item.owner !== ZERO_ADDRESS
    );
    
    const latestItem = result[0];
    
    const notifyItem: WinToastProps = {
      gained: normalToBigNumber(latestItem.gained.toString(), 18),
      index: BigNumber.from(latestItem.index.toString()),
    };
    notifyWinToast(notifyItem);
  }, [PVMWinOJ, chainId, library, account]);

  useEffect(() => {
    if (pendingList.length === 0 || checking || !chainId) {
      return;
    }
    setChecking(true);
    (async () => {
      for (let index = 0; index < pendingList.length; index++) {
        const element = pendingList[index];
        const rec = await library?.getTransactionReceipt(element.hash);
        if (typeof rec?.status !== "undefined") {
          const status = rec.status
            ? TransactionState.Success
            : TransactionState.Fail;
          element.txState = status;
          updateList(element);
          setChecking(false);
          notifyTransaction(element);

          if (rec.status && element.type === TransactionType.roll) {
            setTimeout(() => {
              getList()
            }, WIN_TOAST_WAIT[chainId]);
          }
          return;
        }
      }
      setTimeout(() => {
        setChecking(false);
      }, BLOCK_TIME[chainId] + 6000);
    })();
    
  }, [pendingList, checking, library, updateList, getList, chainId]);

  const pushTx = (hash: string, txInfo: TransactionBaseInfoType) => {
    const nowDate = parseInt((new Date().getTime() / 1000).toString());
    const monthDate = nowDate + 86400 * 30;
    const newTxInfo: TransactionInfoType = {
      title: txInfo.title,
      info: txInfo.info,
      hash: hash,
      txState: TransactionState.Pending,
      addTime: nowDate,
      endTime: monthDate,
      type: txInfo.type,
    };
    updateList(newTxInfo);
  };

  const closeModal = () => {
    setShowModal({
      isShow: false,
      hash: "0x0",
      txType: TransactionModalType.wait,
    });
  };

  return { txList, showModal, setShowModal, pushTx, closeModal, pendingList };
};

const transactionList = createContainer(useTransactionList);

const useTransactionListCon = () => {
  return transactionList.useContainer();
};

export const Provider = transactionList.Provider;

export default useTransactionListCon;
