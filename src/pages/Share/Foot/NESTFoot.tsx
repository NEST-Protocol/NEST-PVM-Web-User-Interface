import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  GithubIcon,
  MediumIcon,
  BNBTokenLogo,
} from "../../../components/icons";
import useNEST from "../../../hooks/useNEST";
import useWindowWidth from "../../../hooks/useWindowWidth";

export const FootArray = [
  { icon: DiscordIcon, link: "https://discord.gg/GWMhV4kdFg" },
  { icon: TelegramIcon, link: "https://t.me/nest_chat" },
  { icon: TwitterIcon, link: "https://twitter.com/NEST_protocol" },
  { icon: GithubIcon, link: "https://github.com/NEST-Protocol" },
  { icon: MediumIcon, link: "https://nest-protocol.medium.com/" },
  { icon: BNBTokenLogo, link: "https://testnet.bnbchain.org/faucet-smart" },
];

export const NESTFootStack = styled(Stack)(({ theme }) => ({
  height: 112,
  background: theme.normal.bg0,
  borderTop: `1px solid ${theme.normal.border}`,
  "& a": {
    "&:hover": {
      "& svg path": {
        fill: theme.normal.text0,
      },
    },
    "& svg": {
      width: 32,
      height: 32,
      "& path": {
        fill: theme.normal.text2,
      },
    },
  },
}));
export const FootAList = FootArray.map((item, index) => {
  const Icon = item.icon;
  return (
    <a key={`FootLink + ${index}`} href={`${item.link}`} target={"blank"}>
      <Icon />
    </a>
  );
});
const NESTFoot: FC = () => {
  const { isBigMobile } = useWindowWidth();
  const { chainsData } = useNEST();
  const foot = () => {
    return isBigMobile ? (
      <></>
    ) : (
      <NESTFootStack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={"24px"}
      >
        {chainsData.chainId === 97 ? FootAList : FootAList.slice(0, 5)}
      </NESTFootStack>
    );
  };
  return foot();
};

export default NESTFoot;
