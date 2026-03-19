'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useVaProvider } from 'context/VaProvider'
import { Box, Card, CardContent, Typography, Stack, Divider, Button, alpha, CircularProgress } from '@mui/material'
import { FlightTakeoff, FlightLand, RestartAlt, Radar } from '@mui/icons-material'
import { Atc } from 'types'
import L from 'leaflet'
import * as RL from 'react-leaflet'

type LeafletState = typeof RL & { L: typeof L }

const MapaTorresControl = () => {
  const { atcs = [], initIvaoData, isLoading } = useVaProvider()
  const [origin, setOrigin] = useState<Atc | null>(null)
  const [destination, setDestination] = useState<Atc | null>(null)
  const [Leaflet, setLeaflet] = useState<LeafletState | null>(null)

  const towersToShow = useMemo(() => (atcs.length > 0 ? atcs : []), [atcs])

  useEffect(() => {
    setLeaflet({ L, ...RL })
    if (initIvaoData) initIvaoData()
  }, [initIvaoData, setLeaflet])

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

  const getCoords = (tower: Atc): [number, number] | null => {
    let lat = tower?.atcPosition?.airport?.latitude || tower?.atcPosition?.latitude
    let lon = tower?.atcPosition?.airport?.longitude || tower?.atcPosition?.longitude
    if (lat === undefined || lon === undefined) {
      lat = tower?.lastTrack?.latitude
      lon = tower?.lastTrack?.longitude
    }
    if (lat === undefined || lon === undefined) {
      lat = tower?.latitude
      lon = tower?.longitude
    }
    if (lat === undefined || lon === undefined || lat === null || lon === null) return null
    return [Number(lat), Number(lon)]
  }

  const distance = useMemo(() => {
    if (!origin || !destination) return null
    const c1 = getCoords(origin)
    const c2 = getCoords(destination)
    if (!c1 || !c2) return null
    const toRad = (x: number) => (x * Math.PI) / 180
    const R = 3440.065
    const dLat = toRad(c2[0] - c1[0])
    const dLon = toRad(c2[1] - c1[1])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(c1[0])) * Math.cos(toRad(c2[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
  }, [origin, destination])

  const polylinePath = useMemo(() => {
    if (!origin || !destination) return null
    const c1 = getCoords(origin)
    const c2 = getCoords(destination)
    if (!c1 || !c2) return null
    return [c1, c2]
  }, [origin, destination])

  if (!Leaflet) {
    return (
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
        <CircularProgress size={24} sx={{ mb: 2, color: '#38bdf8' }} />
        <Typography variant='body2' sx={{ color: '#94a3b8', letterSpacing: 1 }}>
          INITIALIZING RADAR SYSTEM...
        </Typography>
      </Box>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } = Leaflet

  // Custom Aviation / Radar Icon Creator
  const getRadarIcon = (color: string, isSelected: boolean) => {
    const mainColor = color === 'green' ? '#10b981' : color === 'red' ? '#ef4444' : '#38bdf8'
    const size = isSelected ? 36 : 24

    return L.divIcon({
      className: 'custom-radar-icon',
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
          ${isSelected ? `<div style="position: absolute; width: 100%; height: 100%; border: 2px solid ${mainColor}; border-radius: 50%; animation: radar-pulse 2s infinite ease-out; opacity: 0.5;"></div>` : ''}
          <svg width="${size * 0.8}" height="${size * 0.8}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="${mainColor}" stroke-width="2" fill="${isSelected ? alpha(mainColor, 0.2) : 'none'}" />
            <circle cx="12" cy="12" r="2" fill="${mainColor}" />
            <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="${mainColor}" stroke-width="2" />
          </svg>
        </div>
        <style>
          @keyframes radar-pulse {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        </style>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    })
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        bgcolor: '#030712'
      }}
    >
      {/* --- RADAR INFO PANEL (DARK THEME) --- */}
      <Card
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 1000,
          width: 320,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: 3,
          border: '1px solid rgba(56, 189, 248, 0.2)',
          color: '#f8fafc'
        }}
      >
        <CardContent sx={{ p: '24px !important' }}>
          <Stack spacing={3}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography
                variant='subtitle2'
                sx={{
                  fontWeight: 800,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase'
                }}
              >
                <Radar sx={{ fontSize: 20 }} />
                Electronic Chart
              </Typography>
              {isLoading && <CircularProgress size={12} sx={{ color: '#38bdf8' }} />}
            </Box>

            <Divider sx={{ borderColor: 'rgba(56, 189, 248, 0.1)' }} />

            <Stack spacing={2}>
              {/* DEPARTURE */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: origin ? alpha('#10b981', 0.1) : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${origin ? alpha('#10b981', 0.4) : 'rgba(56, 189, 248, 0.1)'}`
                }}
              >
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <FlightTakeoff sx={{ color: origin ? '#10b981' : '#475569', fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: 9,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#94a3b8',
                        letterSpacing: 1
                      }}
                    >
                      Departure
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 700, color: origin ? '#10b981' : '#64748b', fontFamily: 'monospace' }}
                    >
                      {origin ? origin.callsign : '---'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* ARRIVAL */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: destination ? alpha('#ef4444', 0.1) : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${destination ? alpha('#ef4444', 0.4) : 'rgba(56, 189, 248, 0.1)'}`
                }}
              >
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <FlightLand sx={{ color: destination ? '#ef4444' : '#475569', fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: 9,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#94a3b8',
                        letterSpacing: 1
                      }}
                    >
                      Arrival
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 700, color: destination ? '#ef4444' : '#64748b', fontFamily: 'monospace' }}
                    >
                      {destination ? destination.callsign : '---'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            {origin && destination && (
              <Box
                sx={{
                  bgcolor: alpha('#38bdf8', 0.1),
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  border: '1px solid #38bdf8'
                }}
              >
                <Typography variant='h5' sx={{ color: '#e2e8f0', fontWeight: 900, fontFamily: 'monospace' }}>
                  {distance} <span style={{ fontSize: 12, color: '#38bdf8' }}>NM</span>
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  Est. Distance
                </Typography>
              </Box>
            )}

            <Button
              variant='outlined'
              fullWidth
              disabled={!origin && !destination}
              onClick={handleReset}
              startIcon={<RestartAlt />}
              sx={{
                borderRadius: 2,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 900,
                fontSize: 11,
                letterSpacing: 1,
                borderColor: 'rgba(56, 189, 248, 0.3)',
                color: '#94a3b8',
                '&:hover': { borderColor: '#38bdf8', color: '#f8fafc', bgcolor: alpha('#38bdf8', 0.05) }
              }}
            >
              System Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* --- THE RADAR MAP --- */}
      <Box sx={{ height: 650, width: '100%', zIndex: 1 }}>
        <MapContainer
          center={[20, 0]}
          zoom={2.5}
          style={{ height: '100%', width: '100%', background: '#020617' }}
          zoomControl={false}
          maxBounds={[
            [-85, -180],
            [85, 180]
          ]}
          maxBoundsViscosity={1.0}
        >
          {/* AVIATION STYLE TILE LAYER */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          />

          {/* RADAR OVERLAY FILTER (Applied via CSS in Box wrapping MapContainer) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 400,
              background: 'radial-gradient(circle, transparent 20%, rgba(2, 6, 23, 0.2) 100%)',
              boxShadow: 'inset 0 0 100px rgba(56, 189, 248, 0.1)'
            }}
          />

          {/* Render ATCs as Radar Targets */}
          {towersToShow.map((tower, idx) => {
            const pos = getCoords(tower)
            if (!pos) return null

            const isOrigin = !!(origin && origin.id === tower.id)
            const isDest = !!(destination && destination.id === tower.id)
            const iconColor = isOrigin ? 'green' : isDest ? 'red' : 'blue'

            return (
              <Marker
                key={`${tower.id}-${idx}`}
                position={pos}
                icon={getRadarIcon(iconColor, !!isOrigin || !!isDest)}
                eventHandlers={{ click: () => handleTowerClick(tower) }}
              >
                <Tooltip direction='top' offset={[0, -10]} opacity={0.9} permanent={isOrigin || isDest}>
                  <Box
                    sx={{
                      p: 0.5,
                      bgcolor: '#0f172a',
                      border: `1px solid ${isOrigin ? '#10b981' : isDest ? '#ef4444' : '#38bdf8'}`,
                      borderRadius: 1
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{ fontWeight: 900, display: 'block', color: '#fff', fontFamily: 'monospace' }}
                    >
                      {tower.callsign}
                    </Typography>
                  </Box>
                </Tooltip>

                <Popup className='radar-popup'>
                  <Box sx={{ bgcolor: '#0f172a', p: 1, color: '#f8fafc', minWidth: 150 }}>
                    <Typography variant='body2' sx={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {tower.callsign}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{
                        color: '#94a3b8',
                        display: 'block',
                        mb: 1,
                        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
                        pb: 0.5
                      }}
                    >
                      {tower?.atcPosition?.airport?.name || 'STATION UNKNOWN'}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{ color: '#64748b', fontSize: 8, textTransform: 'uppercase' }}
                        >
                          Lat
                        </Typography>
                        <Typography variant='caption' sx={{ display: 'block', fontSize: 10, fontFamily: 'monospace' }}>
                          {pos[0].toFixed(4)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{ color: '#64748b', fontSize: 8, textTransform: 'uppercase' }}
                        >
                          Lon
                        </Typography>
                        <Typography variant='caption' sx={{ display: 'block', fontSize: 10, fontFamily: 'monospace' }}>
                          {pos[1].toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant='contained'
                      size='small'
                      fullWidth
                      onClick={() => handleTowerClick(tower)}
                      sx={{ fontSize: 9, py: 0.5, bgcolor: '#38bdf8', '&:hover': { bgcolor: '#0ea5e9' } }}
                    >
                      Lock Target
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            )
          })}

          {/* VECTOR ROUTE (Neon Glow Line) */}
          {polylinePath && (
            <Polyline
              positions={polylinePath}
              pathOptions={{
                color: '#38bdf8',
                weight: 2,
                opacity: 0.9,
                dashArray: '10, 15',
                lineJoin: 'round'
              }}
            />
          )}
        </MapContainer>
      </Box>

      {/* SYSTEM STATUS OVERLAY */}
      {!origin && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            zIndex: 1000,
            bgcolor: alpha('#0f172a', 0.8),
            color: '#38bdf8',
            px: 2,
            py: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontFamily: 'monospace'
          }}
        >
          <Box
            sx={{ width: 8, height: 8, bgcolor: '#38bdf8', borderRadius: '50%', animation: 'radar-blink 1s infinite' }}
          />
          <Typography variant='caption' fontWeight={700} sx={{ letterSpacing: 1 }}>
            WAITING FOR TARGET INPUT...
          </Typography>
        </Box>
      )}

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

export default MapaTorresControl
