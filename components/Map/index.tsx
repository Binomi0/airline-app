'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
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
  const theme = useRecoilValue(themeStore)
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
        bgcolor: '#030712'
      }}
    >
      <RadarInfoPanel
        origin={origin}
        destination={destination}
        distance={distance}
        isLoading={isLoading}
        onReset={handleReset}
        theme={theme}
      />

      <RadarMap 
        towers={atcs} 
        origin={origin} 
        destination={destination} 
        onTowerClick={handleTowerClick}
        theme={theme}
      />

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
          filter: drop-shadow(0 0 3px rgba(56, 189, 248, 0.6));
        }
        .leaflet-container {
          background: ${theme === 'dark' ? '#020617' : '#f1f5f9'} !important;
        }
        .leaflet-tile {
          filter: ${
            theme === 'dark'
              ? 'brightness(1.1) contrast(1.1) saturate(0.5) hue-rotate(180deg)'
              : 'brightness(1) contrast(1.1) saturate(0.3) hue-rotate(0deg)'
          } !important;
        }
        .radar-popup .leaflet-popup-content-wrapper {
          background: ${theme === 'dark' ? '#0f172a' : '#fff'} !important;
          color: ${theme === 'dark' ? '#f8fafc' : '#1e293b'} !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.2)'};
          border-radius: 8px;
        }
        .radar-popup .leaflet-popup-tip {
          background: ${theme === 'dark' ? '#0f172a' : '#fff'} !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.2)'};
        }
      `}</style>
    </Box>
  )
}

export default TowerControlMap
