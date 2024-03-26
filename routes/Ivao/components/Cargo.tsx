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
}

const Cargo = ({ aircrafts, origin, destination }: Props) => {
  const [aircraft, setAircraft] = useState<string>('-1')
  const balance = useRecoilValue(tokenBalanceStore)
  const { cargo, newCargo, setCargo } = useCargo()

  const currentAircraft = useMemo(() => aircrafts.find((ac) => ac.metadata.id === aircraft), [aircrafts, aircraft])

  const requiredGas = React.useCallback(() => {
    if (!currentAircraft) return new BigNumber(0)

    const icaoCode = getIcaoCodeFromAircraftNFT(currentAircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
    if (!icaoCode) return new BigNumber(0)

    const fuel = getFuelForFlight(new BigNumber(cargo?.distance ?? 0), icaoCode)

    return fuel
  }, [aircrafts, aircraft, currentAircraft])

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
      newCargo({ origin, destination }, currentAircraft, getCallsign(), false)
    } else {
      setCargo()
    }
  }, [newCargo, setCargo, currentAircraft, origin, destination])

  return (
    <Paper elevation={3}>
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' spacing={2} width='100%' p={2}>
          <Stack justifyContent='space-between' spacing={2}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id='select-cargo-aircarft-label'>Select an Aircraft</InputLabel>
                <Select
                  error={aircraft !== '-1' && !hasRequirement(aircraft)}
                  fullWidth
                  labelId='select-cargo-aircarft-label'
                  id='select-cargo-aircarft'
                  value={aircraft}
                  label='Select an Aircraft'
                  onChange={handleChange}
                  autoWidth
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value='-1'></MenuItem>
                  <MenuItem disabled={aircraft !== '-1' && !hasRequirement('0')} value='0'>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' spacing={2}>
                      <Typography>Cessna C-172</Typography>{' '}
                      {aircraft !== '-1' && !hasRequirement('0') && <ExploreOffIcon fontSize='small' />}
                    </Stack>
                  </MenuItem>
                  <MenuItem disabled={!hasRequirement('1')} value='1'>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' spacing={2}>
                      <Typography>Cessna C-700 Longitude</Typography>{' '}
                      {!hasRequirement('1') && <ExploreOffIcon fontSize='small' />}
                    </Stack>
                  </MenuItem>
                  <MenuItem disabled={!hasRequirement('2')} value='2'>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' spacing={2}>
                      <Typography>Boeing 737</Typography> {!hasRequirement('2') && <ExploreOffIcon fontSize='small' />}
                    </Stack>
                  </MenuItem>
                  <MenuItem disabled={!hasRequirement('3')} value='3'>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' spacing={2}>
                      <Typography>Antonov AN-225</Typography>{' '}
                      {!hasRequirement('3') && <ExploreOffIcon fontSize='small' />}
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            {aircrafts[Number(aircraft)] && (
              <Box>
                <MediaRenderer height='128px' width='128px' src={aircrafts[Number(aircraft)].metadata.image} />
              </Box>
            )}
            <Box>
              <Typography color={hasEnoughFuel() ? 'success.light' : 'error.main'}>
                Fuel available:{' '}
                {Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(balance.airg?.toNumber() || 0)}
              </Typography>
              <Typography>Fuel required: {Intl.NumberFormat().format(requiredGas().toNumber() || 0)}</Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack direction='column' alignItems='center' justifyContent='center' mt={2} spacing={1} p={2}>
          <Typography variant='h5'>{cargo?.details.name}</Typography>

          <Stack direction='row' justifyContent='space-between' minWidth={300}>
            <Typography align='center'>Distance:</Typography>
            <Typography align='center' variant='body2'>
              {formatNumber(cargo?.distance)} Km
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

          <Typography width={300} align='justify' variant='caption'>
            {cargo?.details.description}
          </Typography>

          <Button disabled={!hasRequirement(aircraft)} variant='outlined'>
            Book this Flight
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Cargo
