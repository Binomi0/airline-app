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
import NFTProvider from 'components/NFTProvider'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache } = props
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const start = () => setLoading(true)
    const stop = () => setLoading(false)

    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', stop)

    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', stop)
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <title>Weifly a decentralized virtual airline based on Ethereum</title>
      </Head>
      <RecoilRoot
        initializeState={({ set }) => {
          set(authStore, getCookie('token') as string)
          set(themeStore, 'dark')
        }}
      >
        <AuthProvider>
          <CustomWeb3Provider>
            <ThemeWrapper>
              <ErrorBoundary>
                <NFTProvider>
                  <TokenProvider>
                    <VaProvider>
                      <LiveFlightsProvider>
                        <MainProvider>
                          <AppBar loading={loading} />
                          <Sidebar />
                          <RightSidebar />
                        </MainProvider>
                        <Component loading={loading} />
                        <SpeedInsights />
                      </LiveFlightsProvider>
                    </VaProvider>
                  </TokenProvider>
                </NFTProvider>
              </ErrorBoundary>
            </ThemeWrapper>
          </CustomWeb3Provider>
        </AuthProvider>
      </RecoilRoot>
    </CacheProvider>
  )
}
