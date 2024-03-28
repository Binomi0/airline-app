import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { destinationStore } from 'store/destination.atom'

const Destinations = () => {
  const flights = useRecoilValue(destinationStore)

  return flights ? (
    <Stack mt={2} spacing={1}>
      {flights.destinations.map((destination) => (
        <Paper key={destination.callsign}>
          <Stack direction='row' justifyContent='space-between' p={2} spacing={2}>
            <Typography>{destination.name}</Typography>
            <Typography>{destination.distance} Km</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  ) : null
}

export default Destinations
