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
import { Box } from '@mui/material'
import RightSidebar from 'components/Sidebar/Right'
import ThemeWrapper from 'components/ThemeWrapper'
import NFTProvider from 'context/NFTProvider'
import { MainProvider } from 'context/MainProvider'
import { AuthProvider } from 'context/AuthProvider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { authStore } from 'store/auth.atom'
import { themeStore } from 'store/theme.atom'
import Footer from 'components/Footer'
import 'lib/alchemy'
import createEmotionCache from '../src/createEmotionCache'
import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
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
    window.scrollTo(0, 0)
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
          const isLoggedIn = getCookie('isLoggedIn') === 'true'
          set(authStore, isLoggedIn ? 'session_active' : undefined)
          set(themeStore, 'dark')
        }}
      >
        <AuthProvider>
          <CustomWeb3Provider>
            <ContractProvider>
              <Head>
                <meta name='viewport' content='initial-scale=1, width=device-width' />
                <title>WeiFly | Aerolínea Virtual Descentralizada | Arbitrum</title>
              </Head>
              <ThemeWrapper>
                <ErrorBoundary>
                  <NFTProvider>
                    <TokenProvider>
                      <VaProvider>
                        <LiveFlightsProvider>
                          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <MainProvider>
                              <AppBar />
                              <Sidebar />
                              <RightSidebar />
                            </MainProvider>
                            <WithLoading loading={loading}>
                              <Component {...props.pageProps} />
                            </WithLoading>
                            <Footer />
                          </Box>
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
