import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { destinationStore } from 'store/destination.atom'
import { findByCallsign, formatNumber } from 'utils'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (callsign: string) => void
  isAllowed: boolean
  selected: string
  start: string
  end: string
}

const Destinations = ({ isAllowed, selected, start, end, onSelect }: Props) => {
  const flights = useRecoilValue(destinationStore)

  const current = useMemo(() => {
    if (!start || !end || !flights) return
    return flights.destinations.find(findByCallsign(selected))
  }, [end, flights, selected, start])

  const handleSelect = useCallback(
    (callsign: string) => {
      onSelect(callsign)
    },
    [onSelect]
  )

  return flights && start ? (
    <Stack mt={4} spacing={1}>
      {start && end && (
        <Paper
          key={end}
          sx={{
            cursor: 'pointer',
            border: `2px dashed var(--mui-palette-${isAllowed ? 'success' : 'error'}-main)`
          }}
        >
          <Stack direction='row' justifyContent='space-between' p={2} spacing={2}>
            <Typography>
              {current?.callsign.split('_')[0]} - {current?.name}
            </Typography>
            <Typography>{formatNumber(current?.distance, 0)} Km</Typography>
          </Stack>
        </Paper>
      )}
      <Box position='sticky' top={0} bgcolor='background.paper'>
        <Typography>Choose a destination:</Typography>
      </Box>

      {flights.destinations.map((destination) => (
        <Paper
          key={destination.callsign}
          onClick={() => handleSelect(destination.callsign)}
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
