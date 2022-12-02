import { FC } from "react";
import {
  DarkIcon,
  DisIcon,
  GithubIcon,
  MiIcon,
  SafeIcon,
  TelIcon,
  TwitterIcon,
  WhiteIcon,
  WhitePaper,
} from "../../../components/Icon";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
// import { dynamicActivate } from "../../../libs/i18nConfig";
import "./styles/index";

const Footer: FC = () => {
  const footer = "footer";
  const { theme, setTheme } = useThemes();
  const themeIcon = () => {
    if (theme === ThemeType.dark) {
      return <WhiteIcon />;
    } else {
      return <DarkIcon />;
    }
  };

  return (
    <footer>
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
      </div>
      <div className={`${footer}-right`}>
        <a href="https://nestprotocol.org/doc/ennestwhitepaper.pdf" target="view_window">
          <SafeIcon className={`${footer}-right-safe`} />
        </a>
        <a href="https://discord.com/invite/nestprotocol" target="view_window">
          <DisIcon className={`${footer}-right-disIcon`} />
        </a>
        <a href="https://finance.docs.nestprotocol.org/#connect-wallet" target="view_window">
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
