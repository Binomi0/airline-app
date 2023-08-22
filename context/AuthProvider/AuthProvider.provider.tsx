import React, { FC, useCallback, useEffect, useReducer } from 'react'
import authProviderReducer from './AuthProvider.reducer'
import { AuthProviderContext } from './AuthProvider.context'
import { AuthReducerState } from './AuthProvider.types'
import { User } from 'types'

export const INITIAL_STATE: AuthReducerState = {
  user: undefined
}

export const AuthProvider: FC<{ children: React.ReactNode; user?: User }> = ({ children, user }) => {
  const [state, dispatch] = useReducer(authProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = AuthProviderContext

  const signIn = useCallback((user?: User) => {
    dispatch({ type: 'SIGN_IN', payload: user })
  }, [])

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' })
  }, [])

  useEffect(() => {
    if (!state.user && user) {
      signIn(user)
    }
  }, [signIn, state.user, user])

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
