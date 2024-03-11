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
}

export const AuthProvider = ({ children, user }: Props) => {
  const [state, dispatch] = useReducer(authProviderReducer, {
    ...INITIAL_STATE,
    user
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
