import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { NESTLogo, XIcon } from "../../../components/Icon";
import "./styles";
import { t } from "@lingui/macro";
import ConnectStatus from "./Status";

const Header: FC = () => {
  const location = useLocation();
  const header = "header";
  const [showTopNotice, setShowTopNotice] = useState(false);
  const routes = [
    { path: "/futures", content: t`Futures` },
    { path: "/options", content: t`Options` },
    // { path: "/win", content: t`Win` },
    { path: "/NFTAuction", content: 'NFT' },
    { path: "/swap", content: t`Swap` },
    // { path: "/farm", content: t`Farm` },
  ].map((item) => (
    <li
      key={item.path}
      className={classNames({
        selected: location.pathname.indexOf(item.path) === 0,
      })}
    >
      <Link to={item.path}>{item.content}</Link>
    </li>
  ));

  useEffect(() => {
    var cache = localStorage.getItem("topNotice");
    if (cache !== "1") {
      setShowTopNotice(true);
    } else {
      setShowTopNotice(false);
    }
  }, []);

  const closeTopNotice = () => {
    localStorage.setItem("topNotice", "1");
    setShowTopNotice(false);
  };
  return (
    <header>
      {showTopNotice ? (
        <div className={`${header}-topNotice`}>
          <p>
          The technical teams of the FORT protocol and NEST protocol worked together to advance the merger, and the merger is completed ahead of schedule on July 22nd.
          </p>
          <button onClick={closeTopNotice}>
            <XIcon />
          </button>
        </div>
      ) : (
        <></>
      )}

      <div className={`${header}-nav`}>
        <a href={"https://www.nestprotocol.org"}>
          <NESTLogo className={`${header}-logo`} />
        </a>
        <nav>
          <ul>{routes}</ul>
        </nav>
        <ConnectStatus />
      </div>
    </header>
  );
};

export default Header;
