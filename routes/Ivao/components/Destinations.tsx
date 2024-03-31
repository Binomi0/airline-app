import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { destinationStore } from 'store/destination.atom'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (callsign: string) => void
  selected: string
}

const Destinations = ({ selected, onSelect }: Props) => {
  const flights = useRecoilValue(destinationStore)

  console.log(flights?.destinations)
  return flights && selected ? (
    <Stack mt={2} spacing={1}>
      <Typography paragraph>Choose a destination:</Typography>
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
            <Typography>{destination.distance} Km</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  ) : null
}

export default Destinations
