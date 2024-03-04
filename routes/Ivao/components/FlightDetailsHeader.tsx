import Close from '@mui/icons-material/Close'
import { CardHeader, Stack, Button, IconButton, Avatar } from '@mui/material'
import React from 'react'
import { IvaoPilot, LastTrackStateEnum } from 'types'
import { stateColors, stateIcons } from '../constants'

interface Props {
  selected: boolean
  pilot: IvaoPilot
  onClickPilot: () => void
  onUnSelectPilot: () => void
}

const FlightDetailsHeader = ({ selected, onClickPilot, onUnSelectPilot, pilot }: Props) => {
  return (
    <CardHeader
      action={
        <Stack spacing={2} direction='row'>
          <Button
            disabled={selected}
            size='small'
            variant='contained'
            onClick={onClickPilot}
            color={stateColors[pilot.lastTrack.state as LastTrackStateEnum]}
          >
            {pilot.lastTrack.state}
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
          {pilot ? stateIcons[pilot.lastTrack.state as LastTrackStateEnum] : '?'}
        </Avatar>
      }
      title={`FLIGHT DETECTED (${pilot.flightPlan.aircraftId}) - [${pilot.callsign}]`}
      subheader={`${pilot.flightPlan.departureId} - ${pilot.flightPlan.arrivalId} (${pilot.lastTrack.state})`}
    />
  )
}

export default FlightDetailsHeader
