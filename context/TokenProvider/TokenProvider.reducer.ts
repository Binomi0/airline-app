import { TokenReducerHandler } from './TokenProvider.types'

export const mainProviderReducer: TokenReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_AIRL':
      return {
        ...state,
        airl: action.payload
      }
    case 'SET_AIRG':
      return {
        ...state,
        airg: action.payload
      }
    default:
      return state
  }
}

export default mainProviderReducer
