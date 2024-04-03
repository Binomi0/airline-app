import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { formatNumber, getCallsign, getFuelForFlight } from 'utils'
import { NFT } from '@thirdweb-dev/sdk'
import ExploreOffIcon from '@mui/icons-material/ExploreOff'
import { MediaRenderer } from '@thirdweb-dev/react'
import BigNumber from 'bignumber.js'
import { tokenBalanceStore } from 'store/balance.atom'
import { useRecoilValue } from 'recoil'
import useCargo from 'hooks/useCargo'
import { destinationStore } from 'store/destination.atom'
import { Alert, AlertTitle } from '@mui/material'
import CargoSelectAircraft from './CargoSelectAircraft'

enum AircraftRanges {
  'Cessna 172' = '700',
  'Cessna C700 Longitude' = '3000',
  'Boeing 737-600' = '6000',
  'Antonov An-225 Mriya' = '14000'
}

enum IcaoCodes {
  C172 = 'C172',
  C700 = 'C700',
  B737 = 'B737',
  AN225 = 'AN225'
}

const aircraftNameToIcaoCode = {
  'Cessna 172': IcaoCodes.C172,
  'Cessna C700 Longitude': IcaoCodes.C700,
  'Boeing 737-600': IcaoCodes.B737,
  'Antonov An-225 Mriya': IcaoCodes.AN225
}

const getIcaoCodeFromAircraftNFT = (name: keyof typeof aircraftNameToIcaoCode) => aircraftNameToIcaoCode[name]

interface Props {
  aircrafts: NFT[]
  origin: string
  destination: string
  onBooking: (hasFuel: boolean) => void
}

const Cargo = ({ aircrafts, origin, destination, onBooking }: Props) => {
  const [aircraft, setAircraft] = useState<string>('-1')
  const balance = useRecoilValue(tokenBalanceStore)
  const { cargo, newCargo, setCargo } = useCargo()
  const destinations = useRecoilValue(destinationStore)

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

  const hasRequirement = (requirement?: string) => {
    if (!requirement) return false
    const aircraft = aircrafts.find((aircraft) => aircraft.metadata.id === requirement)
    if (!aircraft) return false

    const range = AircraftRanges[aircraft.metadata.name as keyof typeof AircraftRanges]
    const result = Number(range) >= Number(cargo?.distance)

    return result
  }

  React.useEffect(() => {
    if (origin && destination && currentAircraft) {
      newCargo(
        {
          origin,
          destination,
          distance: destinations?.destinations.find((d) => d.callsign === destination)?.distance ?? 0
        },
        currentAircraft,
        getCallsign(),
        false
      )
    } else {
      setCargo()
    }
  }, [newCargo, setCargo, currentAircraft, origin, destination])

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
        {cargo?.callsign && hasEnoughFuel() && hasRequirement(aircraft) && (
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
        {cargo && hasEnoughFuel() && hasRequirement(aircraft) && (
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
                disabled={!hasRequirement(aircraft) || !hasEnoughFuel()}
                variant='contained'
                onClick={() => onBooking(hasRequirement(aircraft))}
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

export default Cargo
