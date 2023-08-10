import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { FC, useEffect } from "react";
import useNEST, { NESTProvider } from "../hooks/useNEST";
import useTheme, { SetThemeProvider } from "../hooks/useTheme";
import { PendingTransactionsProvider } from "../hooks/useTransactionReceipt";
import ConnectWalletModal from "../pages/Share/Modal/ConnectWalletModal";
import WalletProvider from "./client";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { defaultLocale, dynamicActivate } from "../locales/i18n";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export interface ProviderProps {
  children?: React.ReactNode;
}

const MainProvider: FC<ProviderProps> = ({ children }) => {
  return (
    <LanguageProvider>
      <SetThemeProvider>
        <NESTThemeProvider>
          <WalletProvider>
            <NESTProvider>
              <SnackbarProvider maxSnack={10}>
                <PendingTransactionsProvider>
                  <ConnectWallet />
                  {children}
                </PendingTransactionsProvider>
              </SnackbarProvider>
            </NESTProvider>
          </WalletProvider>
        </NESTThemeProvider>
      </SetThemeProvider>
    </LanguageProvider>
  );
};

const ConnectWallet: FC = () => {
  const { showConnect, setShowConnect } = useNEST();
  const { openConnectModal } = useConnectModal();
  useEffect(() => {
    if (showConnect) {
      openConnectModal?.();
    }
  }, [openConnectModal, showConnect]);
  return (
    <></>
    // <ConnectWalletModal
    //   open={showConnect}
    //   onClose={() => setShowConnect(false)}
    // />
  );
};

const NESTThemeProvider: FC<ProviderProps> = ({ children }) => {
  const { nowTheme } = useTheme();
  return <ThemeProvider theme={nowTheme}>{children}</ThemeProvider>;
};

const LanguageProvider: FC<ProviderProps> = ({ children }) => {
  useEffect(() => {
    var cache = localStorage.getItem("Language");
    if (cache) {
      dynamicActivate(cache);
      return;
    }
    dynamicActivate(defaultLocale);
  }, []);
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export default MainProvider;
