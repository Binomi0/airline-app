import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Card,
  CardContent
} from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import moment from 'moment'
import 'moment/locale/es'
import nextApiInstance from 'config/axios'
import { PublicMission } from 'types'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { nftAircraftTokenAddress } from 'contracts/address'
import { filterByTokenAddress, formatNumber } from 'utils'
import { eventBookingSuccessSwal, errorSwal } from 'lib/swal'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AirIcon from '@mui/icons-material/Air'
import Image from 'next/image'

moment.locale('es')

const IBERIA_RED = '#b01d21'

const EventDetailPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const { data: userNfts } = useOwnedNfts()

  const [event, setEvent] = useState<PublicMission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('')
  const [isBooking, setIsBooking] = useState(false)

  const ownedAircrafts = useMemo(
    () => userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || [],
    [userNfts]
  )

  useEffect(() => {
    if (!id) return
    const fetchDetail = async () => {
      try {
        const { data } = await nextApiInstance.get<PublicMission>(`/api/events/detail?id=${id}`)
        setEvent(data)
        if (ownedAircrafts.length > 0) {
          setSelectedAircraftId(ownedAircrafts[0].nft.id.toString())
        }
      } catch (error) {
        console.error('Error fetching event details:', error)
        errorSwal('Error', 'No se pudo cargar la información del evento.')
        router.push('/events')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id, ownedAircrafts])

  const handleBook = async () => {
    if (!event || !selectedAircraftId) return
    setIsBooking(true)
    try {
      await nextApiInstance.post('/api/missions/reserve-event', {
        eventData: event,
        aircraftId: selectedAircraftId
      })
      await eventBookingSuccessSwal(event.callsign || 'EVENTO')
      router.push('/live')
    } catch (error: any) {
      console.error('Booking error:', error)
      errorSwal('Error', error.response?.data?.error || 'No se pudo realizar la reserva.')
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading || !event) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress
          sx={{ width: '200px', bgcolor: alpha(IBERIA_RED, 0.1), '& .MuiLinearProgress-bar': { bgcolor: IBERIA_RED } }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <Head>
        <title>{event.callsign} | Detalles del Evento Iberia</title>
      </Head>

      {/* Large Hero */}
      <Box sx={{ position: 'relative', height: '45vh', overflow: 'hidden' }}>
        <Image
          src='/img/events/iberia_hero.png'
          alt='Iberia Aero'
          layout='fill'
          objectFit='cover'
          priority
          style={{ opacity: 0.4 }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.default} 100%)`,
            display: 'flex',
            alignItems: 'flex-end',
            pb: 6
          }}
        >
          <Container maxWidth='xl'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/events')}
                sx={{ color: 'text.secondary', mb: 2, '&:hover': { color: IBERIA_RED } }}
              >
                Volver al Panel FIDS
              </Button>
              <Stack direction='row' alignItems='center' spacing={2}>
                <Avatar
                  src='/img/logos/iberia_icon.png'
                  sx={{ width: 80, height: 80, border: `3px solid ${IBERIA_RED}` }}
                />
                <Box>
                  <Typography variant='overline' sx={{ color: IBERIA_RED, fontWeight: 900, letterSpacing: 4 }}>
                    MISIÓN PATROCINADA
                  </Typography>
                  <Typography variant='h1' sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
                    {event.callsign}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Container>
        </Box>
      </Box>

      <Container maxWidth='xl'>
        <Grid container spacing={4}>
          {/* Main Info */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Route Card */}
              <Paper
                variant='glass'
                sx={{
                  p: 4,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Grid container alignItems='center' spacing={4}>
                  <Grid item xs={12} md={5}>
                    <Typography variant='h3' fontWeight={900}>
                      {event.origin}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      {event.origin === 'LEMD' ? 'Adolfo Suárez Madrid-Barajas' : 'Josep Tarradellas Barcelona-El Prat'}
                    </Typography>
                    <Stack direction='row' spacing={2} mt={2}>
                      <Box sx={{ textAlign: 'center' }}>
                        <ThermostatIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='caption' display='block'>
                          18°C
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='caption' display='block'>
                          4 KT
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Divider sx={{ borderStyle: 'dashed', borderColor: alpha(theme.palette.text.primary, 0.2) }} />
                      <FlightTakeoffIcon
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'background.default',
                          p: 0.5,
                          borderRadius: '50%',
                          color: IBERIA_RED
                        }}
                      />
                    </Box>
                    <Typography variant='caption' sx={{ mt: 2, display: 'block', fontWeight: 'bold' }}>
                      {event.distance} NM
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
                    <Typography variant='h3' fontWeight={900}>
                      {event.destination}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      {event.destination === 'LEBL'
                        ? 'Josep Tarradellas Barcelona-El Prat'
                        : 'Adolfo Suárez Madrid-Barajas'}
                    </Typography>
                    <Stack direction='row' spacing={2} mt={2} justifyContent='flex-end'>
                      <Box sx={{ textAlign: 'center' }}>
                        <ThermostatIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='caption' display='block'>
                          16°C
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='caption' display='block'>
                          12 KT
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Details & Briefing */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    variant='outlined'
                    sx={{ height: '100%', borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.4) }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <AccessTimeIcon color='primary' />
                          <Typography variant='h6'>Horarios</Typography>
                        </Stack>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color='text.secondary'>Salida Estimada</Typography>
                          <Typography fontWeight='bold'>{moment(event.startTime).format('HH:mm')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color='text.secondary'>Llegada Estimada</Typography>
                          <Typography fontWeight='bold'>{moment(event.endTime).format('HH:mm')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color='text.secondary'>Tiempo de Vuelo</Typography>
                          <Typography fontWeight='bold'>1h 15m</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    variant='outlined'
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: alpha(IBERIA_RED, 0.03),
                      borderColor: alpha(IBERIA_RED, 0.2)
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <WorkspacePremiumIcon sx={{ color: IBERIA_RED }} />
                          <Typography variant='h6' sx={{ color: IBERIA_RED }}>
                            Premios Iberia
                          </Typography>
                        </Stack>
                        <Divider sx={{ borderColor: alpha(IBERIA_RED, 0.1) }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color='text.secondary'>Multiplicador</Typography>
                          <Typography fontWeight='900' sx={{ color: 'success.main' }}>
                            2.0X
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color='text.secondary'>Recompensa</Typography>
                          <Typography fontWeight='900' sx={{ fontSize: '1.2rem' }}>
                            {formatNumber(event.prize, 0)} AIRL
                          </Typography>
                        </Box>
                        <Typography variant='caption' sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                          * El premio se otorga al finalizar el vuelo satisfactoriamente.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Mission Summary Text */}
              <Box sx={{ p: 2 }}>
                <Typography variant='h5' gutterBottom fontWeight='bold'>
                  Instrucciones de Misión
                </Typography>
                <Typography variant='body1' color='text.secondary' paragraph>
                  Este vuelo del Puente Aéreo es un evento patrocinado diseñado para maximizar tus ganancias. Deberás
                  completar la ruta entre {event.origin} y {event.destination} siguiendo las reglas de la aerolínea.
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  1. Asegúrate de tener combustible suficiente.
                  <br />
                  2. Inicia la simulación desde la Desktop App.
                  <br />
                  3. El sistema validará tu llegada en el aeropuerto de destino.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Booking Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper
              variant='glass'
              sx={{
                p: 4,
                borderRadius: 4,
                position: 'sticky',
                top: 80,
                border: `2px solid ${alpha(IBERIA_RED, 0.2)}`
              }}
            >
              <Typography variant='h5' fontWeight={900} gutterBottom>
                RESERVAR AHORA
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={4}>
                Selecciona una aeronave disponible de tu hangar para este vuelo.
              </Typography>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Tu Aeronave</InputLabel>
                  <Select
                    value={selectedAircraftId}
                    label='Tu Aeronave'
                    onChange={(e) => setSelectedAircraftId(e.target.value)}
                  >
                    {ownedAircrafts.map((owned) => (
                      <MenuItem key={owned.nft.id.toString()} value={owned.nft.id.toString()}>
                        {owned.nft.metadata?.name || `Aircraft #${owned.nft.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ p: 2, bgcolor: alpha(IBERIA_RED, 0.05), borderRadius: 2 }}>
                  <Typography variant='caption' display='block' color='text.secondary'>
                    AERONAVE RECOMENDADA
                  </Typography>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Airbus A320 / Boeing 737
                  </Typography>
                </Box>

                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  disabled={!selectedAircraftId || isBooking}
                  onClick={handleBook}
                  sx={{
                    height: 56,
                    bgcolor: IBERIA_RED,
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: alpha(IBERIA_RED, 0.8) }
                  }}
                >
                  {isBooking ? 'PROCESANDO...' : 'CONFIRMAR VUELO'}
                </Button>

                <Stack direction='row' spacing={1} justifyContent='center'>
                  <Typography variant='caption' color='text.secondary'>
                    Sujeto a términos de patrocinio de Iberia •
                  </Typography>
                  <Link href='#' sx={{ fontSize: '0.75rem', color: IBERIA_RED }}>
                    Ver términos
                  </Link>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default EventDetailPage
