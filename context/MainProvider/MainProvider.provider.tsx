import React, { FC, useCallback, useReducer } from 'react'
import mainProviderReducer from './MainProvider.reducer'
import { MainProviderContext } from './MainProvider.context'
import { MainReducerState } from './MainProvider.types'
import { useRouter } from 'next/router'

export const INITIAL_STATE: MainReducerState = {
  sidebarOpen: false,
  rightSidebarOpen: false
}

export const MainProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [state, dispatch] = useReducer(mainProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = MainProviderContext

  const toggleSidebar = useCallback((side: 'left' | 'right') => {
    dispatch({ type: 'TOGGLE_SIDEBAR', payload: side })
  }, [])

  const hasMainProvider = ['/signin', '/signup'].includes(router.asPath)

  return (
    <Provider
      value={{
        sidebarOpen: state.sidebarOpen,
        rightSidebarOpen: state.rightSidebarOpen,
        toggleSidebar
      }}
    >
      {!hasMainProvider ? children : null}
    </Provider>
  )
}
