import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { Cargo } from 'types'
import { formatNumber, getNFTAttributes } from 'utils'
import { NFT } from '@thirdweb-dev/sdk'
import ExploreOffIcon from '@mui/icons-material/ExploreOff'
import Image from 'next/image'
import { MediaRenderer } from '@thirdweb-dev/react'

enum AircraftRanges {
  'Cessna 172' = '700',
  'Cessna C700 Longitude' = '3000',
  'Boeing 737-600' = '6000',
  'Antonov An-225 Mriya' = '14000'
}

interface Props {
  cargo: Cargo
  aircrafts: NFT[]
}

const Cargo = ({ cargo, aircrafts }: Props) => {
  const [aircraft, setAircraft] = useState<string>('-1')

  const handleChange = (event: SelectChangeEvent) => {
    setAircraft(event.target.value as string)
  }

  const hasRequirement = (requirement?: string) => {
    if (!requirement) return false
    const aircraft = aircrafts.find((aircraft) => aircraft.metadata.id === requirement)
    if (!aircraft) return false

    const range = AircraftRanges[aircraft.metadata.name as keyof typeof AircraftRanges]
    const result = Number(range) >= Number(cargo.distance)

    return result
  }

  useEffect(() => {
    setAircraft('-1')
  }, [cargo])

  return (
    <Paper elevation={3}>
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' spacing={2} width='100%' p={2}>
          <Stack>
            <Typography>Select an aircraft</Typography>
            {aircrafts[Number(aircraft)] && (
              <Box>
                <MediaRenderer height='128px' width='128px' src={aircrafts[Number(aircraft)].metadata.image} />
              </Box>
            )}
          </Stack>
          <Box>
            <FormControl fullWidth>
              <InputLabel id='select-cargo-aircarft-label'>Aircraft</InputLabel>
              <Select
                error={!hasRequirement(aircraft)}
                fullWidth
                labelId='select-cargo-aircarft-label'
                id='select-cargo-aircarft'
                value={aircraft}
                label='Aircraft'
                onChange={handleChange}
                autoWidth
                sx={{ minWidth: 250 }}
              >
                <MenuItem value='-1'></MenuItem>
                <MenuItem disabled={!hasRequirement('0')} value='0'>
                  <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' spacing={2}>
                    <Typography>Cessna C-172</Typography> {!hasRequirement('0') && <ExploreOffIcon fontSize='small' />}
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
        </Stack>
        <Stack direction='column' alignItems='center' justifyContent='center' mt={2} spacing={1} p={2}>
          <Typography variant='h5'>{cargo.details.name}</Typography>

          <Stack direction='row' justifyContent='space-between' minWidth={300}>
            <Typography align='center'>Distance:</Typography>
            <Typography align='center' variant='body2'>
              {formatNumber(cargo.distance)} Km
            </Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between' minWidth={300}>
            <Typography align='center'>Prize:</Typography>
            <Typography align='center' variant='body2'>
              {formatNumber(cargo.prize)} AIRL
            </Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between' minWidth={300}>
            <Typography align='center'>Rewards: </Typography>
            <Typography align='center' variant='body2'>
              {cargo.rewards ?? '-'}
            </Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between' minWidth={300}>
            <Typography align='center'>Score: </Typography>
            <Typography align='center' variant='body2'>
              {cargo.score ?? '-'}
            </Typography>
          </Stack>

          <Typography width={300} align='justify' variant='caption'>
            {cargo.details.description}
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
