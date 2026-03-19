'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useVaProvider } from 'context/VaProvider'
import { Atc } from 'types'
import { getCoords, calculateDistance } from './utils'
import RadarInfoPanel from './RadarInfoPanel'
import StatusOverlay from './StatusOverlay'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const RadarMap = dynamic(() => import('./RadarMap'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
      }}
    >
      <CircularProgress size={24} sx={{ mb: 2, color: '#38bdf8' }} />
      <Typography variant='body2' sx={{ color: '#94a3b8', letterSpacing: 1 }}>
        STARTING RADAR ENGINE...
      </Typography>
    </Box>
  )
})

const TowerControlMap = () => {
  const { atcs = [], initIvaoData, isLoading } = useVaProvider()
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
      if (tower.id === origin.id) return
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
        height: '100vh',
        overflow: 'hidden',
        bgcolor: '#030712'
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
        .leaflet-container {
          background: #020617 !important;
        }
        .leaflet-tile {
          filter: brightness(0.7) contrast(1.2) saturate(0.2) hue-rotate(180deg) !important;
        }
        .radar-popup .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 8px;
        }
        .radar-popup .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid rgba(56, 189, 248, 0.4);
        }
      `}</style>
    </Box>
  )
}

export default TowerControlMap
