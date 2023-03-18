import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { FC } from "react";
import useNEST, { NESTProvider } from "../hooks/useNEST";
import useTheme, { SetThemeProvider } from "../hooks/useTheme";
import { PendingTransactionsProvider } from "../hooks/useTransactionReceipt";
import ConnectWalletModal from "../pages/Share/Modal/ConnectWalletModal";
import WalletProvider from "./client";

export interface ProviderProps {
  children?: React.ReactNode;
}

const MainProvider: FC<ProviderProps> = ({ children }) => {
  return (
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
  );
};

const ConnectWallet: FC = () => {
  const { showConnect, setShowConnect } = useNEST();
  return (
    <ConnectWalletModal
      open={showConnect}
      onClose={() => setShowConnect(false)}
    />
  );
};

const NESTThemeProvider: FC<ProviderProps> = ({ children }) => {
  const { nowTheme } = useTheme();
  return <ThemeProvider theme={nowTheme}>{children}</ThemeProvider>;
};

export default MainProvider;
