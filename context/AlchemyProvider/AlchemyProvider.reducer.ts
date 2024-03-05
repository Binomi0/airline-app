import { AlchemyReducerHandler } from './AlchemyProvider.types'

export const mainProviderReducer: AlchemyReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_BASE_SIGNER':
      return {
        ...state,
        baseSigner: action.payload
      }
    case 'SET_SMART_SIGNER':
      return {
        ...state,
        smartSigner: action.payload
      }
    case 'SET_SMART_ACCOUNT_ADDRESS':
      return {
        ...state,
        smartAccountAddress: action.payload
      }
    default:
      return state
  }
}

export default mainProviderReducer
