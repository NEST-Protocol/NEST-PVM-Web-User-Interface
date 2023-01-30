import { FC, MouseEventHandler } from "react";
import BaseModal from "../../../../../components/BaseModal";
import {
  LittleBSC,
  LittleETH,
  NetworkNow,
  TokenNest,
} from "../../../../../components/Icon";
import { useGetToken } from "../../../../../contracts/hooks/useGetToken";
import { SupportedChains } from "../../../../../libs/constants/chain";
import changeNetwork from "../../../../../libs/hooks/changeNetwork";
import useWeb3 from "../../../../../libs/hooks/useWeb3";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const SelectNetworkModal: FC<Props> = ({ ...props }) => {
  const classPrefix = "selectNetworkMobile";
  const { chainId } = useWeb3();
  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classPrefix}
      titleName={`Select a network`}
    >
      <ul>
        <li onClick={() => changeNetwork(SupportedChains[1].chainId)}>
          <LittleETH />
          <p>{SupportedChains[1].name}</p>
          {SupportedChains[1].chainId === chainId ? <NetworkNow /> : <></>}
        </li>
        <li onClick={() => changeNetwork(SupportedChains[0].chainId)}>
          <LittleBSC />
          <p>{SupportedChains[0].name}</p>
          {SupportedChains[0].chainId === chainId ? <NetworkNow /> : <></>}
        </li>
        {/* <li>
          <PolygonIcon />
          <p>Polygon</p>
        </li>
        <li>
          <LittleKCC />
          <p>KCC</p>
        </li> */}
      </ul>
    </BaseModal>
  );
};

export const SelectTestTokenModal: FC<Props> = ({ ...props }) => {
  const classPrefix = "selectNetworkMobile";
  const addNEST = useGetToken("NEST");
  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classPrefix}
      titleName={`Select a test token`}
    >
      <ul>
        <li onClick={() => addNEST()}>
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
    </BaseModal>
  );
};

export default SelectNetworkModal;
