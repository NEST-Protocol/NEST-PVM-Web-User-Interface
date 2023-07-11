import { FC } from "react";
import {
  DisIcon,
  GithubIcon,
  MiIcon,
  SafeIcon,
  TelIcon,
  TwitterIcon,
  WhitePaper,
} from "../../../../components/Icon";
import "./styles";

const MobileFooter: FC = () => {
  const footer = "footer-mobile";
  return (
    <footer>
      <div className={`${footer}`}>
        <a
          href="https://nestprotocol.org/doc/ennestwhitepaper.pdf"
          target="view_window"
        >
          <SafeIcon className={`${footer}-right-safe`} />
        </a>
        <a href="https://finance.docs.nestprotocol.org/#connect-wallet" target="view_window">
          <WhitePaper className={`${footer}-right-paper`} />
        </a>
        <a href="https://discord.gg/GWMhV4kdFg" target="view_window">
          <DisIcon className={`${footer}-right-disIcon`} />
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

export default MobileFooter;
