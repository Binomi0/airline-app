import { Close } from '@mui/icons-material'
import { CardHeader, Stack, Button, IconButton, Avatar } from '@mui/material'
import React from 'react'
import { IvaoPilot, LastTrackStateEnum } from 'types'
import { stateColors, stateIcons } from '../constants'

interface Props {
  selected: boolean
  session: IvaoPilot
  onClickPilot: () => void
  onUnSelectPilot: () => void
}

const FlightDetailsHeader = ({ selected, onClickPilot, onUnSelectPilot, session }: Props) => {
  return (
    <CardHeader
      action={
        <Stack spacing={2} direction='row'>
          <Button
            disabled={selected}
            size='small'
            variant='contained'
            onClick={onClickPilot}
            color={stateColors[session.lastTrack.state as LastTrackStateEnum]}
          >
            {session.lastTrack.state}
          </Button>
          {selected && (
            <IconButton onClick={onUnSelectPilot}>
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
  )
}

export default FlightDetailsHeader
