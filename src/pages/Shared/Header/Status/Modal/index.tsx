import { t, Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC, MouseEventHandler, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import {
  Coin98Icon,
  CoinbaseIcon,
  MetamaskIcon,
  TokenPocketIcon,
  WalletConnectIcon,
} from "../../../../../components/Icon";
import MainCard from "../../../../../components/MainCard";
import { Connector, SupportedConnectors } from "../../../../../libs/connectors";
import { SupportedChains } from "../../../../../libs/constants/chain";
import changeNetwork from "../../../../../libs/hooks/changeNetwork";
import useThemes, { ThemeType } from "../../../../../libs/hooks/useThemes";
import useWeb3 from "../../../../../libs/hooks/useWeb3";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const Modal: FC<Props> = ({ ...props }) => {
  const { activate } = useWeb3();
  const classPrefix = "modal-status";
  const { theme } = useThemes();
  const [isMore, setIsMore] = useState<boolean>(false);

  const activateClick = (connector: Connector) => {
    activate(connector.connector, undefined, true).catch(() => {
      changeNetwork(SupportedChains[0].chainId);
      // message.error(
      //   <span>
      //     This network is not supported, please{" "}
      //     <button onClick={() => changeNetwork(SupportedChains[0].chainId)}>
      //       switch the BNB network
      //     </button>
      //   </span>
      // );
    });
  };
  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
      titleName={t`Connect Wallet`}
    >
      <p className={`${classPrefix}-notice`}>
        <Trans>Please select the method of connecting to the wallet</Trans>
      </p>
      <div className={`${classPrefix}-showView`}>
        <div className={`${classPrefix}-walletSelect`}>
          <MainCard onClick={() => activateClick(SupportedConnectors[0])}>
            <MetamaskIcon />
            <p>MetaMask</p>
          </MainCard>
          <MainCard onClick={() => activateClick(SupportedConnectors[1])}>
            <WalletConnectIcon />
            <p>WalletConnect</p>
          </MainCard>
        </div>
        {isMore ? (
          <div className={`${classPrefix}-moreView`}>
            <div className={`${classPrefix}-walletSelect2`}>
              <MainCard onClick={() => activateClick(SupportedConnectors[3])}>
                <img src="OKXWallet.png" alt="NEST IMG" />
                <p>OKX Wallet</p>
              </MainCard>
              <MainCard onClick={() => activateClick(SupportedConnectors[0])}>
                <TokenPocketIcon />
                <p>Token Pocket</p>
              </MainCard>
            </div>
            <div className={`${classPrefix}-walletSelect3`}>
              <MainCard onClick={() => activateClick(SupportedConnectors[0])}>
                <Coin98Icon />
                <p>Coin98</p>
              </MainCard>
              <MainCard onClick={() => activateClick(SupportedConnectors[2])}>
                <CoinbaseIcon />
                <p>Coinbase Wallet</p>
              </MainCard>
            </div>
          </div>
        ) : (
          <button
            className={`${classPrefix}-more`}
            onClick={() => setIsMore(true)}
          >
            More
          </button>
        )}
      </div>
    </BaseModal>
  );
};

export default Modal;
