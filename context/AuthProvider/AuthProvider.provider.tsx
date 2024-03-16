import React, { useCallback, useReducer } from 'react'
import authProviderReducer from './AuthProvider.reducer'
import { AuthProviderContext } from './AuthProvider.context'
import { AuthReducerState } from './AuthProvider.types'
import { User } from 'types'

export const INITIAL_STATE: AuthReducerState = {
  user: undefined,
  token: undefined
}

interface Props {
  children: React.ReactNode
  user?: User
  token?: string
}

export const AuthProvider = ({ children, user, token }: Props) => {
  const [state, dispatch] = useReducer(authProviderReducer, {
    ...INITIAL_STATE,
    user,
    token
  })
  const { Provider } = AuthProviderContext

  const signIn = useCallback((auth: AuthReducerState) => {
    dispatch({ type: 'SIGN_IN', payload: auth })
  }, [])

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' })
  }, [])

  return (
    <Provider
      value={{
        token,
        user: state.user,
        signIn,
        signOut
      }}
    >
      {children}
    </Provider>
  )
}
