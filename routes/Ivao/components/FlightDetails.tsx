import { CardContent, Stack, Typography, LinearProgress, Box } from '@mui/material'
import moment from 'moment'
import React from 'react'
import type { IvaoPilot, LastTrackStateEnum } from 'types'
import { stateColors } from '../constants'

interface Props {
  pilot: IvaoPilot
  selected: boolean
}

const FlightDetails = ({ pilot, selected }: Props) => {
  const flightValue = React.useMemo(() => {
    if (!pilot?.lastTrack) return 0
    const { arrivalDistance, departureDistance } = pilot.lastTrack

    const totalDistance = departureDistance + arrivalDistance
    const completed = totalDistance - arrivalDistance

    return (completed / totalDistance) * 100
  }, [pilot?.lastTrack])

  return (
    <CardContent>
      <Stack height='24px' direction='row' justifyContent='space-between' alignItems='flex-start'>
        <Typography>
          {moment
            .utc(pilot.flightPlan.departureTime * 1000)
            .add(2, 'hours')
            .format('HH:mm')}
          h
        </Typography>
        <Stack width='75%'>
          <LinearProgress
            color={stateColors[pilot.lastTrack.state as LastTrackStateEnum]}
            variant='determinate'
            value={flightValue}
          />
          <Typography textAlign='center' variant='caption'>
            {moment.utc(pilot.flightPlan.eet * 1000).format('H[h] mm[m]')}
          </Typography>
        </Stack>
        <Typography>
          {moment
            .utc((pilot.flightPlan.departureTime + pilot.flightPlan.eet) * 1000)
            .add(2, 'hours')
            .format('HH:mm')}
          h
        </Typography>
      </Stack>
      {!selected && <Box my={4}>Ground speed: {pilot.lastTrack.groundSpeed}</Box>}
    </CardContent>
  )
}

export default FlightDetails
