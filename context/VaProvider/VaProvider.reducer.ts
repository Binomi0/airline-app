import { Atc, IvaoPilot, LastTrackStateEnum } from 'types'
import { VaReducerHandler } from './VaProvider.types'

const filterPilotsByAtc = (atcs: Readonly<Atc[]>) => (pilot: IvaoPilot) => {
  if (!pilot.flightPlan) return
  const { arrivalId, departureId } = pilot.flightPlan

  return atcs.some((atc) => {
    if (!atc.callsign) return
    const callsign = atc.callsign.slice(0, 4)
    const hasMatch = callsign.includes(arrivalId) || callsign.includes(departureId)
    const isNotTraining = arrivalId !== departureId
    const isBoarding = pilot?.lastTrack?.state === LastTrackStateEnum.Boarding

    return hasMatch && isNotTraining && isBoarding
  })
}

export const vaProviderReducer: VaReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_ATCS':
      return {
        ...state,
        atcs: action.payload,
        pilots: state.pilots.filter(filterPilotsByAtc(action.payload))
      }

    case 'SET_TOWERS': {
      return {
        ...state,
        towers: action.payload
      }
    }
    case 'SET_PILOTS':
      return {
        ...state,
        pilots: action.payload.filter(filterPilotsByAtc(state.atcs))
      }
    case 'SET_FLIGHTS':
      return {
        ...state,
        flights: action.payload
      }
    case 'SET_FILTER':
      return {
        ...state,
        filter: [action.payload]
      }
    default:
      return state
  }
}

export default vaProviderReducer
