import React from 'react'
import { Box, Paper, CardContent, Typography, Stack, Divider, Button, CircularProgress } from '@mui/material'
import { alpha } from '@mui/material/styles'
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
    <Paper
      variant='glass'
      sx={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 1000,
        width: 320,
        borderRadius: 3
      }}
    >
      <CardContent sx={{ p: '24px !important' }}>
        <Stack spacing={3}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography
              variant='subtitle2'
              sx={{
                fontWeight: 800,
                color: 'info.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                letterSpacing: 1.5,
                textTransform: 'uppercase'
              }}
            >
              <Radar sx={{ fontSize: 20 }} />
              Flight Planner
            </Typography>
            {isLoading && <CircularProgress size={12} sx={{ color: 'info.main' }} />}
          </Box>

          <Divider
            sx={{
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.info.main, 0.1)
                  : alpha(theme.palette.info.main, 0.05)
            }}
          />

          <Stack spacing={2}>
            {/* DEPARTURE */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) =>
                  origin
                    ? alpha(theme.palette.success.main, 0.1)
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.slate.main, 0.5)
                      : alpha(theme.palette.common.black, 0.03),
                border: (theme) =>
                  `1px solid ${origin ? alpha(theme.palette.success.main, 0.4) : theme.palette.mode === 'dark' ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.common.black, 0.05)}`
              }}
            >
              <Stack direction='row' spacing={1.5} alignItems='center'>
                <FlightTakeoff
                  sx={{
                    color: (theme) => (origin ? theme.palette.success.main : theme.palette.text.disabled),
                    fontSize: 20
                  }}
                />
                <Box>
                  <Typography
                    variant='caption'
                    sx={{
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      letterSpacing: 1
                    }}
                  >
                    Departure
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 700,
                      color: (theme) => (origin ? theme.palette.success.main : theme.palette.text.secondary),
                      fontFamily: 'monospace'
                    }}
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
                bgcolor: (theme) =>
                  destination
                    ? alpha(theme.palette.error.main, 0.1)
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.slate.main, 0.5)
                      : alpha(theme.palette.common.black, 0.03),
                border: (theme) =>
                  `1px solid ${destination ? alpha(theme.palette.error.main, 0.4) : theme.palette.mode === 'dark' ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.common.black, 0.05)}`
              }}
            >
              <Stack direction='row' spacing={1.5} alignItems='center'>
                <FlightLand
                  sx={{
                    color: (theme) => (destination ? theme.palette.error.main : theme.palette.text.disabled),
                    fontSize: 20
                  }}
                />
                <Box>
                  <Typography
                    variant='caption'
                    sx={{
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      letterSpacing: 1
                    }}
                  >
                    Arrival
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 700,
                      color: (theme) => (destination ? theme.palette.error.main : theme.palette.text.secondary),
                      fontFamily: 'monospace'
                    }}
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
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                p: 2,
                borderRadius: 2,
                textAlign: 'center',
                border: (theme) => `1px solid ${theme.palette.info.main}`
              }}
            >
              <Typography variant='h5' sx={{ color: 'text.primary', fontWeight: 900, fontFamily: 'monospace' }}>
                {distance} <span style={{ fontSize: 12, color: 'inherit', opacity: 0.8 }}>NM</span>
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
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
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.info.main, 0.3)
                  : alpha(theme.palette.info.main, 0.2),
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'info.main',
                color: 'text.primary',
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.05)
              }
            }}
          >
            System Reset
          </Button>
        </Stack>
      </CardContent>
    </Paper>
  )
}

export default RadarInfoPanel
