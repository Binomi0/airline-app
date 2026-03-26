import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'
import 'moment/locale/es'
import nextApiInstance from 'config/axios'
import { PublicMission } from 'types'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { nftAircraftTokenAddress } from 'contracts/address'
import { filterByTokenAddress, formatNumber } from 'utils'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CloseIcon from '@mui/icons-material/Close'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { eventBookingSuccessSwal, errorSwal } from 'lib/swal'
import { useRouter } from 'next/router'
import { walletStore } from 'store/wallet.atom'
import Image from 'next/image'

moment.locale('es')

const IBERIA_RED = '#b01d21'

const EventPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { data: userNfts } = useOwnedNfts()

  const [flights, setFlights] = useState<PublicMission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState<PublicMission | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('')

  const ownedAircrafts = useMemo(
    () => userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || [],
    [userNfts]
  )

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await nextApiInstance.get<PublicMission[]>('/api/events/puente-aereo')
        setFlights(data)
      } catch (error) {
        console.error('Error fetching event flights:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFlights()
  }, [])

  const getFlightStatus = (startTime: string | Date | undefined) => {
    if (!startTime) return { label: 'PROGRAMADO', color: theme.palette.success.main }
    const now = moment()
    const start = moment(startTime)
    const diff = start.diff(now, 'minutes')

    if (diff < -60) return { label: 'FINALIZADO', color: theme.palette.grey[600] }
    if (diff < 0) return { label: 'EN VUELO', color: theme.palette.info.main }
    if (diff < 15) return { label: 'EMBARCANDO', color: theme.palette.error.main, pulse: true }
    if (diff < 30) return { label: 'PUERTA ABIERTA', color: theme.palette.warning.main }
    return { label: 'PROGRAMADO', color: theme.palette.success.main }
  }

  const handleOpenBooking = (flight: PublicMission) => {
    setSelectedFlight(flight)
    if (ownedAircrafts.length > 0) {
      setSelectedAircraftId(ownedAircrafts[0].nft.id.toString())
    }
    setBookingOpen(true)
  }

  const handleBook = async () => {
    if (!selectedFlight || !selectedAircraftId) return

    try {
      setBookingOpen(false)
      await nextApiInstance.post('/api/missions/reserve-event', {
        eventData: selectedFlight,
        aircraftId: selectedAircraftId
      })

      await eventBookingSuccessSwal(selectedFlight.callsign || 'EVENTO')

      router.push('/live')
    } catch (error: any) {
      console.error('Booking error:', error)
      errorSwal('Error', error.response?.data?.error || 'No se pudo realizar la reserva.')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, color: 'text.primary' }}>
      <Head>
        <title>Puente Aéreo Iberia | WeiFly FIDS</title>
      </Head>

      {/* Modern, Slim Hero */}
      <Box sx={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <Image
          src='/img/events/iberia_hero.png'
          alt='Iberia Hero'
          layout='fill'
          objectFit='cover'
          priority
          style={{ opacity: 0.2, filter: 'grayscale(0.5)' }}
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
                src='/img/logos/iberia_icon.png'
                sx={{ width: 64, height: 64, border: `2px solid ${IBERIA_RED}` }}
              />
              <Box>
                <Typography variant='overline' sx={{ color: IBERIA_RED, fontWeight: 'bold', letterSpacing: 3 }}>
                  PUENTE AÉREO • EXCLUSIVO IBERIA
                </Typography>
                <Typography variant='h2' sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: -1 }}>
                  Panel de Vuelos <span style={{ color: alpha(theme.palette.text.primary, 0.4) }}>FIDS</span>
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Container maxWidth='xl'>
        {isLoading ? (
          <Box sx={{ width: '100%', mt: 4 }}>
            <LinearProgress
              sx={{ bgcolor: alpha(IBERIA_RED, 0.1), '& .MuiLinearProgress-bar': { bgcolor: IBERIA_RED } }}
            />
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TableContainer
              component={Paper}
              variant='glass'
              sx={{
                borderRadius: 4,
                overflow: 'hidden'
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
                  {flights.map((flight, index) => {
                    const status = getFlightStatus(flight.startTime)
                    const isNext = status.label === 'PUERTA ABIERTA' || status.label === 'EMBARCANDO'

                    return (
                      <TableRow
                        key={flight._id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1) },
                          transition: 'background 0.2s ease',
                          bgcolor: isNext ? alpha(IBERIA_RED, 0.05) : 'transparent',
                          borderLeft: isNext ? `4px solid ${IBERIA_RED}` : 'none'
                        }}
                      >
                        <TableCell sx={{ color: 'text.primary', fontSize: '1.2rem', fontWeight: 700 }}>
                          {moment(flight.startTime).format('HH:mm')}
                        </TableCell>
                        <TableCell
                          sx={{ color: IBERIA_RED, fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}
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
                          <Typography variant='caption' sx={{ color: alpha(theme.palette.text.primary, 0.4) }}>
                            {flight.distance} NM •{' '}
                            {flight.origin === 'LEMD' ? 'MADRID - BARCELONA' : 'BARCELONA - MADRID'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status.label}
                            size='small'
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: status.color,
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                              border: `1px solid ${alpha(status.color as string, 0.2)}`,
                              animation: status.pulse ? 'pulse 2s infinite' : 'none'
                            }}
                          />
                          <style>{`
                            @keyframes pulse {
                              0% { opacity: 1; }
                              50% { opacity: 0.5; }
                              100% { opacity: 1; }
                            }
                          `}</style>
                        </TableCell>
                        <TableCell align='right' sx={{ color: 'success.main', fontWeight: 800, fontSize: '1.1rem' }}>
                          2X • {formatNumber(flight.prize, 0)}{' '}
                          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>AIRL</span>
                        </TableCell>
                        <TableCell align='right'>
                          <Button
                            variant='contained'
                            disabled={status.label === 'FINALIZADO' || status.label === 'EN VUELO'}
                            sx={{
                              bgcolor: isNext ? IBERIA_RED : alpha(theme.palette.text.primary, 0.05),
                              color: isNext ? 'white' : 'text.primary',
                              '&:hover': {
                                bgcolor: isNext ? alpha(IBERIA_RED, 0.8) : alpha(theme.palette.text.primary, 0.1)
                              },
                              borderRadius: '4px',
                              px: 3,
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                            onClick={() => router.push(`/events/${flight._id}`)}
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

      {/* Lightweight Booking Dialog */}
      <Dialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            color: 'text.primary',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Typography variant='subtitle1' fontWeight='bold'>
            RESERVAR VUELO {selectedFlight?.callsign}
          </Typography>
          <IconButton onClick={() => setBookingOpen(false)} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFlight && (
            <Stack spacing={3}>
              <FormControl fullWidth size='small'>
                <InputLabel>Aeronave</InputLabel>
                <Select
                  value={selectedAircraftId}
                  label='Aeronave'
                  onChange={(e) => setSelectedAircraftId(e.target.value)}
                >
                  {ownedAircrafts.map((owned) => (
                    <MenuItem key={owned.nft.id.toString()} value={owned.nft.id.toString()}>
                      {owned.nft.metadata.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(IBERIA_RED, 0.1),
                  borderRadius: 1,
                  border: `1px solid ${alpha(IBERIA_RED, 0.2)}`
                }}
              >
                <Typography variant='caption' sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                  RECOMPENSA ESTIMADA
                </Typography>
                <Typography variant='h6' sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  {formatNumber(selectedFlight.prize, 0)} AIRL
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBookingOpen(false)} color='inherit'>
            SALIR
          </Button>
          <Button
            variant='contained'
            onClick={handleBook}
            disabled={!selectedAircraftId}
            sx={{ bgcolor: IBERIA_RED, '&:hover': { bgcolor: alpha(IBERIA_RED, 0.8) } }}
          >
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EventPage
