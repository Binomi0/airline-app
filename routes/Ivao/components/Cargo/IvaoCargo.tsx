import React, { useCallback, useMemo } from 'react'
import { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {
  formatNumber,
  gallonsToLiters,
  getCallsign,
  getFuelForFlight,
  getIcaoCodeFromAircraftNFT,
  getNFTAttributes
} from 'utils'
import { NFT } from '@thirdweb-dev/sdk'
import BigNumber from 'bignumber.js'
import { tokenBalanceStore } from 'store/balance.atom'
import { useRecoilValue } from 'recoil'
import useCargo from 'hooks/useCargo'
import { destinationStore } from 'store/destination.atom'
import CargoSelectAircraft from './CargoSelectAircraft'
import { aircraftNameToIcaoCode } from 'types'
import { useRouter } from 'next/router'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

interface Props {
  aircraft: string
  aircrafts: NFT[]
  end: string
  start: string
  // eslint-disable-next-line no-unused-vars
  isAllowed: (value: number) => boolean
  // eslint-disable-next-line no-unused-vars
  onBooking: (hasFuel: boolean) => void
  // eslint-disable-next-line no-unused-vars
  setAircraft: (value: string) => void
}

const IvaoCargo = ({ aircrafts, aircraft, isAllowed, setAircraft, start, end, onBooking }: Props) => {
  const router = useRouter()
  const balance = useRecoilValue(tokenBalanceStore)
  const { cargo, newCargo, setCargo } = useCargo()
  const destinations = useRecoilValue(destinationStore)
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)

  const currentAircraft = useMemo(() => aircrafts.find((ac) => ac.metadata.id === aircraft), [aircrafts, aircraft])

  const requiredGas = React.useCallback(() => {
    if (!currentAircraft) return new BigNumber(0)

    const icaoCode = getIcaoCodeFromAircraftNFT(currentAircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
    if (!icaoCode) return new BigNumber(0)

    const fuel = getFuelForFlight(new BigNumber(cargo?.distance ?? 0), icaoCode)

    return fuel
  }, [currentAircraft, cargo?.distance])

  const handleChange = (event: SelectChangeEvent) => {
    setAircraft(event.target.value as string)
  }

  const hasEnoughFuel = useCallback(
    () => requiredGas().isLessThanOrEqualTo(balance.airg ?? 0),
    [balance.airg, requiredGas]
  )

  const getCurrentFuelInLiters = useCallback((currentAircraft: NFT) => {
    const combustible = getNFTAttributes(currentAircraft).find((a) => a.trait_type === 'combustible')?.value
    if (!combustible) return 0

    return formatNumber(gallonsToLiters(Number(combustible)), 0)
  }, [])

  React.useEffect(() => {
    if (start && end && currentAircraft) {
      newCargo(
        {
          origin: start,
          destination: end,
          distance: destinations?.destinations.find((d) => d.callsign === end)?.distance ?? 0
        },
        currentAircraft,
        getCallsign(),
        false
      )
    } else {
      setCargo()
    }
  }, [newCargo, setCargo, currentAircraft, start, end, destinations?.destinations])

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
            backgroundImage: `url(${aircrafts[Number(aircraft)]?.metadata.image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
            borderRadius: 2
          }
        }}
      >
        <CargoSelectAircraft
          aircrafts={aircrafts}
          gasBalance={balance.airg}
          requiredGas={requiredGas}
          handleChange={handleChange}
          hasEnoughFuel={hasEnoughFuel}
          aircraft={aircraft}
          active={!!cargo}
          currentAircraft={currentAircraft}
        />
        {ownedAircrafts && ownedAircrafts.length === 0 && (
          <Box width='100%' p={2}>
            <Alert
              severity='error'
              action={
                <Button variant='contained' color='error' onClick={() => router.push('/hangar')}>
                  Go to Hangar
                </Button>
              }
            >
              <AlertTitle>At least one aircraft is required.</AlertTitle>
              <Typography>Go to hangar page and get and aircraft to continue.</Typography>
            </Alert>
          </Box>
        )}
        {!isAllowed(cargo?.distance ?? 0) && start && end && !!currentAircraft && (
          <Box width='100%' p={2}>
            <Alert severity='error'>
              <AlertTitle>This selection exceeds aircraft range without refueling</AlertTitle>
              <Typography>
                Max capacity for this aircraft is <b>{currentAircraft && getCurrentFuelInLiters(currentAircraft)}</b>{' '}
                Liters, required: <b>{formatNumber(requiredGas().toNumber(), 0)}</b> Liters
              </Typography>
            </Alert>
          </Box>
        )}

        {cargo?.callsign && hasEnoughFuel() && isAllowed(cargo.distance) && (
          <Box width='100%'>
            <Box mt={2}>
              <Typography fontWeight={600} align='center'>
                USE THIS CALLSIGN
              </Typography>
            </Box>
            <Paper elevation={12}>
              <Stack p={2} mt={2} bgcolor={'success.dark'}>
                <Typography fontSize={32} fontWeight={900} align='center' letterSpacing={3}>
                  {cargo.callsign}
                </Typography>
              </Stack>
            </Paper>
          </Box>
        )}

        {cargo && hasEnoughFuel() && isAllowed(cargo.distance) && (
          <Stack direction='column' alignItems='center' justifyContent='center' spacing={1} p={2}>
            <Typography variant='h5'>{cargo?.details.name}</Typography>

            <Box>
              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Distance:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(cargo?.distance, 0)} Km
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Rewards:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(cargo?.prize)} AIRL
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Weight: </Typography>
                <Typography align='center' variant='body2'>
                  {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    cargo?.weight || 0
                  )}{' '}
                  Kg
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Airdrop: </Typography>
                <Typography align='center' variant='body2'>
                  {cargo?.score ?? '-'} Points
                </Typography>
              </Stack>
            </Box>

            <Typography lineHeight={1.2} width={300} align='justify' variant='caption' fontWeight={300}>
              {cargo?.details.description}
            </Typography>

            <Box mt={2}>
              <Button
                size='large'
                disabled={!isAllowed(cargo.distance) || !hasEnoughFuel()}
                variant='contained'
                onClick={() => onBooking(isAllowed(cargo.distance))}
              >
                Book this Flight
              </Button>
            </Box>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default IvaoCargo
