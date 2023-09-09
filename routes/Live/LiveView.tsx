import { useMemo, useEffect, useCallback, useState } from 'react'
import type { FC } from 'react'
import { Fade, Box, Typography, Button, CircularProgress, Stack } from '@mui/material'
import { useVaProviderContext } from 'context/VaProvider'
import useCargo from 'hooks/useCargo'
import Link from 'next/link'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import axios from 'config/axios'
import { LastTrackState, LastTrackStateEnum } from 'types'
import Disconnected from 'components/Disconnected'
import MCDUView from './components/MCDUView'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const LiveView: FC = () => {
  const router = useRouter()
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { cargo, getCargo, isLoading } = useCargo()
  const { pilots, setCurrentPilot, active } = useVaProviderContext()
  const [flightState, setFlightState] = useState<LastTrackState>(LastTrackStateEnum.Boarding)
  const pilot = useMemo(() => pilots.find((pilot) => pilot.callsign === cargo?.callsign), [pilots, cargo])
  // const pilot = pilots && pilots[0]

  const handleDisconnect = useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Abort Flight?',
      text: 'Current flight progress will be lost',
      icon: 'warning',
      showCancelButton: true
    })
    if (isConfirmed) {
      setCurrentPilot()
      await Promise.all([axios.delete('/api/live'), axios.delete('/api/cargo')])
      router.push('/')
    }
  }, [router, setCurrentPilot])

  const handleClaim = useCallback(() => {
    axios.post('/api/live/state', { state: LastTrackStateEnum.On_Blocks })
  }, [])

  useEffect(() => {
    getCargo()
  }, [getCargo])

  useEffect(() => {
    setCurrentPilot(pilot)
  }, [pilot, setCurrentPilot])

  useEffect(() => {
    if (!pilot || pilot?.lastTrack.state === flightState) return
    axios.post('/api/live/state', { state: pilot.lastTrack.state })
    setFlightState(pilot.lastTrack.state as LastTrackState)
  }, [flightState, pilot])

  if (!address) {
    return <Disconnected />
  }

  return (
    <>
      <Fade in={!active && !pilot} unmountOnExit timeout={{ exit: 0 }}>
        <Stack mt={10} spacing={10} alignItems='center'>
          <Typography variant='h1'>Esperando conexión...</Typography>
          <Box bgcolor='primary.light' px={5} borderRadius={10}>
            <Typography variant='h2'>{cargo?.callsign}</Typography>
          </Box>
          <Typography variant='h3' paragraph>
            Conéctate a IVAO para continuar.
          </Typography>
          <Box textAlign='center'>
            <CircularProgress size={100} />
          </Box>
        </Stack>
      </Fade>
      <Fade in={!!active && !!pilot} unmountOnExit>
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
