import { Connector, useConnect } from "wagmi";
import { flatten } from "./flatten";
import { indexBy } from "./indexBy";
import {
  useInitialChainId,
  useRainbowKitChains,
} from "./RainbowKitChainContext";
import { addRecentWalletId, getRecentWalletIds } from "./recentWalletIds";
import { Wallet } from "@rainbow-me/rainbowkit";
import useNEST from "../../hooks/useNEST";

export type WalletInstance = Omit<Wallet, "createConnector" | "hidden"> &
  ReturnType<Wallet["createConnector"]> & {
    index: number;
    groupIndex: number;
    groupName: string;
    walletConnectModalConnector?: Connector;
  };

export interface WalletConnector extends WalletInstance {
  ready?: boolean;
  connect?: ReturnType<typeof useConnect>["connectAsync"];
  onConnecting?: (fn: () => void) => void;
  showWalletConnectModal?: () => void;
  recent: boolean;
  mobileDownloadUrl?: string;
  extensionDownloadUrl?: string;
}

export function useWalletConnectors(): WalletConnector[] {
  const rainbowKitChains = useRainbowKitChains();
  const intialChainId = useInitialChainId();
  const {connectData} = useNEST()
  const connectAsync =  connectData.connectAsync
  const defaultConnectors_untyped = connectData.connectors
  // const { connectAsync, connectors: defaultConnectors_untyped } = useConnect();
  const defaultConnectors = defaultConnectors_untyped as Connector[];

  async function connectWallet(walletId: string, connector: Connector) {
    const walletChainId = await connector.getChainId();
    const result = await connectAsync({
      chainId:
        // The goal here is to ensure users are always on a supported chain when connecting.
        // If an `initialChain` prop was provided to RainbowKitProvider, use that.
        intialChainId ??
        // Otherwise, if the wallet is already on a supported chain, use that to avoid a chain switch prompt.
        rainbowKitChains.find(({ id }) => id === walletChainId)?.id ??
        // Finally, fall back to the first chain provided to RainbowKitProvider.
        rainbowKitChains[0]?.id,
      connector,
    });

    if (result) {
      addRecentWalletId(walletId);
    }

    return result;
  }

  const walletInstances = flatten(
    defaultConnectors.map((connector: any) => {
      return (connector._wallets as WalletInstance[]) ?? [];
    })
  ).sort((a, b) => a.index - b.index);

  const walletInstanceById = indexBy(
    walletInstances,
    (walletInstance) => walletInstance.id
  );

  const recentWallets: WalletInstance[] = getRecentWalletIds()
    .map((walletId) => walletInstanceById[walletId])

  const groupedWallets: WalletInstance[] = [
    ...recentWallets,
    ...walletInstances.filter(
      (walletInstance) => !recentWallets.includes(walletInstance)
    ),
  ];

  const walletConnectors: WalletConnector[] = [];

  groupedWallets.forEach((wallet: WalletInstance) => {
    if (!wallet) {
      return;
    }

    const recent = recentWallets.includes(wallet);

    walletConnectors.push({
      ...wallet,
      connect: () => connectWallet(wallet.id, wallet.connector),
      groupName: wallet.groupName,
      onConnecting: (fn: () => void) =>
        wallet.connector.on("message", ({ type }: { type: string }) =>
          type === "connecting" ? fn() : undefined
        ),
      ready: (wallet.installed ?? true) && wallet.connector.ready,
      recent,
      showWalletConnectModal: wallet.walletConnectModalConnector
        ? async () => {
            try {
              await connectWallet(
                wallet.id,
                wallet.walletConnectModalConnector!
              );
            } catch (err) {
              // @ts-expect-error
              const isUserRejection = err.name === "UserRejectedRequestError";

              if (!isUserRejection) {
                throw err;
              }
            }
          }
        : undefined,
    });
  });
  return walletConnectors;
}
