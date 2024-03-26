import { AircraftReducerHandler } from './AircraftProvider.types'

export const mainProviderReducer: AircraftReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_AIRCRAFTS':
      return {
        ...state,
        aircrafts: action.payload
      }
    case 'SET_OWNED_AIRCRAFTS':
      return {
        ...state,
        ownedAircrafts: action.payload
      }
    default:
      return state
  }
}

export default mainProviderReducer
