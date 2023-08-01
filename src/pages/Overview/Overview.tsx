import Stack from "@mui/material/Stack";
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import useWindowWidth from "../../hooks/useWindowWidth";
import {Trans} from "@lingui/macro";
import NESTTabs from "../../components/NESTTabs/NESTTabs";
import MobileList, {AccountListType} from "./Components/MobileList";
import MoneyTable from "./Components/MoneyTable";
import TransactionTable from "./Components/TransactionTable";
import useAccount from "../../hooks/useAccount";
import {NoOrderMobile} from "../Futures/OrderList";
import Box from "@mui/material/Box";
import useNEST from "../../hooks/useNEST";
import {useLocalStorage} from "react-use";
import { useSearchParams } from "react-router-dom";

const Overview: FC = () => {
  const {isBigMobile} = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams()
  const [tabsValue, setTabsValue] = useState( searchParams.get('type') === 'withdraw' ? 1 : 0);
  const {account} = useNEST()
  const {
    moneyList,
    historyList,
  } = useAccount();
  const [messagesStr, setMessagesStr] = useLocalStorage(`nest.messages`, '{}');

  const updateRead = useCallback(() => {
    if (moneyList.length > 0 || historyList.length > 0) {
      const messages = JSON.parse(messagesStr ?? '{}')
      setMessagesStr(JSON.stringify({
        ...messages,
        [`${account.address}`]: [moneyList.length, historyList.length]
      }))
    }
  }, [moneyList.length, historyList.length, messagesStr, account.address])

  useEffect(() => {
    updateRead()
  }, [updateRead])

  const tabs = useMemo(() => {
    const accountTabsData = [
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <p>
          <Trans>Deposit</Trans>
        </p>
      </Stack>,
      <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
        <p>
          <Trans>Withdraw</Trans>
        </p>
      </Stack>,
    ];
    return (
      <NESTTabs
        value={tabsValue}
        className={"AccountTabs"}
        datArray={accountTabsData}
        height={44}
        space={24}
        selectCallBack={(value: number) => {
          if (value === 0) {
            setSearchParams({type: 'deposit'})
          } else if (value === 1) {
            setSearchParams({type: 'withdraw'})
          }
          setTabsValue(value)
        }}
        isFull={false}
      />
    );
  }, [tabsValue]);
  const listType = useMemo(() => {
    if (tabsValue === 0) {
      return AccountListType.deposit;
    } else if (tabsValue === 1) {
      return AccountListType.withdraw;
    } else {
      return AccountListType.transaction;
    }
  }, [tabsValue]);
  const list = useMemo(() => {
    const ordertype = tabsValue === 0 ? "DEPOSIT" : "WITHDRAW";
    const filterList = moneyList.filter((item) => item.ordertype === ordertype);
    if (isBigMobile) {
      if (
        (tabsValue <= 1 && filterList.length === 0) ||
        (tabsValue === 2 && historyList.length === 0)
      ) {
        return (
          <NoOrderMobile>
            <Trans>No Order</Trans>
          </NoOrderMobile>
        );
      }
      return (
        <Stack spacing={"16px"}>
          {(tabsValue === 2 ? historyList : filterList).map((item, index) => {
            return (
              <MobileList
                key={`AccountMobileList + ${index}`}
                type={listType}
                data={item}
              />
            );
          })}
        </Stack>
      );
    } else {
      if (tabsValue <= 1) {
        return <MoneyTable list={filterList} type={listType}/>;
      } else {
        return <TransactionTable list={historyList}/>;
      }
    }
  }, [historyList, isBigMobile, listType, moneyList, tabsValue]);
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Stack
          spacing={"24px"}
          maxWidth={"1100px"}
          width={"100%"}
          paddingX={"24px"}
          paddingY={['0', '0', '0', '40px']}
        >
          {
            isBigMobile ? (
              <a href={'/#/account'}>
                <Stack sx={(theme) => ({
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: '400',
                  color: theme.normal.text0,
                  borderBottom: `1px solid ${theme.normal.border}`,
                })} direction={'row'} alignItems={"center"} spacing={'8px'} paddingY={'16px'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M0.764135 6.23565C0.63396 6.10548 0.63396 5.89442 0.764135 5.76425L6.42099 0.107397C6.55116 -0.022778 6.76222 -0.0227781 6.89239 0.107397L7.37766 0.592666C7.50784 0.722841 7.50784 0.933896 7.37766 1.06407L2.44178 5.99995L7.37766 10.9358C7.50784 11.066 7.50784 11.2771 7.37766 11.4072L6.89239 11.8925C6.76222 12.0227 6.55116 12.0227 6.42099 11.8925L0.764135 6.23565Z"
                          fill="#F9F9F9" fillOpacity="0.6"/>
                  </svg>
                  <span>
              <Trans>
                Account
              </Trans>
            </span>
                </Stack>
              </a>
            ) : (
              <Stack direction={'row'} spacing={'12px'} alignItems={"center"} sx={(theme) => ({
                padding: '16px',
                borderBottom: `1px solid ${theme.normal.border}`,
              })}>
                <a href={'/#/account'}>
                  <Box sx={(theme) => ({
                    color: theme.normal.text2,
                    fontSize: "14px",
                    lineHeight: '20px',
                    fontWeight: "400",
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: theme.normal.grey_hover,
                    }
                  })}>
                    <Trans>
                      Account
                    </Trans>
                  </Box>
                </a>
                <Box sx={(theme) => ({
                  color: theme.normal.text2,
                  fontSize: "14px",
                  lineHeight: '20px',
                  fontWeight: "400",
                })}>
                  /
                </Box>
                <Stack sx={(theme) => ({
                  color: theme.normal.text0,
                  fontSize: "14px",
                  lineHeight: '20px',
                  fontWeight: "400",
                })}>
                  <Trans>
                    Overview
                  </Trans>
                </Stack>
              </Stack>
            )
          }
          <Stack spacing={['12px', '12px', '12px', '16px']}>
            <Stack
              direction={"row"}
              justifyContent={"start"}
              paddingX={[0, 0, 0, '16px']}
              sx={(theme) => ({
                borderBottom: isBigMobile
                  ? `1px solid none`
                  : `1px solid ${theme.normal.border}`,
                boxSizing: "border-box",
              })}
            >
              {tabs}
            </Stack>
            {list}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Overview;
