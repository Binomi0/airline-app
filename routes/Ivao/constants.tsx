import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightIcon from '@mui/icons-material/Flight'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import AirlinesIcon from '@mui/icons-material/Airlines'
import { LastTrackStateEnum } from 'types'
import { ReactNode } from 'react'

export const stateIcons: Record<LastTrackStateEnum, ReactNode> = {
  'En Route': <ConnectingAirportsIcon color='primary' fontSize='large' />,
  Boarding: <FlightIcon color='info' fontSize='large' />,
  Approach: <FlightLandIcon color='secondary' fontSize='large' />,
  Departing: <FlightTakeoffIcon color='warning' fontSize='large' />,
  'On Blocks': <AirplaneTicketIcon color='info' fontSize='large' />,
  'Initial Climb': <FlightTakeoffIcon color='warning' fontSize='large' />,
  Landed: <AirlinesIcon color='success' fontSize='large' />
}

export const stateColors: Record<
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

