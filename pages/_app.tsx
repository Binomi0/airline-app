import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Router } from 'next/router'
import AppBar from 'components/AppBar'
import Sidebar from 'components/Sidebar'
import ErrorBoundary from 'components/ErrorBoundary'
import { MainProvider } from 'context/MainProvider'
import createEmotionCache from '../src/createEmotionCache'
import theme from '../src/theme'
import '../styles/globals.css'
import { AlchemyProvider } from 'context/AlchemyProvider'
import { AuthProvider } from 'context/AuthProvider'
import CustomWeb3Provider from 'components/CustomWeb3Provider'
import RightSidebar from 'components/Sidebar/Right'
import { AircraftProvider } from 'context/AircraftProvider/AircraftProvider.provider'
import { LicenseProvider } from 'context/LicenseProvider/LicenseProvider.provider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache } = props
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const toggleLoading = (status: boolean) => () => setLoading(status)

    Router.events.on('routeChangeStart', toggleLoading(true))
    Router.events.on('routeChangeComplete', toggleLoading(false))

    return () => {
      Router.events.off('routeChangeStart', toggleLoading(true))
      Router.events.off('routeChangeComplete', toggleLoading(false))
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider user={props.pageProps.user}>
        <AlchemyProvider>
          <CustomWeb3Provider>
            <Head>
              <meta name='viewport' content='initial-scale=1, width=device-width' />
              <title>Weifly a decentralized virtual airline based on Ethereum</title>
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ErrorBoundary>
                <AircraftProvider>
                  <LicenseProvider>
                    <TokenProvider>
                      <VaProvider>
                        <LiveFlightsProvider>
                          <MainProvider>
                            <AppBar />
                            <Sidebar />
                            <RightSidebar />
                          </MainProvider>
                          <Component loading={loading} />
                          <SpeedInsights />
                        </LiveFlightsProvider>
                      </VaProvider>
                    </TokenProvider>
                  </LicenseProvider>
                </AircraftProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </CustomWeb3Provider>
        </AlchemyProvider>
      </AuthProvider>
    </CacheProvider>
  )
}
