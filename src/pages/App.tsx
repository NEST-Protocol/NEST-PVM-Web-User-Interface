import { FC } from "react";
import Stack from "@mui/material/Stack";
import NESTHead from "./Share/Head/NESTHead";
import NESTFoot from "./Share/Foot/NESTFoot";
import TestTheme from "./demo/testTheme";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import { styled } from "@mui/material/styles";
import useWindowWidth from "../hooks/useWindowWidth";

const HomePage = loadable(() => import("./Home/Home"));
const FuturesPage = loadable(() => import("./Futures/Futures"));
const SwapPage = loadable(() => import("./Swap/Swap"));
const DashboardPage = loadable(() => import("./Dashboard/Dashboard"));
const App: FC = () => {
  const { headHeight, isBigMobile } = useWindowWidth();

  const MainContent = styled("div")(({ theme }) => {
    return {
      minHeight: isBigMobile ? `calc(100vh - ${headHeight}px)` : `calc(100vh - ${112 + headHeight}px)`,
      background: theme.normal.bg0,
    };
  });
  return (
    <Stack spacing={0}>
      <HashRouter>
        <NESTHead />
        <MainContent>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/futures" element={<FuturesPage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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
