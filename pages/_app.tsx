import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Router, useRouter } from 'next/router'
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  safeWallet,
  smartWallet,
  walletConnect
} from '@thirdweb-dev/react'
import {
  // Sepolia,
  Goerli
} from '@thirdweb-dev/chains'
import AppBar from 'components/AppBar'
import Sidebar from 'components/Sidebar'
import ErrorBoundary from 'components/ErrorBoundary'
import { factoryAddress } from 'contracts/address'
import { MainProvider } from 'context/MainProvider'
import createEmotionCache from '../src/createEmotionCache'
import theme from '../src/theme'
import '../styles/globals.css'
import ReactGA from 'react-ga'
import Script from 'next/script'

ReactGA.initialize('G-GP0EC7LJ5N', {
  debug: process.env['NODE_ENV'] === 'development',
  testMode: process.env['NODE_ENV'] === 'development',
  gaOptions: {
    name: 'tracker1'
  }
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache } = props
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  console.log('Environment => ')
  React.useEffect(() => {
    ReactGA.pageview(router.pathname, ['tracker1'])

    const toggleLoading = (status: boolean) => () => setLoading(status)

    Router.events.on('routeChangeStart', toggleLoading(true))
    Router.events.on('routeChangeComplete', toggleLoading(false))

    return () => {
      Router.events.off('routeChangeStart', toggleLoading(true))
      Router.events.off('routeChangeComplete', toggleLoading(false))
    }
  }, [router])

  return (
    <>
      <ThirdwebProvider
        activeChain={Goerli}
        supportedChains={[Goerli]}
        authConfig={{
          domain: process.env['NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN'] || '',
          authUrl: '/api/auth'
        }}
        supportedWallets={[
          smartWallet({
            factoryAddress,
            thirdwebApiKey: process.env['NEXT_PUBLIC_API_KEY'] || '',
            gasless: true,
            personalWallets: [
              metamaskWallet(),
              // coinbaseWallet(),
              localWallet({ persist: true })
            ]
          }),
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect(),
          safeWallet(),
          localWallet({ persist: true })
        ]}
      >
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
              <MainProvider>
                <AppBar />
                <Sidebar />
              </MainProvider>
              <Component loading={loading} />
            </ErrorBoundary>
          </ThemeProvider>
        </CacheProvider>
      </ThirdwebProvider>
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-GP0EC7LJ5N');
            `}
      </Script>
    </>
  )
}
