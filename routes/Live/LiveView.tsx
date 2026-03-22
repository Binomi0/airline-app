import { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LabelImportantIcon from '@mui/icons-material/LabelImportant'
import HeadsetIcon from '@mui/icons-material/Headset'
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna'
import { deleteApi } from 'lib/api'
import { useSetRecoilState } from 'recoil'
import { liveStore } from 'store/live.atom'
import { bookingStore } from 'store/booking.atom'
import { Mission, ActiveAtc } from 'types'

type Props = {
  mission: Mission
  isLoading: boolean
}

const LiveView: React.FC<Props> = ({ mission, isLoading }) => {
  const router = useRouter()
  const { setPilot } = useLiveFlightProviderContext()
  const setLive = useSetRecoilState(liveStore)
  const setBooking = useSetRecoilState(bookingStore)
  const [originAtc, setOriginAtc] = useState<ActiveAtc | null>(null)

  useEffect(() => {
    if (mission?.origin) {
      fetch(`/api/ivao/atcs?callsign=${mission.origin}`)
        .then((res) => res.json())
        .then((data: ActiveAtc[]) => {
          // Find the most relevant ATC (TWR, APP, or GND)
          const atc = data.find(
            (a) => a.callsign.includes('_TWR') || a.callsign.includes('_APP') || a.callsign.includes('_GND')
          )
          if (atc) setOriginAtc(atc)
        })
        .catch((err) => console.error('Error fetching ATC:', err))
    }
  }, [mission?.origin])

  const handleDisconnect = useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Abortar Vuelo?',
      text: 'El progreso actual del vuelo se perderá.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, abortar',
      cancelButtonText: 'No, continuar'
    })
    if (isConfirmed) {
      setBooking(false)
      await Promise.all([deleteApi('/api/live'), deleteApi('/api/missions')])
      setPilot()
      setLive(undefined)
      router.push('/')
    }
  }, [router, setBooking, setLive, setPilot])

  if (isLoading && !mission) {
    return (
      <Box textAlign='center' mt={10}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!mission) {
    return (
      <Box my={10} textAlign='center'>
        <Typography variant='h4' gutterBottom>
          No tienes misiones activas
        </Typography>
        <Link href='/missions'>
          <Button variant='contained' color='primary'>
            Explorar misiones
          </Button>
        </Link>
      </Box>
    )
  }

  return (
    <Stack mt={5} spacing={4} alignItems='center'>
      <Fade in timeout={800}>
        <Stack spacing={4} alignItems='center' width='100%' maxWidth={800}>
          <Box textAlign='center'>
            <Typography
              variant='h3'
              fontWeight='900'
              sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: 4 }}
            >
              Misión Despachada
            </Typography>
            <Typography variant='subtitle1' color='text.secondary'>
              Tu plan de vuelo está listo para ser activado.
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              p: 1,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.4) 0%, rgba(13, 71, 161, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Header / Callsign */}
            <Box sx={{ p: 4, textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant='overline' sx={{ opacity: 0.6, letterSpacing: 2, fontWeight: 'bold' }}>
                IDENTIFICATIVO DE VUELO
              </Typography>
              <Typography
                variant='h1'
                fontWeight='900'
                sx={{
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  letterSpacing: { xs: 8, md: 16 },
                  background: 'linear-gradient(to bottom, #fff 0%, #aaa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  my: 2
                }}
              >
                {mission.callsign}
              </Typography>
            </Box>

            {/* Route & Distance */}
            <Box sx={{ p: 6 }}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={4}>
                <Box textAlign='left' flex={1}>
                  <Typography variant='h2' fontWeight='bold' sx={{ mb: 1 }}>
                    {mission.origin}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                    ORIGEN
                  </Typography>
                </Box>

                <Box
                  flex={2}
                  position='relative'
                  sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                      position: 'absolute',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'primary.main',
                        top: -5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        boxShadow: '0 0 15px #1a237e'
                      }
                    }}
                  />
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      top: -15,
                      fontWeight: 'bold',
                      color: 'primary.light',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 10
                    }}
                  >
                    {mission.distance} NM
                  </Typography>
                </Box>

                <Box textAlign='right' flex={1}>
                  <Typography variant='h2' fontWeight='bold' sx={{ mb: 1 }}>
                    {mission.destination}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                    DESTINO
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Mission Intel / Bottom Bar */}
            <Stack
              direction='row'
              justifyContent='space-around'
              sx={{
                p: 3,
                bgcolor: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <Box textAlign='center'>
                <Typography variant='caption' display='block' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                  CARGA
                </Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{mission.weight} KG</Typography>
              </Box>
              <Divider orientation='vertical' flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box textAlign='center'>
                <Typography variant='caption' display='block' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                  RECOMPENSA
                </Typography>
                <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>{mission.prize} AIRL</Typography>
              </Box>
              <Divider orientation='vertical' flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box textAlign='center'>
                <Typography variant='caption' display='block' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                  TIPO
                </Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{mission.type}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Stepper / Instructions */}
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant='h5' fontWeight='bold' sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsInputAntennaIcon color='primary' /> Briefing de Misión
            </Typography>

            <Stack spacing={3}>
              {[
                {
                  title: 'Preparar Entorno',
                  desc: `Inicia tu simulador y sitúate en una puerta o aparcamiento en ${mission.origin}.`,
                  icon: <AirplanemodeActiveIcon />
                },
                {
                  title: 'Conectar WeiFly',
                  desc: 'Abre la aplicación de escritorio y pulsa el botón azul superior para activar el seguimiento.',
                  icon: <OpenInNewIcon />
                },
                {
                  title: 'Configurar Aeronave',
                  desc: `Asegúrate de volar el ${mission.aircraft?.metadata?.name || 'avión asignado'} con el callsign ${mission.callsign}.`,
                  icon: <LabelImportantIcon />
                },
                {
                  title: 'Solicitar Autorización',
                  desc: originAtc
                    ? `Contacta con ${originAtc.callsign} en ${originAtc.atcSession?.frequency || 'su frecuencia'} para pedir plan de vuelo y puesta en marcha.`
                    : 'Contacta con ATC (si hay servicio) para pedir plan de vuelo y puesta en marcha.',
                  icon: <HeadsetIcon />
                }
              ].map((step, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 3,
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 15px rgba(26, 35, 126, 0.4)'
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>
                      {step.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Alert
            severity='info'
            variant='outlined'
            sx={{
              width: '100%',
              borderRadius: 3,
              bgcolor: 'rgba(2, 136, 209, 0.05)',
              borderColor: 'rgba(2, 136, 209, 0.2)',
              '& .MuiAlert-icon': { color: 'primary.light' }
            }}
          >
            <Typography variant='body2' fontWeight='500'>
              El seguimiento web ha sido migrado. Por favor, asegúrate de tener abierta la aplicación de escritorio para
              que detecte tu vuelo automáticamente.
            </Typography>
          </Alert>

          <Stack spacing={2} width='100%' direction={{ xs: 'column', sm: 'row' }}>
            <Button
              fullWidth
              variant='contained'
              size='large'
              href={`weifly://reserve?missionId=${mission._id}`}
              sx={{
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: '900',
                borderRadius: 4,
                background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                boxShadow: '0 8px 25px rgba(26, 35, 126, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(26, 35, 126, 0.7)'
                }
              }}
            >
              INICIAR EN WEIFLY DESKTOP
            </Button>

            <Button
              fullWidth
              variant='outlined'
              color='inherit'
              component='a'
              href='#' // URL real
              target='_blank'
              sx={{
                py: 2.5,
                borderRadius: 4,
                borderWidth: '2px',
                fontWeight: 'bold',
                '&:hover': { borderWidth: '2px', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Descargar App
            </Button>
          </Stack>

          <Button
            variant='text'
            onClick={handleDisconnect}
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
              opacity: 0.7,
              '&:hover': { opacity: 1, textDecoration: 'underline' }
            }}
          >
            Cancelar misión reservada
          </Button>
        </Stack>
      </Fade>
    </Stack>
  )
}

export default LiveView
