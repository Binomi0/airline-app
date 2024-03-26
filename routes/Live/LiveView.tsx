import { useEffect, useCallback, useState } from 'react'
import useCargo from 'hooks/useCargo'
import Link from 'next/link'
import { LastTrackState, LastTrackStateEnum } from 'types'
import MCDUView from './components/MCDUView'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { deleteApi, postApi } from 'lib/api'

interface Props {}

const LiveView = ({}: Props) => {
  const router = useRouter()
  const { cargo, getCargo, isLoading } = useCargo()
  const { setPilot, pilot } = useLiveFlightProviderContext()
  const [flightState, setFlightState] = useState<LastTrackState>(LastTrackStateEnum.Boarding)

  const handleDisconnect = useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Abort Flight?',
      text: 'Current flight progress will be lost',
      icon: 'warning',
      showCancelButton: true
    })
    if (isConfirmed) {
      setPilot()
      await Promise.all([deleteApi('/api/live'), deleteApi('/api/cargo')])
      router.push('/')
    }
  }, [router, setPilot])

  const handleClaim = useCallback(() => {
    postApi('/api/live/state', { state: LastTrackStateEnum.On_Blocks })
  }, [])

  useEffect(() => {
    getCargo()
  }, [getCargo])

  useEffect(() => {
    if (!pilot || pilot?.lastTrack.state === flightState) return

    postApi('/api/live/state', { state: pilot.lastTrack.state })
    setFlightState(pilot.lastTrack.state as LastTrackState)
  }, [flightState, pilot])

  return (
    <>
      <Fade in={!pilot} unmountOnExit timeout={{ exit: 0 }}>
        <Stack mt={5} spacing={10} alignItems='center'>
          <Typography variant='h2'>Esperando conexión...</Typography>
          <Button color='warning' size='large' variant='contained' onClick={handleDisconnect}>
            cancel current flight
          </Button>
          <Box bgcolor='primary.light' px={5} borderRadius={10}>
            <Typography variant='h3'>{cargo?.callsign}</Typography>
          </Box>
          <Typography variant='h4' paragraph>
            Conéctate a IVAO para continuar.
          </Typography>
          <Box textAlign='center'>
            <CircularProgress size={100} />
          </Box>
        </Stack>
      </Fade>
      <Fade in={!!pilot} unmountOnExit>
        <Box mt={10}>
          {pilot?.lastTrack.state === 'On Blocks' && (
            <Box textAlign='center' my={2}>
              <Button sx={{ zIndex: 1 }} onClick={handleClaim} size='large' variant='contained'>
                CLAIM PRIZE!
              </Button>
            </Box>
          )}
          {pilot && <MCDUView pilot={pilot} onDisconnect={handleDisconnect} />}
        </Box>
      </Fade>
      <Fade in={!cargo && !isLoading}>
        <Box my={10} textAlign='center'>
          <Typography variant='h3' paragraph>
            No tienes vuelos activos para empezar
          </Typography>
          <Link href='/cargo'>
            <Button variant='contained'>
              <Typography>Configura un nuevo vuelo</Typography>
            </Button>
          </Link>
        </Box>
      </Fade>
    </>
  )
}

export default LiveView
