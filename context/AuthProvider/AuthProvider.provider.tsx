import React, { FC, useCallback, useEffect, useReducer } from 'react'
import authProviderReducer from './AuthProvider.reducer'
import { AuthProviderContext } from './AuthProvider.context'
import { AuthReducerState } from './AuthProvider.types'
import { User } from 'types'
import { useSession } from 'next-auth/react'

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
  const { update } = useSession()

  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    if (!navigator.onLine) return
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [update])

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === 'visible' && update()
    window.addEventListener('visibilitychange', visibilityHandler, false)
    return () => window.removeEventListener('visibilitychange', visibilityHandler, false)
  }, [update])

  const signIn = useCallback((user: User) => {
    dispatch({ type: 'SIGN_IN', payload: user })
  }, [])

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' })
  }, [])

  // useEffect(() => {
  //   if (user) signIn(user)
  //   else if (!user) signOut()
  // }, [user, signIn, state.user, signOut])

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
