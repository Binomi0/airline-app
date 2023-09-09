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
  useTheme,
  IconButton
} from '@mui/material'
import moment from 'moment'
import React, { ReactNode } from 'react'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightIcon from '@mui/icons-material/Flight'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import AirlinesIcon from '@mui/icons-material/Airlines'
import type { IvaoPilot, LastTrackStateEnum } from 'types'
import { useRouter } from 'next/router'
import useCargo from 'hooks/useCargo'
import { NFT } from '@thirdweb-dev/react'
import Swal from 'sweetalert2'
import axios from 'config/axios'
import { Close } from '@mui/icons-material'

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
const FlightDetails: React.FC<{ aircraft?: NFT; session: IvaoPilot; onSelect: () => void; index: number }> = ({
  session,
  onSelect,
  index,
  aircraft
}) => {
  const router = useRouter()
  const { palette } = useTheme()
  const [size, setSize] = React.useState(6)
  const { cargo, newCargo } = useCargo()

  const flightValue = React.useMemo(() => {
    if (!session?.lastTrack) return 0
    const { arrivalDistance, departureDistance } = session.lastTrack

    const totalDistance = departureDistance + arrivalDistance
    const completed = totalDistance - arrivalDistance

    return (completed / totalDistance) * 100
  }, [session?.lastTrack])

  const handleSelectPilot = React.useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Callsign ${session.callsign}`,
      text: 'Are you ready for this flight? Confirm to start.',
      icon: 'question',
      showCancelButton: true
    })
    if (isConfirmed) {
      const { data } = await axios.post('/api/cargo/new', { ...cargo })
      await axios.post('/api/live/new', { cargo: data })
      router.push('/live')
    }
  }, [cargo, router, session.callsign])

  const handleNewCargo = React.useCallback(async () => {
    if (!aircraft) return
    await newCargo(
      { origin: session.flightPlan.departureId, destination: session.flightPlan.arrivalId },
      aircraft,
      session.callsign
    )
  }, [aircraft, newCargo, session.callsign, session.flightPlan.arrivalId, session.flightPlan.departureId])

  const handleClickPilot = React.useCallback(async () => {
    await handleNewCargo()
    onSelect()
    setSize((s) => (s === 12 ? 6 : 12))
  }, [handleNewCargo, onSelect])

  return (
    <Grid item xs={size} key={session.id}>
      <Card
        sx={{
          boxSizing: 'border-box',
          backgroundColor: index === 0 && size === 12 ? palette.secondary.light : palette.common.white,
          boxShadow: index === 0 && size === 12 ? `0 0 50px ${palette.primary.dark}` : 'none'
        }}
      >
        <CardHeader
          action={
            <Stack spacing={2} direction='row'>
              <Button
                disabled={size === 12}
                size='small'
                variant='contained'
                onClick={handleClickPilot}
                color={stateColors[session.lastTrack.state as LastTrackStateEnum]}
              >
                {session.lastTrack.state}
              </Button>
              {size === 12 && (
                <IconButton onClick={() => setSize(6)}>
                  <Close />
                </IconButton>
              )}
            </Stack>
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
          {size === 6 && <Box my={4}>Ground speed: {session.lastTrack.groundSpeed}</Box>}
        </CardContent>
        {size === 12 && (
          <Card>
            <CardHeader
              title={`${Intl.NumberFormat('es-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                cargo?.prize || 0
              )} AIRL`}
              subheader={`${cargo?.weight} KG - ${cargo?.details?.name}`}
            />
            <CardContent>{cargo?.details?.description}</CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button size='large' variant='contained' onClick={handleSelectPilot}>
                Select
              </Button>
            </CardActions>
          </Card>
        )}
      </Card>
    </Grid>
  )
}

export default FlightDetails
