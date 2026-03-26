import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton
} from '@mui/material'
import Head from 'next/head'
import { motion } from 'framer-motion'
import moment from 'moment'
import 'moment/locale/es'
import nextApiInstance from 'config/axios'
import { PublicMission } from 'types'
import { fetcher, formatNumber } from 'utils'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { AIRLINES } from 'config/airlines'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { errorSwal } from 'lib/swal'

moment.locale('es')

const STATUS_CONFIG = {
  FINALIZADO: { threshold: -60, label: 'FINALIZADO' },
  EN_VUELO: { threshold: 0, label: 'EN VUELO' },
  EMBARCANDO: { threshold: 15, label: 'EMBARCANDO' },
  PUERTA_ABIERTA: { threshold: 30, label: 'PUERTA ABIERTA' },
  PROGRAMADO: { label: 'PROGRAMADO' }
} as const

const AirlineEventPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { airline } = router.query

  const airlineConfig = useMemo(() => {
    if (!airline || typeof airline !== 'string') return null
    const config = AIRLINES[airline.toLowerCase()]
    if (!config) {
      console.warn(`No airline config found for: ${airline}`)
      return AIRLINES.iberia // Fallback
    }
    return config
  }, [airline])

  const {
    data: flights,
    isLoading: flightsIsLoading,
    error: flightsError
  } = useQuery({
    queryKey: ['events', airline],
    queryFn: async () => await fetcher<PublicMission[]>(`/api/events/puente-aereo?airline=${airline}`)
  })

  useEffect(() => {
    if (flightsError) {
      errorSwal('Error', 'No se pudo cargar la información del evento.')
      router.push('/events')
    }
  }, [flightsError])

  const getFlightStatus = React.useCallback(
    (startTime: string | Date | undefined) => {
      if (!startTime) return { label: STATUS_CONFIG.PROGRAMADO.label, color: theme.palette.success.main }
      const now = moment()
      const start = moment(startTime)
      const diff = start.diff(now, 'minutes')

      if (diff < STATUS_CONFIG.FINALIZADO.threshold)
        return { label: STATUS_CONFIG.FINALIZADO.label, color: theme.palette.grey[600] }
      if (diff < STATUS_CONFIG.EN_VUELO.threshold)
        return { label: STATUS_CONFIG.EN_VUELO.label, color: theme.palette.info.main }
      if (diff < STATUS_CONFIG.EMBARCANDO.threshold)
        return { label: STATUS_CONFIG.EMBARCANDO.label, color: theme.palette.error.main, pulse: true }
      if (diff < STATUS_CONFIG.PUERTA_ABIERTA.threshold)
        return { label: STATUS_CONFIG.PUERTA_ABIERTA.label, color: theme.palette.warning.main }
      return { label: STATUS_CONFIG.PROGRAMADO.label, color: theme.palette.success.main }
    },
    [theme.palette]
  )

  if (!airlineConfig) return null

  const BRAND_COLOR = airlineConfig.color

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, color: 'text.primary' }}>
      <Head>
        <title>{airlineConfig.name} Events | WeiFly FIDS</title>
        <meta
          name='description'
          content={`Reservar vuelos de eventos especiales de ${airlineConfig.name} y gana recompensas extra.`}
        />
        <meta property='og:title' content={`Vuelos de Eventos de ${airlineConfig.name}`} />
        <meta property='og:image' content={airlineConfig.logo} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      {/* Modern, Slim Hero */}
      <Box sx={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <Image
          src={airlineConfig.hero}
          alt={`${airlineConfig.name} Hero`}
          fill
          sizes='100vw'
          priority
          style={{ objectFit: 'cover', opacity: 0.2, filter: 'grayscale(0.5)' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.default} 90%)`,
            display: 'flex',
            alignItems: 'flex-end',
            pb: 4
          }}
        >
          <Container maxWidth='xl'>
            <Stack direction='row' alignItems='center' spacing={3} mb={2}>
              <Avatar
                src={airlineConfig.logo}
                sx={{ width: 64, height: 64, border: `2px solid ${BRAND_COLOR}`, bgcolor: 'white' }}
              />
              <Box>
                <Typography variant='overline' sx={{ color: BRAND_COLOR, fontWeight: 'bold', letterSpacing: 3 }}>
                  {airlineConfig.overlay}
                </Typography>
                <Typography variant='h2' sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: -1 }}>
                  Panel de Vuelos <span style={{ color: alpha(theme.palette.text.primary, 0.4) }}>FIDS</span>
                </Typography>
              </Box>
            </Stack>
            <Breadcrumbs sx={{ color: 'text.secondary', mb: 1 }}>
              <Link href='/events' passHref>
                <MuiLink underline='hover' color='inherit'>
                  Eventos
                </MuiLink>
              </Link>
              <Typography color='text.primary'>{airlineConfig.name}</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
      </Box>

      <Container maxWidth='xl'>
        {flightsIsLoading ? (
          <TableContainer component={Paper} variant='glass' sx={{ borderRadius: 4, mt: 4 }}>
            <Table>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton variant='text' width='100%' height={66} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : flights?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant='h5' color='text.secondary' gutterBottom>
              No hay vuelos disponibles en este momento
            </Typography>
            <Button
              variant='outlined'
              onClick={() => router.push('/events')}
              sx={{ color: BRAND_COLOR, borderColor: BRAND_COLOR }}
            >
              Volver a Eventos
            </Button>
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TableContainer
              component={Paper}
              variant='glass'
              sx={{
                borderRadius: 4,
                overflow: 'auto',
                '& .MuiTableCell-root': {
                  whiteSpace: 'nowrap'
                }
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}>
                  <TableRow>
                    <TableCell sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 'bold' }}>
                      SALIDA
                    </TableCell>
                    <TableCell sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 'bold' }}>
                      VUELO
                    </TableCell>
                    <TableCell sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 'bold' }}>
                      DESTINO
                    </TableCell>
                    <TableCell sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 'bold' }}>
                      ESTADO
                    </TableCell>
                    <TableCell sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 'bold' }} align='right'>
                      RECOMPENSA
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights?.map((flight) => {
                    const status = getFlightStatus(flight.startTime)
                    const isNext = status.label === 'PUERTA ABIERTA' || status.label === 'EMBARCANDO'

                    return (
                      <TableRow
                        key={flight._id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1) },
                          transition: 'background 0.2s ease',
                          bgcolor: isNext ? alpha(BRAND_COLOR, 0.05) : 'transparent',
                          borderLeft: isNext ? `4px solid ${BRAND_COLOR}` : 'none'
                        }}
                      >
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>
                          {moment(flight.startTime).fromNow()}
                        </TableCell>
                        <TableCell
                          sx={{ color: BRAND_COLOR, fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}
                        >
                          {flight.callsign}
                        </TableCell>
                        <TableCell>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Typography variant='body1' sx={{ fontWeight: 600 }}>
                              {flight.origin}
                            </Typography>
                            <FlightTakeoffIcon sx={{ fontSize: 14, color: alpha(theme.palette.text.primary, 0.3) }} />
                            <Typography variant='body1' sx={{ fontWeight: 600 }}>
                              {flight.destination}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status.label}
                            size='small'
                            aria-label={`Estado del vuelo: ${status.label}`}
                            sx={{
                              bgcolor: alpha(status.color as string, 0.1),
                              color: status.color,
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                              border: `1px solid ${alpha(status.color as string, 0.2)}`,
                              animation: status.pulse ? 'pulse 2s infinite' : 'none',
                              '@keyframes pulse': {
                                '0%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.7, transform: 'scale(0.98)' },
                                '100%': { opacity: 1, transform: 'scale(1)' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align='right' sx={{ color: 'success.main', fontWeight: 800, fontSize: '1.1rem' }}>
                          {flight.rewardMultiplier}X • {formatNumber(flight.prize || 0, 0)}{' '}
                          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>AIRL</span>
                        </TableCell>
                        <TableCell align='right'>
                          <Button
                            variant='contained'
                            disabled={status.label === 'FINALIZADO' || status.label === 'EN VUELO'}
                            sx={{
                              bgcolor: isNext ? BRAND_COLOR : alpha(theme.palette.text.primary, 0.05),
                              color: isNext ? 'white' : 'text.primary',
                              '&:hover': {
                                bgcolor: isNext ? alpha(BRAND_COLOR, 0.8) : alpha(theme.palette.text.primary, 0.1)
                              },
                              borderRadius: '4px',
                              px: 3,
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                            onClick={() => router.push(`/events/active/${flight._id}`)}
                          >
                            INFO / RESERVAR
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}
      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  )
}

export default AirlineEventPage
