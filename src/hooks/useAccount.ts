import {useCallback, useEffect, useMemo, useState} from "react";
import useService from "../contracts/useService";
import useNEST from "./useNEST";
import {serviceAccountList} from "../lib/NESTRequest";
import {t} from "@lingui/macro";

export interface AccountListData {
  text: string;
  time: number;
  status: number;
  orderTypeString: string;
  applyTime?: number;
  chainId?: number;
  hash?: string;
  ordertype?: string;
}

function useAccount() {
  const {service_balance, block_balance} = useService();
  const {account, chainsData, signature} = useNEST();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>();
  const [tokenBlockBalance, setTokenBlockBalance] = useState<number>();
  const [moneyList, setMoneyList] = useState<Array<AccountListData>>([]);
  const [historyList, setHistoryList] = useState<Array<AccountListData>>([]);

  const localeOrderType = (orderType: string) => {
    switch (orderType) {
      case 'Wallet Deposit':
        return t`Wallet Deposit`;
      case 'Wallet Withdraw':
        return t`Wallet Withdraw`;
      case 'Copy Trading':
        return t`Copy Trading`;
      case 'Freeze Deposit':
        return t`Freeze Deposit`;
      case 'Freeze to Deposit':
        return t`Freeze to Deposit`;
      default:
        return orderType;
    }
  }

  /**
   * List
   */
  const getAssetsList = useCallback(async () => {
    if (chainsData.chainId && account.address && signature) {
      const assetsListBase = await serviceAccountList(
        chainsData.chainId,
        account.address,
        {Authorization: signature.signature}
      );
      if (Number(assetsListBase["errorCode"]) === 0) {
        const value = assetsListBase["value"];
        const list: Array<AccountListData> = value.map((item: any) => {
          const one: AccountListData = {
            text: `${Number(item["amount"]).floor(2)} ${item["token"]}`,
            time: item["timestamp"],
            applyTime: item["applyTime"],
            status: item["status"],
            chainId: item["chainId"],
            hash: item["hash"],
            ordertype: item["ordertype"],
            orderTypeString: localeOrderType(item["type"]),
          };
          return one;
        });
        setMoneyList(list);
      }
    }
  }, [account.address, chainsData.chainId, signature]);
  // const getTransactionList = useCallback(async () => {
  //   if (chainsData.chainId && account.address && signature) {
  //     const transactionListBase = await serviceHistory(
  //       chainsData.chainId,
  //       account.address,
  //       { Authorization: signature.signature }
  //     );
  //     if (Number(transactionListBase["errorCode"]) === 0) {
  //       const value = transactionListBase["value"];
  //       const list: Array<AccountListData> = value.map((item: any) => {
  //         const one: AccountListData = {
  //           text: serviceTypeToWebTypeString(item["orderType"]),
  //           time: item["timestamp"],
  //           status: item["status"],
  //           ordertype: item["orderType"],
  //         };
  //         return one;
  //       });
  //       setHistoryList(list);
  //     }
  //   }
  // }, [account.address, chainsData.chainId, signature]);
  /**
   * balance
   */
  const getBalance = useCallback(async () => {
    service_balance((result: number) => {
      setTokenBalance(result);
    });
  }, [service_balance]);

  const getBlockBalance = useCallback(async () => {
    block_balance((result: number) => {
      setTokenBlockBalance(result);
    });
  }, [block_balance]);

  const showBalance = useMemo(() => {
    if (account.address) {
      if (tokenBalance) {
        return tokenBalance.floor(2);
      } else {
        return "0";
      }
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBalance]);

  const showBlockBalance = useMemo(() => {
    if (account.address) {
      if (tokenBlockBalance) {
        return tokenBlockBalance.floor(2);
      } else {
        return "0";
      }
    } else {
      return String().placeHolder;
    }
  }, [account.address, tokenBlockBalance]);

  /**
   * update
   */
  useEffect(() => {
    getBalance();
    const time = setInterval(() => {
      getBalance();
    }, 10 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getBalance]);

  useEffect(() => {
    getBlockBalance();
    const time = setInterval(() => {
      getBlockBalance();
    }, 10 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getBlockBalance]);

  useEffect(() => {
    getAssetsList();
    // getTransactionList();
    const time = setInterval(() => {
      getAssetsList();
      // getTransactionList();
    }, 10 * 1000);
    return () => {
      clearInterval(time);
    };
  }, [getAssetsList]);

  return {
    showDeposit,
    setShowDeposit,
    showWithdraw,
    setShowWithdraw,
    showBalance,
    showBlockBalance,
    moneyList,
    historyList,
    getAssetsList,
  };
}

export default useAccount;
