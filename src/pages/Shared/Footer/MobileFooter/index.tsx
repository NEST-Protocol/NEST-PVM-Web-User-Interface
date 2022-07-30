import { FC } from "react";
import {
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
          href="./The_White_Paper_of_NEST_PVM.pdf"
          target="view_window"
        >
          <SafeIcon className={`${footer}-right-safe`} />
        </a>
        <a href="https://finance.docs.nestprotocol.org/#connect-wallet" target="view_window">
          <WhitePaper className={`${footer}-right-paper`} />
        </a>
        <a href="https://t.me/nest_chat" target="view_window">
          <TelIcon className={`${footer}-right-tel`} />
        </a>
        <a href="https://twitter.com/FortProtocol" target="view_window">
          <TwitterIcon className={`${footer}-right-twitter`} />
        </a>
        <a href="https://github.com/NEST-Protocol" target="view_window">
          <GithubIcon className={`${footer}-right-github`} />
        </a>
        <a href="https://nest-protocol-82041.medium.com/" target="view_window">
          <MiIcon className={`${footer}-right-mi`} />
        </a>
      </div>
    </footer>
  );
};

export default MobileFooter;
