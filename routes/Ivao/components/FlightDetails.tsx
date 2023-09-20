import { CardContent, Stack, Typography, LinearProgress, Box } from '@mui/material'
import moment from 'moment'
import React from 'react'
import type { IvaoPilot, LastTrackStateEnum } from 'types'
import { stateColors } from '../constants'

interface Props {
  session: IvaoPilot
  selected: boolean
}

const FlightDetails = ({ session, selected }: Props) => {

  const flightValue = React.useMemo(() => {
    if (!session?.lastTrack) return 0
    const { arrivalDistance, departureDistance } = session.lastTrack

    const totalDistance = departureDistance + arrivalDistance
    const completed = totalDistance - arrivalDistance

    return (completed / totalDistance) * 100
  }, [session?.lastTrack])

  return <CardContent>
  <Stack height='24px' direction='row' justifyContent='space-between' alignItems='flex-start'>
    <Typography>
      {moment
        .utc(session.flightPlan.departureTime * 1000)
        .add(2, 'hours')
        .format('HH:mm')}
      h
    </Typography>
    <Stack width='75%'>
      <LinearProgress
        color={stateColors[session.lastTrack.state as LastTrackStateEnum]}
        variant='determinate'
        value={flightValue}
      />
      <Typography textAlign='center' variant='caption'>
        {moment.utc(session.flightPlan.eet * 1000).format('H[h] mm[m]')}
      </Typography>
    </Stack>
    <Typography>
      {moment
        .utc((session.flightPlan.departureTime + session.flightPlan.eet) * 1000)
        .add(2, 'hours')
        .format('HH:mm')}
      h
    </Typography>
  </Stack>
  {!selected && <Box my={4}>Ground speed: {session.lastTrack.groundSpeed}</Box>}
</CardContent>
}

export default FlightDetails
