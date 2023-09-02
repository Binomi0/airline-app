import {
  Grid,
  Card,
  CardHeader,
  Button,
  Avatar,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  Box,
  CardActions,
  useTheme
} from '@mui/material'
import moment from 'moment'
import React, { ReactNode } from 'react'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightIcon from '@mui/icons-material/Flight'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import AirlinesIcon from '@mui/icons-material/Airlines'
import type { IvaoPilot } from 'types'
import { useRouter } from 'next/router'
import { LastTrackStateEnum } from 'models/Live'

const stateIcons: Record<LastTrackStateEnum, ReactNode> = {
  'En Route': <ConnectingAirportsIcon color='primary' fontSize='large' />,
  Boarding: <FlightIcon color='info' fontSize='large' />,
  Approach: <FlightLandIcon color='secondary' fontSize='large' />,
  Departing: <FlightTakeoffIcon color='warning' fontSize='large' />,
  'On Blocks': <AirplaneTicketIcon color='info' fontSize='large' />,
  'Initial Climb': <FlightTakeoffIcon color='warning' fontSize='large' />,
  Landed: <AirlinesIcon color='success' fontSize='large' />
}

const stateColors: Record<
  LastTrackStateEnum,
  'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
> = {
  'En Route': 'primary',
  Boarding: 'info',
  Approach: 'secondary',
  Departing: 'warning',
  'On Blocks': 'info',
  'Initial Climb': 'warning',
  Landed: 'success'
}

// eslint-disable-next-line no-unused-vars
const FlightDetails: React.FC<{ session: IvaoPilot; onSelect: (callsign: string) => void; index: number }> = ({
  session,
  onSelect,
  index
}) => {
  const router = useRouter()
  const { palette } = useTheme()
  const [size, setSize] = React.useState(6)

  const flightValue = React.useMemo(() => {
    if (!session?.lastTrack) return 0
    const { arrivalDistance, departureDistance } = session.lastTrack

    const totalDistance = departureDistance + arrivalDistance
    const completed = totalDistance - arrivalDistance

    return (completed / totalDistance) * 100
  }, [session?.lastTrack])

  const handleSelectPilot = React.useCallback(() => {
    localStorage.setItem('selected-pilot', session.callsign)
    router.push(
      `/cargo?pilot=${session.callsign}&origin=${session.flightPlan.departureId}&destination=${session.flightPlan.arrivalId}`
    )
  }, [router, session])

  const handleClickPilot = React.useCallback(() => {
    onSelect(session.callsign)
    setSize((s) => (s === 12 ? 6 : 12))
  }, [onSelect, session.callsign])

  return (
    <Grid item xs={size} key={session.id}>
      <Card
        onClick={handleClickPilot}
        sx={{
          boxSizing: 'border-box',
          backgroundColor: index === 0 && size === 12 ? palette.secondary.light : palette.common.white,
          boxShadow: index === 0 && size === 12 ? `0 0 50px ${palette.primary.dark}` : 'none'
        }}
      >
        <CardHeader
          action={
            <Button
              disabled
              size='small'
              variant='contained'
              color={stateColors[session.lastTrack.state as LastTrackStateEnum]}
            >
              {session.lastTrack.state}
            </Button>
          }
          avatar={
            <Avatar
              sx={{
                backgroundColor: 'white'
              }}
            >
              {session ? stateIcons[session.lastTrack.state as LastTrackStateEnum] : '?'}
            </Avatar>
          }
          title={`FLIGHT DETECTED (${session.flightPlan.aircraftId}) - [${session.callsign}]`}
          subheader={`${session.flightPlan.departureId} - ${session.flightPlan.arrivalId} (${session.lastTrack.state})`}
        />
        <CardContent>
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
              {/* (
                      {moment
                        .utc(session.flightPlan.eet * 1000)
                        .format("H[h] mm[m]")}
                      ) */}
            </Typography>
          </Stack>
          <Box my={4}>Ground speed: {session.lastTrack.groundSpeed}</Box>
        </CardContent>
        {size === 12 && (
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleSelectPilot}>
              Select
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  )
}

export default FlightDetails
