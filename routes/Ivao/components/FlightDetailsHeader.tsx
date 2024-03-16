import Close from '@mui/icons-material/Close'
import React from 'react'
import { IvaoPilot, LastTrackStateEnum } from 'types'
import { stateColors, stateIcons } from '../constants'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'

interface Props {
  selected: boolean
  pilot: IvaoPilot
  onClickPilot: () => void
  onUnSelectPilot: () => void
}

const FlightDetailsHeader = ({ selected, onClickPilot, onUnSelectPilot, pilot }: Props) => {
  const { palette } = useTheme()

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
            backgroundColor: palette.primary.contrastText
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
