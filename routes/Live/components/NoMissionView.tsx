import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { nftAircraftTokenAddress } from 'contracts/address'
import { filterByTokenAddress } from 'utils'

const NoMissionView = () => {
  const router = useRouter()
  const { data: userNfts } = useOwnedNfts()

  const hasAircraft = useMemo(
    () => (userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || []).length > 0,
    [userNfts]
  )

  const ctaHref = hasAircraft ? '/missions' : '/user/aircraft'
  const ctaLabel = hasAircraft ? 'Buscar misiones' : 'Adquirir aeronave'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 3
      }}
    >
      <Paper
        variant='glass'
        sx={{
          maxWidth: 440,
          width: '100%',
          p: 5,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <AirplanemodeInactiveIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.5 }} />

        <Typography variant='h5' color='text.primary'>
          Sin misión activa
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 320 }}>
          {hasAircraft
            ? 'No tienes ninguna misión reservada. Explora las rutas disponibles y despega.'
            : 'Necesitas una aeronave antes de poder volar. Consigue tu primer avión para desbloquear misiones.'}
        </Typography>

        <Button
          variant='contained'
          size='large'
          startIcon={<FlightTakeoffIcon />}
          onClick={() => router.push(ctaHref)}
          sx={{ mt: 1, px: 4 }}
        >
          {ctaLabel}
        </Button>
      </Paper>
    </Box>
  )
}

export default NoMissionView
