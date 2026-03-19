import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import Head from 'next/head'

import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'

import TowerControlMap from 'components/Map'

const MapPreviewPage = () => {
  const theme = useRecoilValue(themeStore)
  return (
    <Box sx={{ bgcolor: theme === 'dark' ? '#030712' : '#f8fafc', height: 'calc(100vh - 64px)', width: '100%', overflow: 'hidden' }}>
      <Head>
        <title>Mapa de Torres de Control | Airport Airline</title>
      </Head>

      <TowerControlMap />
    </Box>
  )
}

export default MapPreviewPage
