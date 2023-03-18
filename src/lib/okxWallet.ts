import {
    Chain,
    Wallet,
    getWalletConnectConnector,
  } from '@rainbow-me/rainbowkit';

  export interface MyWalletOptions {
    chains: Chain[];
  }

  export const okxWallet = ({ chains }: MyWalletOptions): Wallet => ({
    id: 'okx-wallet',
    name: 'OKX Wallet',
    iconUrl: '/images/OKX.svg', // https://www.okx.com/web3-docs/zh/extension/wallet-resource.html
    iconBackground: '#fff',
    downloadUrls: {
      android: 'https://static.lxnukuz.cn/upgradeapp/okx-android.apk',
      ios: 'https://apps.apple.com/us/app/okx-buy-bitcoin-eth-crypto/id1327268470',
      qrCode: 'https://www.okx.com/',
      browserExtension: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge'
    },
    createConnector: () => {
      const connector = getWalletConnectConnector({ chains });

      return {
        connector,
        mobile: {
          getUri: async () => {
            const { uri } = (await connector.getProvider()).connector;
            return uri;
          },
        },
        qrCode: {
          getUri: async () => {
            const { uri } = (await connector.getProvider()).connector;
            return uri;
          }
        },
      };
    },
  });