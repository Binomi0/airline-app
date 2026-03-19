import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import Head from 'next/head'

const MapaTorresControl = dynamic(() => import('components/MapaTorresControl'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 600,
        width: '100%',
        bgcolor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
      }}
    >
      <Box sx={{ color: '#38bdf8', mb: 2 }}>Loading Radar...</Box>
    </Box>
  )
})

const MapPreviewPage = () => {
  return (
    <Box sx={{ bgcolor: '#030712', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Head>
        <title>Mapa de Torres de Control | Airport Airline</title>
      </Head>

      <MapaTorresControl />
    </Box>
  )
}

export default MapPreviewPage
