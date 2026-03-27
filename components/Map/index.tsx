'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { useVaProvider } from 'context/VaProvider'
import { Atc } from 'types'
import { getCoords, calculateDistance } from './utils'
import RadarInfoPanel from './RadarInfoPanel'
import StatusOverlay from './StatusOverlay'
import { RadarMapProps } from './RadarMap'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const RadarMap = dynamic<RadarMapProps>(() => import('./RadarMap'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
      }}
    >
      <CircularProgress size={24} sx={{ mb: 2, color: 'info.main' }} />
      <Typography variant='body2' sx={{ color: 'text.secondary', letterSpacing: 1 }}>
        STARTING RADAR ENGINE...
      </Typography>
    </Box>
  )
})

const TowerControlMap = () => {
  const { atcs = [], initIvaoData, isLoading } = useVaProvider()
  const muiTheme = useTheme()
  const [origin, setOrigin] = useState<Atc | null>(null)
  const [destination, setDestination] = useState<Atc | null>(null)

  useEffect(() => {
    if (initIvaoData) initIvaoData()
  }, [initIvaoData])

  const handleTowerClick = (tower: Atc) => {
    if (!origin || (origin && destination)) {
      setOrigin(tower)
      setDestination(null)
    } else {
      if (tower.callsign === origin.callsign) return
      setDestination(tower)
    }
  }

  const handleReset = () => {
    setOrigin(null)
    setDestination(null)
  }

  const distance = useMemo(() => {
    if (!origin || !destination) return null
    const c1 = getCoords(origin)
    const c2 = getCoords(destination)
    if (!c1 || !c2) return null
    return calculateDistance(c1, c2)
  }, [origin, destination])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <RadarInfoPanel
        origin={origin}
        destination={destination}
        distance={distance}
        isLoading={isLoading}
        onReset={handleReset}
      />

      <RadarMap towers={atcs} origin={origin} destination={destination} onTowerClick={handleTowerClick} />

      {!origin && <StatusOverlay />}

      <style>{`
        @keyframes radar-blink {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        @keyframes flight-path-flow {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        .flight-path {
          animation: flight-path-flow 1.5s linear infinite;
          filter: drop-shadow(0 0 3px ${muiTheme.palette.mode === 'dark' ? alpha(muiTheme.palette.sky.light, 0.6) : alpha(muiTheme.palette.info.main, 0.6)});
        }
        .leaflet-container {
          background: ${muiTheme.palette.background.default} !important;
        }
        .leaflet-tile {
          filter: ${
            muiTheme.palette.mode === 'dark'
              ? 'brightness(1.1) contrast(1.1) saturate(0.5) hue-rotate(180deg)'
              : 'brightness(1) contrast(1.1) saturate(0.3) hue-rotate(0deg)'
          } !important;
        }
        .radar-popup .leaflet-popup-content-wrapper {
          background: ${muiTheme.palette.background.paper} !important;
          color: ${muiTheme.palette.text.primary} !important;
          border: 1px solid ${muiTheme.palette.mode === 'dark' ? alpha(muiTheme.palette.sky.light, 0.4) : alpha(muiTheme.palette.info.main, 0.2)};
          border-radius: 8px;
        }
        .radar-popup .leaflet-popup-tip {
          background: ${muiTheme.palette.background.paper} !important;
          border: 1px solid ${muiTheme.palette.mode === 'dark' ? alpha(muiTheme.palette.sky.light, 0.4) : alpha(muiTheme.palette.info.main, 0.2)};
        }
      `}</style>
    </Box>
  )
}

export default TowerControlMap
