import React, { useCallback, useMemo } from 'react'
import { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { formatNumber, gallonsToLiters, getFuelForFlight, getIcaoCodeFromAircraftNFT, getNFTAttributes } from 'utils'
import { tokenBalanceStore } from 'store/balance.atom'
import { useRecoilValue } from 'recoil'
import useMission from 'hooks/useMission'
import MissionSelectAircraft from './MissionSelectAircraft'
import { aircraftNameToIcaoCode, Mission, MissionStatus } from 'types'
import { useRouter } from 'next/router'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { INft } from 'models/Nft'

interface Props {
  aircraft: string
  aircrafts: INft[]
  end: string
  start: string
  isAllowed: (value: number) => boolean
  onBooking: (hasFuel: boolean) => void
  setAircraft: (value: string) => void
}

const IvaoMission = ({ aircrafts, aircraft, isAllowed, setAircraft, start, end, onBooking }: Props) => {
  const router = useRouter()
  const balance = useRecoilValue(tokenBalanceStore)
  const { mission, pool, setMission, getPool } = useMission()
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)

  const currentAircraft = useMemo(() => aircrafts.find((ac) => ac.id.toString() === aircraft), [aircrafts, aircraft])

  const requiredGas = React.useCallback(() => {
    if (!currentAircraft) return 0

    const icaoCode = getIcaoCodeFromAircraftNFT(currentAircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
    if (!icaoCode) return 0

    const fuel = getFuelForFlight(mission?.distance ?? 0, icaoCode)

    return fuel
  }, [currentAircraft, mission?.distance])

  const handleChange = (event: SelectChangeEvent) => {
    setAircraft(event.target.value as string)
  }

  const hasEnoughFuel = useCallback(
    () => requiredGas() <= Number(balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0),
    [balance.airg, requiredGas]
  )

  const getCurrentFuelInLiters = useCallback((currentAircraft: INft) => {
    const combustible = getNFTAttributes(currentAircraft).find((a) => a.trait_type === 'combustible')?.value
    if (!combustible) return 0

    return formatNumber(gallonsToLiters(Number(combustible)), 0)
  }, [])

  React.useEffect(() => {
    if (pool.length === 0) {
      getPool()
    }
  }, [getPool, pool.length])

  React.useEffect(() => {
    if (start && end && currentAircraft) {
      const match = pool.find((p) => p.origin === start && p.destination === end)
      if (match) {
        setMission({
          ...match,
          aircraft: currentAircraft,
          aircraftId: currentAircraft.id.toString(),
          status: MissionStatus.STARTED,
          remote: false,
          isRewarded: false
        } as Mission)
      } else {
        setMission()
      }
    } else {
      setMission()
    }
  }, [pool, setMission, currentAircraft, start, end])

  return (
    <Paper elevation={3} sx={{ borderRadius: 2 }}>
      <Stack
        borderRadius={2}
        direction='row'
        justifyContent='space-between'
        spacing={2}
        sx={{
          position: 'relative',
          borderRadius: 1,

          '&::before': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '100%',
            left: 0,
            backgroundImage: `url(${currentAircraft?.metadata.image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
            borderRadius: 2
          }
        }}
      >
        <MissionSelectAircraft
          aircrafts={aircrafts}
          gasBalance={balance.airg}
          requiredGas={requiredGas}
          handleChange={handleChange}
          hasEnoughFuel={hasEnoughFuel}
          aircraft={aircraft}
          active={!!mission}
          currentAircraft={currentAircraft}
        />
        {ownedAircrafts && ownedAircrafts.length === 0 && (
          <Box width='100%' p={2}>
            <Alert
              severity='error'
              action={
                <Button variant='contained' color='error' onClick={() => router.push('/hangar')}>
                  Ir al Hangar
                </Button>
              }
            >
              <AlertTitle>Se requiere al menos una aeronave.</AlertTitle>
              <Typography>Ve a la página del hangar y consigue una aeronave para continuar.</Typography>
            </Alert>
          </Box>
        )}
        {!isAllowed(mission?.distance ?? 0) && start && end && !!currentAircraft && (
          <Box width='100%' p={2}>
            <Alert severity='error'>
              <AlertTitle>Esta selección excede el rango de la aeronave sin repostar</AlertTitle>
              <Typography>
                La capacidad máxima para esta aeronave es de{' '}
                <b>{currentAircraft && getCurrentFuelInLiters(currentAircraft)}</b> Litros, requeridos:{' '}
                <b>{formatNumber(requiredGas(), 0)}</b> Liters
              </Typography>
            </Alert>
          </Box>
        )}

        {mission?.callsign && hasEnoughFuel() && isAllowed(mission.distance) && (
          <Box width='100%'>
            <Box mt={2}>
              <Typography fontWeight={600} align='center'>
                USA ESTE CALLSIGN
              </Typography>
            </Box>
            <Paper elevation={12}>
              <Stack p={2} mt={2} bgcolor={'success.dark'}>
                <Typography fontSize={32} fontWeight={900} align='center' letterSpacing={3}>
                  {mission.callsign}
                </Typography>
              </Stack>
            </Paper>
          </Box>
        )}

        {mission && hasEnoughFuel() && isAllowed(mission.distance) && (
          <Stack direction='column' alignItems='center' justifyContent='center' spacing={1} p={2}>
            <Typography variant='h5'>{mission?.details.name}</Typography>

            <Box>
              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Distancia:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(mission?.distance, 0)} Km
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Premios:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(mission?.prize)} AIRL
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Peso: </Typography>
                <Typography align='center' variant='body2'>
                  {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    mission?.weight || 0
                  )}{' '}
                  Kg
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Puntos: </Typography>
                <Typography align='center' variant='body2'>
                  {mission?.score ?? '-'} Puntos
                </Typography>
              </Stack>
            </Box>

            <Typography lineHeight={1.2} width={300} align='justify' variant='caption' fontWeight={300}>
              {mission?.details.description}
            </Typography>

            <Box mt={2}>
              <Button
                size='large'
                disabled={!isAllowed(mission.distance) || !hasEnoughFuel()}
                variant='contained'
                onClick={() => onBooking(isAllowed(mission.distance))}
              >
                Reservar este Vuelo
              </Button>
            </Box>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default IvaoMission
