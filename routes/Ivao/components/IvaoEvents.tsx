import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Skeleton,
  Chip,
  Button,
  useTheme,
  alpha
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import MapIcon from '@mui/icons-material/Map'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import LaunchIcon from '@mui/icons-material/Launch'
import axios from 'config/axios'
import { IvaoEvent } from 'types'
import moment from 'moment'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'

const eventTypeColors: Record<string, string> = {
  hq_event: 'ivao.hq_event',
  rfe: 'ivao.rfe',
  pde: 'ivao.pde',
  generic: 'ivao.generic'
}

const IvaoEvents: React.FC = () => {
  const theme = useTheme()
  const [events, setEvents] = useState<IvaoEvent[]>([])
  const [loading, setLoading] = useState(true)
  const ivaoUser = useRecoilValue(ivaoUserStore)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<IvaoEvent[]>('/api/ivao/events')
        const division = ivaoUser?.divisionId || 'ES'
        setEvents(response.data.filter((a) => a.divisions.includes(division)))
      } catch (error) {
        console.error('Error fetching IVAO events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [ivaoUser?.divisionId])

  if (loading) {
    return (
      <Box mt={4}>
        <Typography variant='h5' gutterBottom sx={{ fontWeight: 700, letterSpacing: 1 }}>
          PRÓXIMOS EVENTOS IVAO
        </Typography>
        <Stack direction='row' spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant='rectangular' width={320} height={200} sx={{ borderRadius: 2, flexShrink: 0 }} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (events.length === 0) {
    return null
  }

  return (
    <Box mt={4} mb={6}>
      <Stack direction='row' alignItems='center' spacing={1} mb={3}>
        <EventIcon color='primary' />
        <Typography variant='h5' sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
          Eventos Destacados
        </Typography>
      </Stack>

      <Stack
        direction='row'
        spacing={3}
        sx={{
          overflowX: 'auto',
          pb: 3,
          px: 1,
          '&::-webkit-scrollbar': {
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '10px'
          }
        }}
      >
        {events.map((event) => (
          <Card
            key={event.id}
            sx={{
              width: 380,
              flexShrink: 0,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
                theme.palette.background.paper,
                0.7
              )} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.4)}`,
                '& .overlay': {
                  opacity: 1
                }
              }
            }}
          >
            <Box sx={{ position: 'relative', height: 180 }}>
              <CardMedia
                component='img'
                image={event.imageUrl}
                alt={event.title}
                sx={{ height: '100%', objectFit: 'cover' }}
              />
              <Box
                className='overlay'
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.4),
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<LaunchIcon />}
                  href={event.infoUrl}
                  target='_blank'
                  sx={{
                    borderRadius: 20,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Más info
                </Button>
              </Box>
              <Chip
                label={event.eventType.toUpperCase().replace('_', ' ')}
                size='small'
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: eventTypeColors[event.eventType] || theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 700,
                  fontSize: '0.65rem'
                }}
              />
            </Box>

            <CardContent sx={{ pt: 2 }}>
              <Typography
                variant='h6'
                sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 1, height: 50, overflow: 'hidden' }}
              >
                {event.title}
              </Typography>

              <Stack direction='row' spacing={2} mb={2}>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                  <EventIcon sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }} />
                  <Typography variant='caption' color='text.secondary'>
                    {moment(event.startDate).format('DD MMM, HH:mm')}z
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                  <MapIcon sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }} />
                  <Typography variant='caption' color='text.secondary'>
                    {event.divisions.join(', ')}
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {event.airports.map((icao) => (
                  <Chip
                    key={icao}
                    label={icao}
                    size='small'
                    variant='outlined'
                    sx={{
                      fontSize: '0.7rem',
                      height: 20,
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                ))}
              </Box>

              {event.routes && event.routes.length > 0 && (
                <Box sx={{ mt: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.2) }}>
                  <Typography
                    variant='caption'
                    sx={{ display: 'block', mb: 1, fontWeight: 700, color: theme.palette.primary.light }}
                  >
                    RUTA SUGERIDA
                  </Typography>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {event.routes[0].departureIcao}
                    </Typography>
                    <FlightTakeoffIcon sx={{ fontSize: '1rem', color: theme.palette.success.main }} />
                    <Box sx={{ flexGrow: 1, borderBottom: `1px dashed ${alpha(theme.palette.text.disabled, 0.5)}` }} />
                    <FlightLandIcon sx={{ fontSize: '1rem', color: theme.palette.info.main }} />
                    <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {event.routes[0].arrivalIcao}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default IvaoEvents
