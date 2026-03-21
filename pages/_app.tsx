import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Router } from 'next/router'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { RecoilRoot } from 'recoil'
import { getCookie } from 'cookies-next'
import AppBar from 'components/AppBar'
import Sidebar from 'components/Sidebar'
import ErrorBoundary from 'components/ErrorBoundary'
import { Box } from '@mui/material'
import RightSidebar from 'components/Sidebar/Right'
import ThemeWrapper from 'components/ThemeWrapper'
import { AppProviders } from 'components/AppProviders'
import { authStore } from 'store/auth.atom'
import { themeStore } from 'store/theme.atom'
import Footer from 'components/Footer'
import 'lib/alchemy'
import createEmotionCache from '../src/createEmotionCache'
import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
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
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <title>WeiFly | Aerolínea Virtual Descentralizada | Arbitrum</title>
      </Head>
      <RecoilRoot
        initializeState={({ set }) => {
          const isLoggedIn = getCookie('isLoggedIn') === 'true'
          set(authStore, isLoggedIn ? 'session_active' : undefined)
          set(themeStore, 'dark')
        }}
      >
        <ThemeWrapper>
          <ErrorBoundary>
            <AppProviders>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar />
                <Sidebar />
                <RightSidebar />
                <WithLoading loading={loading}>
                  <Component {...props.pageProps} />
                </WithLoading>
                <Footer />
              </Box>
            </AppProviders>
          </ErrorBoundary>
        </ThemeWrapper>
      </RecoilRoot>
    </CacheProvider>
  )
}
