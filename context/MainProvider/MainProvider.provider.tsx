import React, { FC, useCallback, useReducer } from 'react'
import mainProviderReducer from './MainProvider.reducer'
import { MainProviderContext } from './MainProvider.context'
import { MainReducerState } from './MainProvider.types'

export const INITIAL_STATE: MainReducerState = {
  sidebarOpen: false,
  rightSidebarOpen: false
}

export const MainProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mainProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = MainProviderContext

  const toggleSidebar = useCallback((side: 'left' | 'right') => {
    dispatch({ type: 'TOGGLE_SIDEBAR', payload: side })
  }, [])

  return (
    <Provider
      value={{
        sidebarOpen: state.sidebarOpen,
        rightSidebarOpen: state.rightSidebarOpen,
        toggleSidebar
      }}
    >
      {children}
    </Provider>
  )
}
