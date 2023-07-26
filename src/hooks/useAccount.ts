import { useCallback, useEffect, useMemo, useState } from "react";
import useService from "../contracts/useService";
import useNEST from "./useNEST";
import { serviceAccountList, serviceHistory } from "../lib/NESTRequest";
import { serviceTypeToWebTypeString } from "./useTransactionReceipt";

export interface AccountListData {
  text: string;
  time: number;
  status: number;
  chainId?: number;
  hash?: string;
  ordertype?: string;
}

function useAccount() {
  const { service_balance } = useService();
  const { account, chainsData, signature } = useNEST();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>();
  const [moneyList, setMoneyList] = useState<Array<AccountListData>>([]);
  const [historyList, setHistoryList] = useState<Array<AccountListData>>([]);

  /**
   * List
   */
  const getAssetsList = useCallback(async () => {
    if (chainsData.chainId && account.address && signature) {
      const assetsListBase = await serviceAccountList(
        chainsData.chainId,
        account.address,
        { Authorization: signature.signature }
      );
      if (Number(assetsListBase["errorCode"]) === 0) {
        const value = assetsListBase["value"];
        const list: Array<AccountListData> = value.map((item: any) => {
          const one: AccountListData = {
            text: `${Number(item["amount"]).floor(2)} ${item["token"]}`,
            time: item["timestamp"],
            status: item["status"],
            chainId: item["chainId"],
            hash: item["hash"],
            ordertype: item["ordertype"],
          };
          return one;
        });
        setMoneyList(list);
      }
    }
  }, [account.address, chainsData.chainId, signature]);
  const getTransactionList = useCallback(async () => {
    if (chainsData.chainId && account.address && signature) {
      const transactionListBase = await serviceHistory(
        chainsData.chainId,
        account.address,
        { Authorization: signature.signature }
      );
      if (Number(transactionListBase["errorCode"]) === 0) {
        const value = transactionListBase["value"];
        const list: Array<AccountListData> = value.map((item: any) => {
          const one: AccountListData = {
            text: serviceTypeToWebTypeString(item["orderType"]),
            time: item["timestamp"],
            status: item["status"],
            ordertype: item["orderType"],
          };
          return one;
        });
        setHistoryList(list);
      }
    }
  }, [account.address, chainsData.chainId, signature]);
  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      setTokenBalance(result);
    });
  }, [service_balance]);

  const showBalance = useMemo(() => {
    if (account.address && tokenBalance) {
      return tokenBalance.floor(2);
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBalance]);

  /**
   * update
   */
  useEffect(() => {
    getBalance();
    const time = setInterval(() => {
      getBalance();
    }, 5 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getBalance]);

  useEffect(() => {
    getAssetsList();
    getTransactionList();
    const time = setInterval(() => {
      getAssetsList();
      getTransactionList();
    }, 20 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getAssetsList, getTransactionList]);

  return {
    showDeposit,
    setShowDeposit,
    showWithdraw,
    setShowWithdraw,
    showBalance,
    moneyList,
    historyList,
    getAssetsList,
  };
}

export default useAccount;
