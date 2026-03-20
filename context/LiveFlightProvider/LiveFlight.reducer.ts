import { LiveFlightReducerHandler } from './LiveFlight.types'

export const liveFlightProviderReducer: LiveFlightReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_PILOT':
      return {
        ...state,
        pilot: action.payload
      }

    default:
      return state
  }
}

export default liveFlightProviderReducer
