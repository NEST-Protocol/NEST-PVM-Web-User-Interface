import classNames from "classnames";
import { FC, useRef, useState } from "react";
import Popup from "reactjs-popup";
import {
  DarkIcon,
  DisIcon,
  GithubIcon,
  LittleBSC,
  TokenNest,
  MiIcon,
  SafeIcon,
  TelIcon,
  TwitterIcon,
  WhiteIcon,
  WhitePaper,
} from "../../../components/Icon";
import { useGetToken } from "../../../contracts/hooks/useGetToken";
import { SupportedChains } from "../../../libs/constants/chain";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { ListTooltip } from "../../../styles/MUI";
import Modal from "../Header/Status/Modal";
// import { dynamicActivate } from "../../../libs/i18nConfig";
import "./styles/index";

const Footer: FC = () => {
  const footer = "footer";
  const { account } = useWeb3();
  const modal = useRef<any>();
  const [showCon, setShowCon] = useState(false);
  const { theme, setTheme } = useThemes();
  const themeIcon = () => {
    if (theme === ThemeType.dark) {
      return <WhiteIcon />;
    } else {
      return <DarkIcon />;
    }
  };
  const addNEST = useGetToken("NEST");

  return (
    <footer>
      <Popup
        modal
        ref={modal}
        onClose={() => setShowCon(false)}
        open={showCon}
      >
        <Modal onClose={() => setShowCon(false)} />
      </Popup>
      <div className={`${footer}-left`}>
        <button
          className={`${footer}-left-theme`}
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
        {SupportedChains[0].chainId === 97 ? (
          <ListTooltip
            placement="top-start"
            className={classNames({
              [`testToken`]: true,
              [`testToken-dark`]: theme === ThemeType.dark,
            })}
            title={
              <>
                <p>Select a test token</p>
                <ul>
                  <li
                    onClick={() => {
                      if (account === undefined) {
                        setShowCon(true);
                      } else {
                        addNEST();
                      }
                    }}
                  >
                    <TokenNest />
                    <p>NEST</p>
                  </li>
                  <li
                    onClick={() => {
                      window.open("https://testnet.bnbchain.org/faucet-smart");
                    }}
                  >
                    <LittleBSC />
                    <p>BNB</p>
                  </li>
                </ul>
              </>
            }
          >
            <button className={`${footer}-left-receive`}>Test Token</button>
          </ListTooltip>
        ) : (
          <></>
        )}
      </div>
      <div className={`${footer}-right`}>
        <a
          href="https://nestprotocol.org/doc/ennestwhitepaper.pdf"
          target="view_window"
        >
          <SafeIcon className={`${footer}-right-safe`} />
        </a>
        <a href="https://discord.com/invite/nestprotocol" target="view_window">
          <DisIcon className={`${footer}-right-disIcon`} />
        </a>
        <a
          href="https://finance.docs.nestprotocol.org/#connect-wallet"
          target="view_window"
        >
          <WhitePaper className={`${footer}-right-paper`} />
        </a>
        <a href="https://t.me/nest_chat" target="view_window">
          <TelIcon className={`${footer}-right-tel`} />
        </a>
        <a href="https://twitter.com/NEST_protocol" target="view_window">
          <TwitterIcon className={`${footer}-right-twitter`} />
        </a>
        <a href="https://github.com/NEST-Protocol" target="view_window">
          <GithubIcon className={`${footer}-right-github`} />
        </a>
        <a href="https://nest-protocol.medium.com/" target="view_window">
          <MiIcon className={`${footer}-right-mi`} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
