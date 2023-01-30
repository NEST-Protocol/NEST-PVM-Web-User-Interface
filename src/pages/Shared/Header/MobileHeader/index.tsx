import classNames from "classnames";
import { FC, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Popup } from "reactjs-popup";
import {
  DarkIcon,
  NESTLogo,
  HeaderListMobile,
  LittleBSC,
  WhiteIcon,
  WhiteLoading,
  XIcon,
  LittleETH, DashboardIcon, DashboardWhiteIcon,
} from "../../../../components/Icon";
import useTransactionListCon from "../../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../../libs/hooks/useWeb3";
// import { dynamicActivate } from "../../../../libs/i18nConfig";
import { showEllipsisAddress } from "../../../../libs/utils";
import Modal from "../Status/Modal";
import WalletModal from "../Status/WalletModal";
import "../Status/styles";
import "./styles";
import SelectNetworkModal, { SelectTestTokenModal } from "./SelectNetworkModal";
import useThemes, { ThemeType } from "../../../../libs/hooks/useThemes";
import Drawer from "@mui/material/Drawer";

const MobileHeader: FC = () => {
  const classPrefix = "header-mobile";
  const { account, chainId } = useWeb3();
  const [showList, setShowList] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const [showTestToken, setShowTestToken] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const location = useLocation();
  const { pendingList } = useTransactionListCon();
  const routes = [
    { path: "/futures", content: `Futures` },
    // { path: "/options", content: `Options` },
    // { path: "/win", content: `Win` },
    { path: "/NFTAuction", content: "NFT" },
    { path: "/swap", content: `Swap` },
    // { path: "/farm", content: `Farm` },
  ].map((item) => (
    <li
      key={item.path}
      className={classNames({
        selected: location.pathname.indexOf(item.path) === 0,
      })}
      onClick={() => setShowList(false)}
    >
      <Link to={item.path}>{item.content}</Link>
    </li>
  ));
  const modal = useRef<any>();
  const { theme, setTheme } = useThemes();
  const themeIcon = () => {
    if (theme === ThemeType.dark) {
      return <WhiteIcon />;
    } else {
      return <DarkIcon />;
    }
  };
  const nowNetwork = useCallback(() => {
    if (!chainId) {
      return (
        <>
          <LittleBSC />
          <p>{"BNB"}</p>
        </>
      );
    }
    if (chainId === 1 || chainId === 5) {
      return (
        <>
          <LittleETH />
          <p>{chainId === 1 ? "Ethereum" : "Rinkeby"}</p>
        </>
      );
    } else {
      return (
        <>
          <LittleBSC />
          <p>{chainId === 56 ? "BNB" : "BNBTest"}</p>
        </>
      );
    }
  }, [chainId]);

  const headerListShow = () => {
    return (
      <div className={`${classPrefix}-headerList`}>
        <div className={`${classPrefix}-headerList-top`}>
          <div className={`${classPrefix}-headerList-top-left`}>
            <button onClick={() => setShowList(false)}>
              <XIcon />
            </button>
          </div>
          <div
            className={`${classPrefix}-headerList-top-mid`}
            onClick={() => {
              setShowList(false);
              setShowNet(true);
            }}
          >
            {nowNetwork()}
          </div>
          <div className={`${classPrefix}-headerList-top-right`}>
            <button
              onClick={() => {
                if (theme === ThemeType.dark) {
                  setTheme(ThemeType.white);
                } else {
                  setTheme(ThemeType.dark);
                }
              }}
            >
              {themeIcon()}
            </button>
          </div>
        </div>
        <ul>{routes}</ul>
        <div className={"connectStatus"}>
          {account === undefined ? (
            <button
              className={"fort-button fort-button-mobile"}
              onClick={() => {
                setShowList(false);
                setShowCon(true);
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              className={classNames({
                [`fort-button`]: true,
                [`fort-button-mobile`]: true,
                [`showNum`]: pendingList.length > 0,
              })}
              onClick={() => {
                setShowList(false);
                setShowWallet(true);
              }}
            >
              <div className={"transactionNum"}>
                <WhiteLoading className={"animation-spin"} />
                <p>{pendingList.length}</p>
              </div>
              <p>{showEllipsisAddress(account || "")}</p>
            </button>
          )}
        </div>
        <button className="testToken" onClick={() => {
          setShowList(false);
          setShowTestToken(true);
        }}><p>Test Token</p></button>
      </div>
    );
  };
  return (
    <header>
      <Drawer anchor={"top"} open={showList} onClose={() => setShowList(false)}>
        {headerListShow()}
      </Drawer>
      <Popup modal ref={modal} open={showNet}>
        <SelectNetworkModal onClose={() => setShowNet(false)} />
      </Popup>
      <Popup modal ref={modal} open={showTestToken} nested>
        <SelectTestTokenModal onClose={() => setShowTestToken(false)} />
      </Popup>
      <Popup modal ref={modal} open={showCon}>
        <Modal onClose={() => setShowCon(false)} />
      </Popup>
      <Popup modal ref={modal} open={showWallet}>
        <WalletModal onClose={() => setShowWallet(false)} />
      </Popup>
      <div className={classPrefix}>
        <div className={`${classPrefix}-leftButton`}>
          <button onClick={() => setShowList(true)}>
            <HeaderListMobile />
          </button>
        </div>
        <NESTLogo className={`${classPrefix}-logo`} />
        <div className={`${classPrefix}-rightButton`}>
          <button>
            <Link to={'/dashboard'}>
              { theme === ThemeType.dark ? (
                <DashboardWhiteIcon/>
              ) : (
                <DashboardIcon/>
              ) }
            </Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
