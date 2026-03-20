import { MainReducerHandler } from './MainProvider.types'

export const mainProviderReducer: MainReducerHandler = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      if (action.payload === 'left') {
        return {
          ...state,
          sidebarOpen: !state.sidebarOpen
        }
      } else if (action.payload === 'right') {
        return {
          ...state,
          rightSidebarOpen: !state.rightSidebarOpen
        }
      }
    default:
      return state
  }
}

export default mainProviderReducer
