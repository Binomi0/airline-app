import React from 'react'
import { Box } from '@mui/material'
import Head from 'next/head'
import TowerControlMap from 'components/Map'

const MapPreviewPage = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Head>
        <title>Mapa de Torres de Control | Airport Airline</title>
      </Head>

      <TowerControlMap />
    </Box>
  )
}

export default MapPreviewPage
