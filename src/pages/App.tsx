import { FC } from "react";
import Footer from "./Shared/Footer";
import Header from "./Shared/Header";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import loadable from "@loadable/component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionModal from "./Shared/TransactionModal";
import { checkWidth } from "../libs/utils";
import MobileFooter from "./Shared/Footer/MobileFooter";
import MobileHeader from "./Shared/Header/MobileHeader";
import useThemes from "../libs/hooks/useThemes";
import "../themes/styles";
import useWeb3 from "../libs/hooks/useWeb3";
import { NFTAuctionWrongChain } from "./NFTAuction";
// import NFTAuction from "./NFTAuction";

const Perpetuals = loadable(() => import("./Futures"));
const Dashboard = loadable(() => import("./Dashboard"));
// const Option = loadable(() => import("./Options"));
// const Mining = loadable(() => import("./Farm"));
const NFTAuction = loadable(() => import("./NFTAuction"));
const Swap = loadable(() => import("./Swap"));
// const WinV2 = loadable(() => import("./WinV2"));

const App: FC = () => {
  const { theme } = useThemes();
  const { chainId } = useWeb3()
  return (
    <main className={`main-${theme.valueOf()}`}>
      <div className={"main-content"}>
        <TransactionModal />
        {/* <ToastContainer autoClose={8000}/> */}
        <ToastContainer />
        <HashRouter>
          {checkWidth() ? <Header /> : <MobileHeader />}
          <Switch>
            <Route path="/futures">
              <Perpetuals />
            </Route>
            {/* <Route path="/options">
              <Option />
            </Route> */}
            {/* <Route path="/farm">
              <Mining />
            </Route> */}
            {/* <Route path="/win">
              <WinV2 />
            </Route> */}
            <Route path="/NFTAuction">
              {chainId === 1 ? (<NFTAuctionWrongChain/>) : (<NFTAuction />)}
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Redirect to="/futures" />
          </Switch>
        </HashRouter>
      </div>
      {checkWidth() ? <Footer /> : <MobileFooter />}
    </main>
  );
};

export default App;
