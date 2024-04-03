import { Box, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { destinationStore } from 'store/destination.atom'
import { formatNumber } from 'utils'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (callsign: string) => void
  selected: string
  start: string
}

const Destinations = ({ selected, start, onSelect }: Props) => {
  const flights = useRecoilValue(destinationStore)

  return flights && start ? (
    <Stack mt={4} spacing={1}>
      <Box position='sticky' top={0} bgcolor='background.paper'>
        <Typography>Choose a destination:</Typography>
      </Box>
      {flights.destinations.map((destination) => (
        <Paper
          key={destination.callsign}
          onClick={() => onSelect(destination.callsign)}
          sx={{
            cursor: 'pointer',
            border: selected === destination.callsign ? '2px dashed var(--mui-palette-info-main)' : 'none'
          }}
        >
          <Stack direction='row' justifyContent='space-between' p={2} spacing={2}>
            <Typography>
              {destination.callsign.split('_')[0]} - {destination.name}
            </Typography>
            <Typography>{formatNumber(destination.distance, 0)} Km</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  ) : null
}

export default Destinations
