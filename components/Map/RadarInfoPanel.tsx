import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Divider, Button, alpha, CircularProgress } from '@mui/material'
import { FlightTakeoff, FlightLand, RestartAlt, Radar } from '@mui/icons-material'
import { Atc } from 'types'

interface RadarInfoPanelProps {
  origin: Atc | null
  destination: Atc | null
  distance: number | null
  isLoading: boolean
  onReset: () => void
}

const RadarInfoPanel: React.FC<RadarInfoPanelProps> = ({ origin, destination, distance, isLoading, onReset }) => {
  return (
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
            onClick={onReset}
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
  )
}

export default RadarInfoPanel
