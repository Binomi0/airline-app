import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Router } from 'next/router'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { CacheProvider, EmotionCache } from '@emotion/react'
// import { SpeedInsights } from '@vercel/speed-insights/next'
import { RecoilRoot } from 'recoil'
import { getCookie } from 'cookies-next'
import AppBar from 'components/AppBar'
import Sidebar from 'components/Sidebar'
import ErrorBoundary from 'components/ErrorBoundary'
import CustomWeb3Provider from 'components/CustomWeb3Provider'
import RightSidebar from 'components/Sidebar/Right'
import ThemeWrapper from 'components/ThemeWrapper'
import NFTProvider from 'components/NFTProvider'
import { MainProvider } from 'context/MainProvider'
import { AuthProvider } from 'context/AuthProvider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { authStore } from 'store/auth.atom'
import { themeStore } from 'store/theme.atom'
import 'lib/alchemy'
import createEmotionCache from '../src/createEmotionCache'
import '../styles/globals.css'
import { ContractProvider } from 'context/ContractProvider'
import WithLoading from 'components/WithLoading'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache } = props
  const [loading, setLoading] = useState(false)

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const finishLoading = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', startLoading)
    Router.events.on('routeChangeComplete', finishLoading)

    return () => {
      Router.events.off('routeChangeStart', startLoading)
      Router.events.off('routeChangeComplete', finishLoading)
    }
  }, [startLoading, finishLoading])

  return (
    <CacheProvider value={emotionCache}>
      <RecoilRoot
        initializeState={({ set }) => {
          set(authStore, getCookie('isLoggedIn') as string)
          set(themeStore, 'dark')
        }}
      >
        <AuthProvider>
          <CustomWeb3Provider>
            <ContractProvider>
              <Head>
                <meta name='viewport' content='initial-scale=1, width=device-width' />
                <title>Weifly a decentralized virtual airline based on Ethereum</title>
              </Head>
              <ThemeWrapper>
                <ErrorBoundary>
                  <NFTProvider>
                    <TokenProvider>
                      <VaProvider>
                        <LiveFlightsProvider>
                          <MainProvider>
                            <AppBar />
                            <Sidebar />
                            <RightSidebar />
                          </MainProvider>
                          <WithLoading loading={loading}>
                            <Component {...props.pageProps} />
                          </WithLoading>
                          {/* <SpeedInsights /> */}
                        </LiveFlightsProvider>
                      </VaProvider>
                    </TokenProvider>
                  </NFTProvider>
                </ErrorBoundary>
              </ThemeWrapper>
            </ContractProvider>
          </CustomWeb3Provider>
        </AuthProvider>
      </RecoilRoot>
    </CacheProvider>
  )
}
