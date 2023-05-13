import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Router } from "next/router";
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  safeWallet,
  smartWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { Sepolia, Goerli } from "@thirdweb-dev/chains";
import CustomAppBar from "components/AppBar";
import Sidebar from "components/Sidebar";
import { VaProvider } from "context/VaProvider";
import ErrorBoundary from "components/ErrorBoundary";
import { factoryAddress } from "contracts/address";
import createEmotionCache from "../src/createEmotionCache";
import theme from "../src/theme";
import "../styles/globals.css";
import { MainProvider } from "context/MainProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [loading, setLoading] = React.useState(false);

  const startLoading = React.useCallback(() => {
    setLoading(true);
  }, []);
  const endLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", endLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", endLoading);
    };
  }, [startLoading, endLoading]);

  return (
    <ThirdwebProvider
      activeChain={Goerli}
      supportedChains={[Goerli]}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        authUrl: "/api/auth",
      }}
      // TODO: Sepolia network not supported yet
      supportedWallets={[
        smartWallet({
          factoryAddress,
          thirdwebApiKey: process.env["NEXT_PUBLIC_API_KEY"] || "",
          gasless: true,
          personalWallets: [
            metamaskWallet(),
            // coinbaseWallet(),
            localWallet({ persist: true }),
          ],
        }),
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        safeWallet(),
        localWallet({ persist: true }),
      ]}
    >
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ErrorBoundary>
            <MainProvider>
              <CustomAppBar />
              <Sidebar />
              <VaProvider>
                <Component {...pageProps} loading={loading} />
              </VaProvider>
            </MainProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </CacheProvider>
    </ThirdwebProvider>
  );
}
