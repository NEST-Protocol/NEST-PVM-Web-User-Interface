import { FC, useCallback, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import NESTHead from "./Share/Head/NESTHead";
import NESTFoot from "./Share/Foot/NESTFoot";
// import TestTheme from "./demo/testTheme";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import { styled } from "@mui/material/styles";
import useWindowWidth from "../hooks/useWindowWidth";
import useNEST from "../hooks/useNEST";
import { KOLClick, KOLWallet } from "../lib/NESTRequest";

const HomePage = loadable(() => import("./Home/Home"));
const FuturesPage = loadable(() => import("./Futures/Futures"));
const AccountPage = loadable(() => import("./Account/Account"));
const SwapPage = loadable(() => import("./Swap/Swap"));
const DashboardPage = loadable(() => import("./Dashboard/Dashboard"));
const ReferralPage = loadable(() => import("./Dashboard/Referral/Referral"));
const DirectPosterPage = loadable(() => import("./DirectPoster/DirectPoster"));
const App: FC = () => {
  const { headHeight, isBigMobile } = useWindowWidth();
  const { account, chainsData } = useNEST();

  const getQueryVariable = (variable: string) => {
    const query = window.location.search.substring(1);
    if (query) {
      const vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) === variable) {
          return decodeURIComponent(pair[1]);
        }
      }
    }
    return null;
  };

  const handleInviteCode = useCallback(async () => {
    let inviteCode = getQueryVariable("a");
    if (!inviteCode) {
      const code = window.location.href.split("?a=")[1];
      if (code) {
        inviteCode = window.location.href
          .split("?a=")[1]
          .split("?position=")[0];
      }
    }

    if (inviteCode && account.address) {
      if (
        inviteCode.toLowerCase() === account.address.toLowerCase().slice(-8)
      ) {
        return;
      }
      fetch("https://api.nestfi.net/api/users/users/saveInviteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account.address,
          code: inviteCode.toLowerCase(),
          timestamp: new Date().getTime() / 1000,
        }),
      }).catch((e) => {
        console.log(e);
      });
    }
  }, [account]);

  useEffect(() => {
    handleInviteCode();
  }, [handleInviteCode]);
  // count KOL Link
  useEffect(() => {
    let code = getQueryVariable("pt");
    if (code) {
      KOLClick({ kolLink: window.location.href });
    }
  }, []);
  // count KOL Link with address
  useEffect(() => {
    let code = getQueryVariable("pt");
    if (code && account.address && chainsData.chainId !== 97) {
      KOLWallet({ kolLink: window.location.href, wallet: account.address });
    }
  }, [account.address, chainsData.chainId]);

  const MainContent = styled("div")(({ theme }) => {
    return {
      minHeight: isBigMobile
        ? `calc(100vh - ${headHeight}px)`
        : `calc(100vh - ${112 + headHeight}px)`,
      background: theme.normal.bg0,
    };
  });
  const swapOrDirectPoster = useMemo(() => {
    if (chainsData.chainId === 534353) {
      return <Route path="/faucet" element={<DirectPosterPage />} />;
    } else {
      return <Route path="/swap" element={<SwapPage />} />;
    }
  }, [chainsData.chainId]);
  return (
    <Stack spacing={0}>
      <HashRouter>
        <NESTHead />
        <MainContent>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/futures" element={<FuturesPage />} />
            {swapOrDirectPoster}
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/referral" element={<ReferralPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
          {/* <TestTheme /> */}
        </MainContent>
        <NESTFoot />
      </HashRouter>
    </Stack>
  );
};

export default App;
