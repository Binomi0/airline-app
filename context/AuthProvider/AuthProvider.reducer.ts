import { AuthReducerHandler } from './AuthProvider.types'

export const authProviderReducer: AuthReducerHandler = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        user: action.payload
      }
    case 'SIGN_OUT':
      return {
        user: undefined
      }
    default:
      return state
  }
}

export default authProviderReducer
