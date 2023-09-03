/* eslint-disable no-unused-vars */
type Actions = ToggleSidebar
type ToggleSidebar = Readonly<{ type: 'TOGGLE_SIDEBAR', payload: 'left' | 'right' }>

export type MainReducerState = {
  sidebarOpen: boolean
  rightSidebarOpen: boolean
}

export type MainContextProps = MainReducerState & {
  toggleSidebar: (side: 'left' | 'right') => void
}

export type MainReducerHandler = (state: MainReducerState, action: Actions) => MainReducerState
