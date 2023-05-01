import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import ErrorBoundary from "../components/ErrorBoundary";
import { Router } from "next/router";
import { VaProvider } from "../context/VaProvider";
import { AppBar } from "@mui/material";
import CustomAppBar from "components/AppBar";
import Sidebar from "components/Sidebar";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

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
    <ThirdwebProvider activeChain={Sepolia}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <VaProvider>
            <ErrorBoundary>
              <CustomAppBar onOpen={setOpen} />
              <Sidebar open={open} onOpen={setOpen} />
              <Component {...pageProps} loading={loading} />
            </ErrorBoundary>
          </VaProvider>
        </ThemeProvider>
      </CacheProvider>
    </ThirdwebProvider>
  );
}
