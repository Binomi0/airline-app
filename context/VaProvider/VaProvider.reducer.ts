import { Atc } from 'types'
import { VaReducerHandler } from './VaProvider.types'

const sortAtcs = (a: Atc, b: Atc) => {
  if (a.callsign > b.callsign) {
    return 1
  } else if (a.callsign < b.callsign) {
    return -1
  }
  return 0
}

export const vaProviderReducer: VaReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_ATCS':
      return {
        ...state,
        atcs: action.payload
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
        pilots: action.payload,
      }
    case 'SET_FLIGHTS':
      return {
        ...state,
        flights: action.payload
      }
    case 'SET_CURRENT_PILOT':
      return {
        ...state,
        active: action.payload
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
