import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import Head from 'next/head'

import TowerControlMap from 'components/Map'

const MapPreviewPage = () => {
  return (
    <Box sx={{ bgcolor: '#030712', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Head>
        <title>Mapa de Torres de Control | Airport Airline</title>
      </Head>

      <TowerControlMap />
    </Box>
  )
}

export default MapPreviewPage
