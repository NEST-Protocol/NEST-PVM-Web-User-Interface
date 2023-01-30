import { FC, useCallback } from "react";
import {
  LittleBSC,
  LittleETH,
  NetworkNow,
} from "../../../../../components/Icon";
import MainCard from "../../../../../components/MainCard";
import { SupportedChains } from "../../../../../libs/constants/chain";
import changeNetwork from "../../../../../libs/hooks/changeNetwork";
import useWeb3 from "../../../../../libs/hooks/useWeb3";
import "./styles";

const SelectNetwork: FC = () => {
  const classPrefix = "selectNetwork";
  const { chainId } = useWeb3();
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
          <p>{chainId === 1 ? "Ethereum" : "Goerli"}</p>
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

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-chainName`}>{nowNetwork()}</div>
      <div className={`${classPrefix}-hover`}>
        <MainCard classNames={`${classPrefix}-ul`}>
          <p>Select a network</p>
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
            
          </ul>
        </MainCard>
      </div>
    </div>
  );
};

export default SelectNetwork;
