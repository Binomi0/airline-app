import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Router } from 'next/router'
import AppBar from 'components/AppBar'
import Sidebar from 'components/Sidebar'
import ErrorBoundary from 'components/ErrorBoundary'
import { MainProvider } from 'context/MainProvider'
import { AuthProvider } from 'context/AuthProvider'
import CustomWeb3Provider from 'components/CustomWeb3Provider'
import RightSidebar from 'components/Sidebar/Right'
import { AircraftProvider } from 'context/AircraftProvider/AircraftProvider.provider'
import { LicenseProvider } from 'context/LicenseProvider/LicenseProvider.provider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RecoilRoot } from 'recoil'
import createEmotionCache from '../src/createEmotionCache'
import '../styles/globals.css'
import { authStore } from 'store/auth.atom'
import { getCookie } from 'cookies-next'
import 'lib/alchemy'
import { themeStore } from 'store/theme.atom'
import ThemeWrapper from 'components/ThemeWrapper'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache } = props
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true))
    Router.events.on('routeChangeComplete', () => setLoading(false))

    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true))
      Router.events.off('routeChangeComplete', () => setLoading(false))
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <RecoilRoot
        initializeState={({ set }) => {
          set(authStore, getCookie('token') as string)
          set(themeStore, 'dark')
        }}
      >
        <AuthProvider>
          <CustomWeb3Provider>
            <Head>
              <meta name='viewport' content='initial-scale=1, width=device-width' />
              <title>Weifly a decentralized virtual airline based on Ethereum</title>
            </Head>
            <ThemeWrapper>
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
            </ThemeWrapper>
          </CustomWeb3Provider>
        </AuthProvider>
      </RecoilRoot>
    </CacheProvider>
  )
}
