import { useMemo, useEffect, useCallback, useState } from 'react'
import type { FC } from 'react'
import { Fade, Box, Typography, Button, CircularProgress, Stack } from '@mui/material'
import { useVaProviderContext } from 'context/VaProvider'
import useCargo from 'hooks/useCargo'
import Link from 'next/link'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import axios from 'config/axios'
import { LastTrackState } from 'types'
import Disconnected from 'components/Disconnected'

const LiveView: FC = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { cargo, getCargo, isLoading } = useCargo()
  const { pilots, setCurrentPilot, active } = useVaProviderContext()
  const [flightState, setFlightState] = useState<LastTrackState>('Boarding')
  // const pilot = useMemo(() => pilots.find((pilot) => pilot.callsign === cargo?.callsign), [pilots, cargo])
  const pilot = useMemo(() => pilots[0], [pilots])

  const handleDisconnect = useCallback(() => {
    setCurrentPilot()
  }, [setCurrentPilot])

  useEffect(() => {
    getCargo()
  }, [getCargo])

  useEffect(() => {
    setCurrentPilot(pilot)
  }, [pilot, setCurrentPilot])

  useEffect(() => {
    if (!pilot || pilot?.lastTrack.state === flightState) return
    console.log({ pilot: pilot.lastTrack.state })
    axios.post('/api/live/state', { state: pilot.lastTrack.state })
    setFlightState(pilot.lastTrack.state as LastTrackState)
  }, [flightState, pilot])

  console.log({ flightState })
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
          <Typography paragraph>Already connected, tracking...</Typography>
          <Typography>{pilot?.lastTrack.onGround ? 'En tierra' : 'En el aire'}</Typography>
          <Typography>Estado ({pilot?.lastTrack.state})</Typography>
          <Button variant='contained' color='secondary' onClick={handleDisconnect}>
            Disconnect
          </Button>
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
