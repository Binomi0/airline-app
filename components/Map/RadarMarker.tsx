import React, { useState } from 'react'
import { Box, Typography, alpha, Stack, IconButton, CircularProgress } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import Swal from 'sweetalert2'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import { Atc } from 'types'
import { getRadarIcon } from './RadarIcon'

interface RadarMarkerProps {
  tower: Atc
  position: [number, number]
  isOrigin: boolean
  isDestination: boolean
  onTowerClick: (tower: Atc) => void
  theme: 'light' | 'dark'
}

const phoneticMap: Record<string, string> = {
  A: 'ALPHA',
  B: 'BRAVO',
  C: 'CHARLIE',
  D: 'DELTA',
  E: 'ECHO',
  F: 'FOXTROT',
  G: 'GOLF',
  H: 'HOTEL',
  I: 'INDIA',
  J: 'JULIETT',
  K: 'KILO',
  L: 'LIMA',
  M: 'MIKE',
  N: 'NOVEMBER',
  O: 'OSCAR',
  P: 'PAPA',
  Q: 'QUEBEC',
  R: 'ROMEO',
  S: 'SIERRA',
  T: 'TANGO',
  U: 'UNIFORM',
  V: 'VICTOR',
  W: 'WHISKEY',
  X: 'X-RAY',
  Y: 'YANKEE',
  Z: 'ZULU'
}

const RadarMarker: React.FC<RadarMarkerProps> = ({ tower, position, isOrigin, isDestination, onTowerClick, theme }) => {
  const [localAtis, setLocalAtis] = useState(tower.atis)
  const [fetching, setFetching] = useState(false)
  const iconColor = isOrigin ? 'green' : isDestination ? 'red' : 'blue'

  const handleFetchAtis = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fetching) return

    setFetching(true)
    try {
      const response = await fetch(`/api/ivao/atis/${tower.id}`)
      if (!response.ok) throw new Error('Failed to fetch ATIS')
      const data = await response.json()

      if (data && data.lines) {
        setLocalAtis(data)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No ATIS Found',
          text: 'This controller might not have an active ATIS broadcast at the moment.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Error fetching ATIS:', error)
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Could not retrieve ATIS from IVAO servers.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      })
    } finally {
      setFetching(false)
    }
  }

  const highlightAtis = (text: string) => {
    if (!text) return ''
    const keywords = ['RWY', 'QNH', 'CAVOK', 'INFO', 'NOSIG', 'ARR', 'DEP', 'TA', 'TL']
    let highlighted = text

    keywords.forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span style="color: #10b981; font-weight: 800;">${key}</span>`)
    })

    // Highlight revision letters
    const revisionMatch = text.match(/Information ([A-Z])/)
    if (revisionMatch) {
      const letter = revisionMatch[1]
      highlighted = highlighted.replace(
        `Information ${letter}`,
        `Information <span style="color: #38bdf8; font-weight: 900;">${phoneticMap[letter] || letter}</span>`
      )
    }

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
  }

  return (
    <Marker
      position={position}
      icon={getRadarIcon(iconColor, isOrigin || isDestination)}
      eventHandlers={{ click: () => onTowerClick(tower) }}
    >
      <Tooltip
        key={`${isOrigin || isDestination}`}
        direction='top'
        offset={[0, -10]}
        opacity={0.9}
        permanent={isOrigin || isDestination}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.2
          }}
        >
          <Typography
            variant='caption'
            sx={{
              fontWeight: 900,
              display: 'block',
              color: isOrigin ? '#10b981' : isDestination ? '#ef4444' : '#38bdf8',
              fontFamily: 'monospace',
              fontSize: 11,
              lineHeight: 1
            }}
          >
            {tower.atcPosition?.airport?.icao || tower.callsign.split('_')[0]}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              fontWeight: 600,
              display: 'block',
              color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: 8,
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1
            }}
          >
            {tower.atcPosition?.airport?.name || tower.atis?.lines?.[1] || 'Unknown'}
          </Typography>
        </Box>
      </Tooltip>

      <Popup className='radar-popup'>
        <Box
          sx={{
            bgcolor: theme === 'dark' ? '#0f172a' : '#fff',
            p: 1.5,
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            minWidth: 260,
            borderRadius: 2
          }}
        >
          {/* Header Callsign & Frequency */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant='h6'
              sx={{ fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', letterSpacing: 1, lineHeight: 1 }}
            >
              {tower.callsign}
            </Typography>
            {tower.atcSession?.frequency && (
              <Box
                sx={{
                  bgcolor: alpha('#38bdf8', 0.1),
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <Typography
                  variant='caption'
                  sx={{ color: '#38bdf8', fontWeight: 800, fontSize: 11, fontFamily: 'monospace' }}
                >
                  {tower.atcSession.frequency.toFixed(3)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Station Name & Connection Time */}
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography
              variant='body2'
              sx={{
                color: theme === 'dark' ? '#f1f5f9' : '#334155',
                fontWeight: 700,
                fontSize: 13,
                lineHeight: 1.2
              }}
            >
              {tower.atis?.lines?.[1] || tower?.atcPosition?.airport?.name || 'STATION UNKNOWN'}
            </Typography>

            {tower.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: '#10b981',
                      borderRadius: '50%',
                      animation: 'atc-blink 1.5s infinite ease-in-out',
                      boxShadow: '0 0 4px #10b981',
                      '@keyframes atc-blink': {
                        '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                        '50%': { opacity: 1, transform: 'scale(1.2)' }
                      }
                    }}
                  />
                  <Typography
                    variant='caption'
                    sx={{ color: '#64748b', fontSize: 10, display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    Active for:
                    <span style={{ color: '#10b981', fontWeight: 800 }}>
                      {(() => {
                        const start = new Date(tower.createdAt).getTime()
                        const now = Date.now()
                        const diff = Math.floor((now - start) / 60000)
                        const hours = Math.floor(diff / 60)
                        const mins = diff % 60
                        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
                      })()}
                    </span>
                  </Typography>
                </Box>

                {tower.userId && (
                  <Typography
                    variant='caption'
                    sx={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                      fontSize: 9,
                      fontFamily: 'monospace',
                      bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      px: 0.6,
                      py: 0.2,
                      borderRadius: 0.5,
                      letterSpacing: 0.5
                    }}
                  >
                    VID:{' '}
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: 10,
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.7)',
                        fontWeight: 800
                      }}
                    >
                      {tower.userId}
                    </Typography>
                  </Typography>
                )}
              </Box>
            )}
          </Stack>

          {/* ATIS Section */}
          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', pt: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant='caption'
                sx={{ color: '#64748b', fontSize: 9, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}
              >
                ATIS Briefing
              </Typography>
              <IconButton
                size='small'
                onClick={handleFetchAtis}
                disabled={fetching}
                sx={{
                  p: 0,
                  color: fetching ? '#38bdf8' : '#64748b',
                  '&:hover': { color: '#38bdf8' }
                }}
              >
                {fetching ? <CircularProgress size={12} color='inherit' /> : <RefreshIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            </Box>

            {localAtis?.lines && localAtis.lines.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 120,
                  overflowY: 'auto',
                  bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  p: 1.2,
                  borderRadius: 1,
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(56, 189, 248, 0.2)', borderRadius: '4px' }
                }}
              >
                {localAtis.lines.map((line, i) => {
                  // Skip server header line
                  if (i === 0 && (line.includes('.ivao.aero') || line.includes('/'))) return null

                  return (
                    <Typography
                      key={i}
                      variant='caption'
                      sx={{
                        display: 'block',
                        fontSize: 11,
                        fontFamily: 'monospace',
                        color: theme === 'dark' ? '#cbd5e1' : '#475569',
                        mb: i === localAtis.lines.length - 1 ? 0 : 1,
                        lineHeight: 1.4,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {highlightAtis(line)}
                    </Typography>
                  )
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  p: 1.5,
                  borderRadius: 1,
                  textAlign: 'center',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}
              >
                <Typography variant='caption' sx={{ color: '#64748b', fontStyle: 'italic' }}>
                  {fetching ? 'Retrieving latest data...' : 'No ATIS Broadcast Available'}
                </Typography>
              </Box>
            )}

            {localAtis?.revision && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: '#10b981',
                    color: '#000',
                    px: 1,
                    py: 0.4,
                    borderRadius: 0.5,
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{ fontWeight: 900, fontSize: 10, fontFamily: 'monospace', letterSpacing: 0.5 }}
                  >
                    INFO {phoneticMap[localAtis.revision] || localAtis.revision}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Popup>
    </Marker>
  )
}

export default RadarMarker
