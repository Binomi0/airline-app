import { AircraftReducerHandler } from './AircraftProvider.types'

export const mainProviderReducer: AircraftReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_BASE_SIGNER':
      return {
        ...state,
        baseSigner: action.payload
      }
    default:
      return state
  }
}

export default mainProviderReducer
