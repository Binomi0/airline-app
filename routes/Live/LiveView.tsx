import { useMemo, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import { Fade, Box, Typography, Button } from '@mui/material'
import { useVaProviderContext } from 'context/VaProvider'
import useCargo from 'hooks/useCargo'
import Link from 'next/link'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'

const LiveView: FC = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { cargo, getCargo, isLoading } = useCargo()
  const { pilots, setCurrentPilot, active } = useVaProviderContext()
  const pilot = useMemo(() => pilots.find((pilot) => pilot.callsign === cargo?.callsign), [pilots, cargo])

  const handleDisconnect = useCallback(() => {
    setCurrentPilot()
  }, [setCurrentPilot])

  useEffect(() => {
    getCargo()
  }, [getCargo])

  useEffect(() => {
    setCurrentPilot(pilot)
  }, [pilot, setCurrentPilot])

  if (!address) {
    return (
      <Box mt={10} textAlign='center'>
        <GppGoodIcon sx={{ fontSize: 72 }} color='primary' />
        <Typography variant='h2' paragraph>
          Sign in
        </Typography>
        <Typography variant='h4' paragraph>
          Sign in with your wallet to start tracking.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Fade in={!active && !pilot} unmountOnExit timeout={{ exit: 0 }}>
        <Box mt={10} textAlign='center'>
          <Typography variant='h1'>Esperando conexión...</Typography>
          <Typography variant='h2'>{cargo?.callsign}</Typography>
          <Typography variant='h3'>Conéctate a IVAO para continuar.</Typography>
        </Box>
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
