import { LicenseReducerHandler } from './LicenseProvider.types'

export const mainProviderReducer: LicenseReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SET_OWNED_LICENSE':
      return {
        ...state,
        ownedLicenses: action.payload
      }
    case 'SET_LICENSES':
      return {
        ...state,
        licenses: action.payload
      }
    default:
      return state
  }
}

export default mainProviderReducer
