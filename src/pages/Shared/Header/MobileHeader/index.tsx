import { t, Trans } from "@lingui/macro";
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
  LittleETH,
} from "../../../../components/Icon";
import useTransactionListCon from "../../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../../libs/hooks/useWeb3";
// import { dynamicActivate } from "../../../../libs/i18nConfig";
import { showEllipsisAddress } from "../../../../libs/utils";
import Modal from "../Status/Modal";
import WalletModal from "../Status/WalletModal";
import "../Status/styles";
import "./styles";
import SelectNetworkModal from "./SelectNetworkModal";
import useThemes, { ThemeType } from "../../../../libs/hooks/useThemes";

const MobileHeader: FC = () => {
  const classPrefix = "header-mobile";
  const { account, chainId } = useWeb3();
  const [showList, setShowList] = useState(false);
  const location = useLocation();
  const { pendingList } = useTransactionListCon();
  const routes = [
    { path: "/futures", content: t`Futures` },
    { path: "/options", content: t`Options` },
    // { path: "/win", content: t`Win` },
    { path: "/NFTAuction", content: 'NFT' },
    { path: "/swap", content: t`Swap` },
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

  const headerListShow = (
    <div className={`${classPrefix}-headerList`}>
      <div className={`${classPrefix}-headerList-top`}>
        <div className={`${classPrefix}-headerList-top-left`}>
          <button onClick={() => setShowList(false)}>
            <XIcon />
          </button>
        </div>

        <Popup
          modal
          ref={modal}
          trigger={
            <div className={`${classPrefix}-headerList-top-mid`}>
              {nowNetwork()}
            </div>
          }
        >
          <SelectNetworkModal onClose={() => modal.current.close()} />
        </Popup>

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
          <Popup
            modal
            ref={modal}
            trigger={
              <button className={"fort-button fort-button-mobile"}>
                <Trans>Connect Wallet</Trans>
              </button>
            }
          >
            <Modal onClose={() => modal.current.close()} />
          </Popup>
        ) : (
          <Popup
            modal
            ref={modal}
            trigger={
              <button
                className={classNames({
                  [`fort-button`]: true,
                  [`fort-button-mobile`]: true,
                  [`showNum`]: pendingList.length > 0,
                })}
              >
                <div className={"transactionNum"}>
                  <WhiteLoading className={"animation-spin"} />
                  <p>{pendingList.length}</p>
                </div>
                <p>{showEllipsisAddress(account || "")}</p>
              </button>
            }
          >
            <WalletModal onClose={() => modal.current.close()} />
          </Popup>
        )}
      </div>
    </div>
  );
  return (
    <header>
      {showList ? headerListShow : <></>}
      <div className={classPrefix}>
        <div className={`${classPrefix}-leftButton`}>
          <button onClick={() => setShowList(true)}>
            <HeaderListMobile />
          </button>
        </div>
        <NESTLogo className={`${classPrefix}-logo`} />
        <div className={`${classPrefix}-rightButton`}></div>
      </div>
    </header>
  );
};

export default MobileHeader;
