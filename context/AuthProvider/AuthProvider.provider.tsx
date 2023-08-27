import React, { FC, useCallback, useReducer } from 'react'
import authProviderReducer from './AuthProvider.reducer'
import { AuthProviderContext } from './AuthProvider.context'
import { AuthReducerState } from './AuthProvider.types'
import { User } from 'types'

export const INITIAL_STATE: AuthReducerState = {
  user: undefined,
  token: undefined
}

export const AuthProvider: FC<{ children: React.ReactNode; user: User }> = ({ children, user }) => {
  const [state, dispatch] = useReducer(authProviderReducer, {
    ...INITIAL_STATE,
    ...(user ? { user } : {})
  })
  const { Provider } = AuthProviderContext

  const signIn = useCallback((user: User) => {
    dispatch({ type: 'SIGN_IN', payload: user })
  }, [])

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' })
  }, [])

  return (
    <Provider
      value={{
        user: state.user,
        signIn,
        signOut
      }}
    >
      {children}
    </Provider>
  )
}
