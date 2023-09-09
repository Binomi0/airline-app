import { LicenseReducerHandler } from './LicenseProvider.types'

export const mainProviderReducer: LicenseReducerHandler = (state, action) => {
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
